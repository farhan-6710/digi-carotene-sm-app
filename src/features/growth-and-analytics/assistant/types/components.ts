import type { AssistantMessage } from "@/shared/types/assistant";

export type AssistantStatus = "idle" | "thinking" | "streaming";

export type AssistantWelcomeProps = {
  name: string;
  onAsk: (question: string) => void;
};

export type AssistantMessagesProps = {
  messages: AssistantMessage[];
  status: AssistantStatus;
  streamingId: string | null;
  error: string | null;
  onNavigate: () => void;
};

export type AssistantReplyProps = {
  message: AssistantMessage;
  live: boolean;
  onNavigate: () => void;
};

export type AssistantComposerProps = {
  disabled: boolean;
  onSend: (question: string) => void;
};

export type AssistantRichTextProps = {
  text: string;
  onNavigate: () => void;
  streaming?: boolean;
};

export type AssistantMarkProps = {
  className?: string;
  active?: boolean;
};
