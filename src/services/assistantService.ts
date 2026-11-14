import { supabase, supabaseConfig } from "@/services/supabaseClient";
import type {
  AssistantContent,
  AssistantContext,
  AssistantStreamEvent,
} from "@/shared/types/assistant";

const FUNCTION_URL = `${supabaseConfig.url}/functions/v1/assistant`;
const UNAVAILABLE = "The assistant is unavailable right now.";

async function* readEvents(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<AssistantStreamEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split("\n");
    buffer = done ? "" : (lines.pop() ?? "");
    for (const line of lines) {
      if (line.trim()) yield JSON.parse(line) as AssistantStreamEvent;
    }
    if (done) return;
  }
}

/**
 * One streamed model turn from the `assistant` Edge Function.
 * Plain fetch — supabase.functions.invoke waits for the whole body.
 */
export async function streamAssistantTurn(
  contents: AssistantContent[],
  context: AssistantContext,
  onText: (text: string) => void,
): Promise<AssistantContent> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again to use the assistant.");

  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: supabaseConfig.publishableKey,
    },
    body: JSON.stringify({ contents, context }),
  });
  if (!response.ok || !response.body) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? UNAVAILABLE);
  }

  let content: AssistantContent | null = null;
  for await (const event of readEvents(response.body)) {
    if (event.type === "text") onText(event.text);
    else if (event.type === "done") content = event.content;
    else if (event.type === "error") throw new Error(event.error || UNAVAILABLE);
  }
  if (!content) throw new Error(UNAVAILABLE);
  return content;
}
