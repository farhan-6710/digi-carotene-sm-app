/**
 * Backfill public.profiles for every Supabase Auth user with role = 'client'.
 *
 * Prerequisites:
 *   - profiles table exists (see src/features/auth/profiles.md)
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local (Dashboard → Settings → API → service_role)
 *   - VITE_SUPABASE_URL in .env.local (same project URL as the app)
 *
 * Usage:
 *   bun run backfill:profiles          # apply
 *   bun run backfill:profiles -- --dry-run
 *
 * Does NOT create rows in public.clients. Link client_id separately for portal access.
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
    [
      "Missing environment variables.",
      "Add to .env.local:",
      "  VITE_SUPABASE_URL=https://<project>.supabase.co",
      "  SUPABASE_SERVICE_ROLE_KEY=<service_role secret>",
    ].join("\n"),
  );
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllAuthUsers() {
  const users = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    users.push(...(data.users ?? []));

    if ((data.users ?? []).length < perPage) {
      break;
    }

    page += 1;
  }

  return users;
}

function fullNameFromUser(user) {
  const meta = user.user_metadata ?? {};
  const fromMeta =
    meta.full_name ?? meta.fullName ?? meta.name ?? meta.display_name;
  if (typeof fromMeta === "string" && fromMeta.trim()) {
    return fromMeta.trim();
  }
  return user.email ?? null;
}

async function main() {
  console.log(
    dryRun
      ? "Dry run — no database writes.\n"
      : "Backfilling profiles with role = client…\n",
  );

  const users = await listAllAuthUsers();
  console.log(`Found ${users.length} auth user(s).\n`);

  if (users.length === 0) {
    return;
  }

  const rows = users.map((user) => ({
    id: user.id,
    role: "client",
    client_id: null,
  }));

  for (const user of users) {
    console.log(
      `  ${user.id}  ${fullNameFromUser(user) ?? "(no name)"}  role=client  client_id=null`,
    );
  }

  if (dryRun) {
    console.log("\nDry run complete. Re-run without --dry-run to apply.");
    return;
  }

  const { data, error } = await admin
    .from("profiles")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("\nUpsert failed:", error.message);
    console.error(
      "\nIf RLS blocked the service role, run the SQL in scripts/backfill-profiles.sql in Supabase SQL Editor instead.",
    );
    process.exit(1);
  }

  console.log(`\nDone. Upserted ${data?.length ?? rows.length} profile row(s).`);
  console.log(
    "Portal login still needs client_id set to a row in public.clients for each user.",
  );
  console.log("Set specific team manually: update profiles set role = 'team' where id = '...';");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
