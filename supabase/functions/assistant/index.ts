/**
 * Digi Carotene Growth assistant (Pulse): one streamed Gemini turn for the signed-in user.
 * The Gemini key, system instructions and tool list stay here; the browser sends the
 * conversation, runs tool calls with its own Supabase session, and calls again.
 * Reply is NDJSON: `text` events, then `done` with the full turn, or `error`.
 *
 * Deploy:  supabase functions deploy assistant
 * Secret:  supabase secrets set --env-file supabase/functions/.env
 */
import { createClient } from "jsr:@supabase/supabase-js@2";

import {
  buildAssistantInstructions,
  type AssistantContext,
} from "./assistantInstructions.ts";
import { streamTurn, type AssistantContent } from "./gemini.ts";

const MAX_CONTENTS = 40;
const MAX_TEXT = 4_000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function reply(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, {
    status,
    headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
  });
}

type StreamEvent =
  | { type: "text"; text: string }
  | { type: "done"; content: AssistantContent }
  | { type: "error"; error: string };

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : "unknown";
  console.error("[assistant]", message);
  if (message.includes("GEMINI_API_KEY")) {
    return "The assistant is not configured yet.";
  }
  if (message === "FREE_QUOTA") {
    return "The assistant has used today's free quota. Try again later.";
  }
  if (message.startsWith("That message was blocked")) return message;
  return "The assistant is unavailable right now. Try again in a moment.";
}

function parseBody(
  value: unknown,
): { contents: AssistantContent[]; context: AssistantContext } | null {
  if (!value || typeof value !== "object") return null;
  const { contents, context } = value as {
    contents?: unknown;
    context?: unknown;
  };
  if (
    !Array.isArray(contents) ||
    contents.length === 0 ||
    contents.length > MAX_CONTENTS
  ) {
    return null;
  }
  const validContents = contents.every(
    (content) =>
      content &&
      (content.role === "user" || content.role === "model") &&
      Array.isArray(content.parts) &&
      content.parts.length > 0 &&
      (content.role === "model" ||
        content.parts.every(
          (part: { text?: unknown }) =>
            typeof part.text !== "string" || part.text.length <= MAX_TEXT,
        )),
  );
  if (!validContents || !context || typeof context !== "object") return null;
  const raw = context as Record<string, unknown>;
  const safe = (field: unknown, max: number) =>
    typeof field === "string" ? field.slice(0, max) : "";
  return {
    contents: contents as AssistantContent[],
    context: {
      userName: safe(raw.userName, 80),
      today: safe(raw.today, 40),
      currentPath: safe(raw.currentPath, 300),
      adAccountId: safe(raw.adAccountId, 80),
      campaignId: safe(raw.campaignId, 80),
      adsetId: safe(raw.adsetId, 80),
      adId: safe(raw.adId, 80),
    },
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (request.method !== "POST") {
    return reply({ ok: false, error: "Method not allowed." }, 405);
  }

  const authorization = request.headers.get("Authorization");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authorization ?? "" } } },
  );
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return reply({ ok: false, error: "Sign in again to use the assistant." }, 401);
  }

  const body = parseBody(await request.json().catch(() => null));
  if (!body) return reply({ ok: false, error: "Invalid request." }, 400);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      try {
        const content = await streamTurn(
          buildAssistantInstructions(body.context),
          body.contents,
          (text) => send({ type: "text", text }),
        );
        send({ type: "done", content });
      } catch (error) {
        send({ type: "error", error: friendlyError(error) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
});
