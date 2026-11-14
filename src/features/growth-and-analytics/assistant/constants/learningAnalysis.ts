/** Learning-tab auto-brief for Pulse. */

export type LearningEntityKind = "campaign" | "adset" | "ad";

export type LearningFocus = {
  kind: LearningEntityKind;
  campaignId: string;
  adsetId: string;
  adId: string;
  adAccountId: string;
};

export function isLearningPath(pathname: string): boolean {
  return pathname.includes("/learning");
}

export function resolveLearningFocus(input: {
  pathname: string;
  adAccountId: string;
  campaignId: string;
  adsetId: string;
  adId: string;
}): LearningFocus | null {
  if (!isLearningPath(input.pathname) || !input.campaignId) return null;
  if (input.adId) {
    return {
      kind: "ad",
      campaignId: input.campaignId,
      adsetId: input.adsetId,
      adId: input.adId,
      adAccountId: input.adAccountId,
    };
  }
  if (input.adsetId) {
    return {
      kind: "adset",
      campaignId: input.campaignId,
      adsetId: input.adsetId,
      adId: "",
      adAccountId: input.adAccountId,
    };
  }
  return {
    kind: "campaign",
    campaignId: input.campaignId,
    adsetId: "",
    adId: "",
    adAccountId: input.adAccountId,
  };
}

export function learningFocusKey(focus: LearningFocus): string {
  return [
    focus.adAccountId,
    focus.campaignId,
    focus.adsetId || "-",
    focus.adId || "-",
  ].join(":");
}

export function learningEntityNoun(kind: LearningEntityKind): string {
  if (kind === "adset") return "ad set";
  if (kind === "ad") return "ad";
  return "campaign";
}

export function buildLearningAnalysisPrompt(
  kind: LearningEntityKind,
  entityName: string,
): string {
  const noun = learningEntityNoun(kind);
  const label = entityName.trim() || `this ${noun}`;
  return [
    `I am on the Learning tab for ${noun} "${label}".`,
    "Read the current KPIs and Learning benchmark (when available).",
    "Give a short executive brief: what might be going wrong vs target,",
    "likely causes, and 1–3 concrete moves to improve KPI delivery and cut wasted spend.",
    "Keep it tight — verdict first, then bullets.",
  ].join(" ");
}

export function analysingStatusLabel(
  kind: LearningEntityKind,
  entityName: string,
): string {
  const noun = learningEntityNoun(kind);
  const label = entityName.trim() || `this ${noun}`;
  return `Analysing ${label} ${noun}…`;
}
