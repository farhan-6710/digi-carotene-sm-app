export type ChatThreadKind = "task" | "project";

export type ChatInboxThread = {
  id: string;
  kind: ChatThreadKind;
  title: string;
  preview: string;
  updatedAt: string;
  href: string;
};

export type ChatMentionItem = {
  id: string;
  kind: ChatThreadKind;
  title: string;
  body: string;
  createdAt: string;
  href: string;
};

export type ChatInboxSnapshot = {
  projectThreads: ChatInboxThread[];
  taskThreads: ChatInboxThread[];
  mentions: ChatMentionItem[];
};
