import {
  LineChart,
  Target,
  TrendingDown,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type AssistantSuggestion = {
  label: string;
  icon: LucideIcon;
};

/** Starter questions on the empty assistant panel. */
export const ASSISTANT_SUGGESTIONS: AssistantSuggestion[] = [
  { label: "What is going wrong on this campaign?", icon: TrendingDown },
  { label: "Where can we cut spend without killing results?", icon: Wallet },
  { label: "How do we compare to the Learning benchmark?", icon: Target },
  { label: "Which ad set or ad is wasting budget?", icon: LineChart },
];

/** Matches ASSISTANT_NAME in supabase/functions/assistant/assistantInstructions.ts. */
export const ASSISTANT_NAME = "Pulse";
export const ASSISTANT_SHORTCUT_KEY = "j";
