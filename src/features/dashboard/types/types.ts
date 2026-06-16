export type NeedsAttentionStatus =
  | "Missed"
  | "Due Today"
  | "Needs Review";

export type NeedsAttentionItem = {
  time: string;
  from: string;
  status: NeedsAttentionStatus;
};

export type RecentPost = {
  time: string;
  client: string;
  id: string;
  postType: string;
  status: "Scheduled" | "Posted" | "Missed";
};

export type NeedsAttentionStatusStyle = {
  dot: string;
  text: string;
};
