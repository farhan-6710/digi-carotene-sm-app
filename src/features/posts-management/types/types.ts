export type StatusKey = "Not posted" | "Scheduled" | "Posted";

export type PostLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
};

export type Post = {
  id: string;
  project_id: string;
  project_name?: string;
  client_name?: string;
  post_title: string | null;
  socials: string[] | null;
  post_links: PostLinks | null;
  scheduled_date: string;
  scheduled_time: string;
  posted_date: string | null;
  posted_time: string | null;
  status: StatusKey;
  created_at: string;
};

export type SlotClient = {
  id: string;
  projectId: string;
  name: string;
  clientName?: string;
  postTitle: string | null;
  socials: string[] | null;
  postLinks: PostLinks | null;
  scheduledDate: string;
  scheduledTime: string;
  postedDate: string | null;
  postedTime: string | null;
  status: StatusKey;
};

export type Slot = {
  year: number;
  month: number;
  date: number;
  day: string;
  clients: SlotClient[];
};

export type ActiveSlot = {
  year: number;
  month: number;
  date: number;
  day: string;
};

export type Week = {
  label: string;
  range: string;
  dates: number[];
};

export type PostDateTimeValue = {
  year: number;
  month: number;
  day: number;
  time: string;
};
