import { CalendarCheck, CheckCircle, Layers, Users } from "lucide-react";

import type { Post } from "@/features/posts-management/types/types";
import type { StatCardItem } from "@/shared/types/statsCards";

function toPercent(part: number, whole: number): string {
  if (whole === 0) {
    return "0%";
  }
  return `${Math.round((part / whole) * 100)}%`;
}

export function buildAgencyStatCards(posts: Post[]): StatCardItem[] {
  const published = posts.filter((post) => post.status === "Posted");
  const activeClients = new Set(
    posts.map((post) => post.client_name ?? "Unknown client"),
  ).size;

  const publishedWithDate = published.filter((post) => post.posted_date);
  const onTime = publishedWithDate.filter(
    (post) => (post.posted_date ?? "") <= post.to_be_posted_date,
  ).length;

  return [
    {
      id: "agency-total",
      label: "Total Posts",
      value: String(posts.length),
      description: "All-time content pieces",
      icon: Layers,

    },
    {
      id: "agency-published",
      label: "Published",
      value: String(published.length),
      description: `${toPercent(published.length, posts.length)} of all posts`,
      icon: CheckCircle,
    },
    {
      id: "agency-clients",
      label: "Clients Served",
      value: String(activeClients),
      description: "Brands with content",
      icon: Users,
    },
    {
      id: "agency-on-time",
      label: "On-time Rate",
      value: toPercent(onTime, publishedWithDate.length),
      description: "Published on or before plan",
      icon: CalendarCheck,
      trend: onTime >= publishedWithDate.length - onTime ? "positive" : "negative",
    },
  ];
}
