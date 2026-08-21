export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export const TASK_PRIORITY_LABELS: Record<(typeof TASK_PRIORITIES)[number], string> =
  {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
