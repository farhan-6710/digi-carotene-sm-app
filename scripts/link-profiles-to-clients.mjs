/**
 * Links each client profile (role = client, client_id null) to public.clients.
 *
 * For each profile:
 *   1. Resolve a brand name from auth user metadata (full_name) or email.
 *   2. If a client row with that name exists (case-insensitive) → use its id.
 *   3. Otherwise → insert a new clients row and use that id.
 *   4. Update profiles.client_id.
 *
 * Requires service role (same env as backfill-profiles.mjs).
 *
 * Usage:
 *   bun run link:profiles-clients:dry-run
 *   bun run link:profiles-clients
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve(import.meta.dirname, "..");
const dryRun = process.argv.includes("--dry-run");

function loadEnvFile(filename) {
  const path = resolve(ROOT, filename);
  if (!existsSync(path)) return;

  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env or .env.local",
  );
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function brandNameFromUser(user) {
  const meta = user?.user_metadata ?? {};
  const fromMeta =
    meta.full_name ?? meta.fullName ?? meta.name ?? meta.display_name;
  if (typeof fromMeta === "string" && fromMeta.trim()) {
    return fromMeta.trim();
  }
  const email = user?.email ?? "";
  const local = email.split("@")[0]?.replace(/[.+]/g, " ").trim();
  return local || `Client ${user?.id?.slice(0, 8) ?? "unknown"}`;
}

function normalizeName(name) {
  return name.trim().toLowerCase();
}

async function main() {
  console.log(
    dryRun
      ? "Dry run — no writes.\n"
      : "Linking client profiles to public.clients…\n",
  );

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, role, client_id")
    .eq("role", "client");

  if (profilesError) {
    console.error("Failed to load profiles:", profilesError.message);
    process.exit(1);
  }

  const unlinked = (profiles ?? []).filter((p) => !p.client_id);
  if (unlinked.length === 0) {
    console.log("All client profiles already have client_id set.");
    return;
  }

  const { data: clients, error: clientsError } = await admin
    .from("clients")
    .select("id, client_name");

  if (clientsError) {
    console.error("Failed to load clients:", clientsError.message);
    process.exit(1);
  }

  const clientsByName = new Map(
    (clients ?? []).map((c) => [normalizeName(c.client_name), c]),
  );

  for (const profile of unlinked) {
    const { data: userData, error: userError } =
      await admin.auth.admin.getUserById(profile.id);

    if (userError || !userData.user) {
      console.error(`  Skip ${profile.id}: could not load auth user`);
      continue;
    }

    const brandName = brandNameFromUser(userData.user);
    const existing = clientsByName.get(normalizeName(brandName));
    let clientId = existing?.id ?? null;
    let action = existing ? "match" : "create";

    if (!existing) {
      if (dryRun) {
        console.log(
          `  ${profile.id}  "${brandName}"  → would create clients row + set client_id`,
        );
        continue;
      }

      const { data: created, error: createError } = await admin
        .from("clients")
        .insert({ client_name: brandName, socials: {} })
        .select("id, client_name")
        .single();

      if (createError) {
        console.error(
          `  ${profile.id}  failed to create client "${brandName}":`,
          createError.message,
        );
        continue;
      }

      clientId = created.id;
      clientsByName.set(normalizeName(created.client_name), created);
      action = "created";
    } else if (dryRun) {
      console.log(
        `  ${profile.id}  "${brandName}"  → would link to existing client ${clientId}`,
      );
      continue;
    }

    if (!dryRun && clientId) {
      const { error: updateError } = await admin
        .from("profiles")
        .update({ client_id: clientId })
        .eq("id", profile.id);

      if (updateError) {
        console.error(`  ${profile.id}  failed to update profile:`, updateError.message);
        continue;
      }

      console.log(
        `  ${profile.id}  "${brandName}"  → ${action} client_id=${clientId}`,
      );
    }
  }

  if (dryRun) {
    console.log("\nDry run complete. Run: bun run link:profiles-clients");
  } else {
    console.log("\nDone. Log out and log in, then open /portal/dashboard.");
    console.log(
      "If portal data is empty, run scripts/portal-data-rls.sql for client read access.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
