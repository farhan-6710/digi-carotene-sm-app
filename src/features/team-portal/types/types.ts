export type TeamNeedsAttentionItem = {
  id: string;
  label: string;
  status: "Not posted";
  scheduleLabel: string;
  isOverdue: boolean;
};

export type TeamNeedsAttentionStatusStyle = {
  dot: string;
  text: string;
};