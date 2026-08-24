export const LEAD_SCORES = [1, 2, 3, 4, 5] as const;

export type LeadScoreValue = (typeof LEAD_SCORES)[number];

export const LEAD_SCORE_LABELS: Record<LeadScoreValue, string> = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
};

export const DEFAULT_LEAD_SCORE = 1 as const;

/** Score 5 means the lead converted successfully — shown on Conversions. */
export const CONVERTED_LEAD_SCORE = 5 as const;
