export const TASK_PRIORITIES = ["normal", "high"] as const;

export const TASK_PRIORITY_LABELS: Record<(typeof TASK_PRIORITIES)[number], string> =
  {
    normal: "Normal",
    high: "High",
  };
