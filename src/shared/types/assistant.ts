/**
 * Gemini generateContent shapes, matching supabase/functions/assistant/gemini.ts.
 * Model turns are sent back exactly as received so thought signatures survive.
 */
export type AssistantPart = {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
  functionCall?: { id?: string; name: string; args?: Record<string, unknown> };
  functionResponse?: {
    id?: string;
    name: string;
    response: Record<string, unknown>;
  };
};

export type AssistantContent = {
  role: "user" | "model";
  parts: AssistantPart[];
};

export type AssistantContext = {
  userName: string;
  today: string;
  currentPath: string;
  adAccountId: string;
  campaignId: string;
  adsetId: string;
  adId: string;
};

export type AssistantStreamEvent =
  | { type: "text"; text: string }
  | { type: "done"; content: AssistantContent }
  | { type: "error"; error: string };

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type AssistantToolArgs = Record<string, unknown>;
export type AssistantToolResult = Record<string, unknown>;
