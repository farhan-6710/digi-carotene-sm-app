import { ASSISTANT_TOOLS } from "./assistantTools.ts";

export interface AssistantPart {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
  functionCall?: { id?: string; name: string; args?: Record<string, unknown> };
  functionResponse?: {
    id?: string;
    name: string;
    response: Record<string, unknown>;
  };
}

export interface AssistantContent {
  role: "user" | "model";
  parts: AssistantPart[];
}

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
/**
 * Fixed to a free-tier model with the largest free request allowance. Not configurable on purpose,
 * so no environment setting can switch the assistant to a paid model.
 */
const MODEL = "gemini-3.5-flash-lite";
/** Analysis replies may need longer; 90s still fails closed on hang. */
const TIMEOUT_MS = 90_000;

interface GeminiChunk {
  candidates?: { content?: { parts?: AssistantPart[] } }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

function isPlainText(part: AssistantPart): boolean {
  return typeof part.text === "string" && !part.functionCall && !part.thought;
}

function appendPart(parts: AssistantPart[], part: AssistantPart): AssistantPart[] {
  const last = parts.at(-1);
  if (last && isPlainText(last) && !last.thoughtSignature && isPlainText(part)) {
    return [
      ...parts.slice(0, -1),
      { ...last, ...part, text: `${last.text}${part.text}` },
    ];
  }
  return [...parts, part];
}

async function* readEvents(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<GeminiChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split(/\r?\n/);
    buffer = done ? "" : (lines.pop() ?? "");
    for (const line of lines) {
      if (line.startsWith("data:")) yield JSON.parse(line.slice(5)) as GeminiChunk;
    }
    if (done) return;
  }
}

/**
 * One streamed generateContent call. `onText` receives each piece of answer text as Gemini sends
 * it; the full turn is returned at the end so the browser can send it back with signatures intact.
 */
export async function streamTurn(
  systemInstruction: string,
  contents: AssistantContent[],
  onText: (text: string) => void,
): Promise<AssistantContent> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");

  const response = await fetch(
    `${GEMINI_URL}/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        tools: ASSISTANT_TOOLS,
        generationConfig: { temperature: 0.35, maxOutputTokens: 4096 },
      }),
    },
  );

  if (response.status === 429) throw new Error("FREE_QUOTA");
  if (!response.ok || !response.body) {
    const data = (await response.json().catch(() => null)) as GeminiChunk | null;
    throw new Error(data?.error?.message ?? `Gemini returned ${response.status}.`);
  }

  let parts: AssistantPart[] = [];
  for await (const chunk of readEvents(response.body)) {
    if (chunk.error) throw new Error(chunk.error.message ?? "Gemini stopped answering.");
    if (chunk.promptFeedback?.blockReason) {
      throw new Error("That message was blocked. Try rephrasing it.");
    }
    for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
      if (part.text && !part.thought) onText(part.text);
      parts = appendPart(parts, part);
    }
  }

  const kept = parts.filter(
    (part) => part.functionCall || part.thoughtSignature || part.text,
  );
  if (!kept.length) {
    throw new Error("The assistant had no answer. Try asking another way.");
  }
  return { role: "model", parts: kept };
}
