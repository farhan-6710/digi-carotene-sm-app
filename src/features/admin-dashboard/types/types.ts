export type AdminNeedsAttentionStatus =
  | "Missed"
  | "Due Today"
  | "Needs Review";

export type AdminNeedsAttentionItem = {
  time: string;
  from: string;
  status: AdminNeedsAttentionStatus;
};

export type AdminRecentPost = {
  time: string;
  client: string;
  id: string;
  postType: string;
  status: "Scheduled" | "Posted" | "Missed";
};

export type AdminNeedsAttentionStatusStyle = {
  dot: string;
  text: string;
};
