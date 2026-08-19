import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  XCircle,
} from "lucide-react";

import type { ProductionPlan } from "@/features/production-planner/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import type { StatCardItem } from "@/shared/types/statsCards";

export function buildClientStatCards(
  posts: Post[],
  projects: ProjectListItem[] = [],
  plans: ProductionPlan[] = [],
): StatCardItem[] {
  return [
    {
      id: "client-total-posts",
      label: "Total posts",
      value: String(posts.length),
      description: "All content for your brand",
      icon: FileText,
      href: "/client-portal/posts",
    },
    {
      id: "client-scheduled",
      label: "Scheduled",
      value: String(posts.filter((post) => post.status === "Scheduled").length),
      description: "Waiting to go live",
      icon: CalendarClock,
      href: "/client-portal/posts",
    },
    {
      id: "client-posted",
      label: "Posted",
      value: String(posts.filter((post) => post.status === "Posted").length),
      description: "Published successfully",
      icon: CheckCircle2,
      href: "/client-portal/posts",
    },
    {
      id: "client-not-posted",
      label: "Not posted",
      value: String(posts.filter((post) => post.status === "Not posted").length),
      description: "Awaiting publish or follow-up",
      icon: XCircle,
      href: "/client-portal/posts",
    },
    {
      id: "client-projects",
      label: "Projects",
      value: String(projects.length),
      description: "Social accounts for your brand",
      icon: FolderKanban,
      href: "/client-portal/projects",
    },
    {
      id: "client-plans",
      label: "Production plans",
      value: String(plans.length),
      description: "Review content and client approval",
      icon: ClipboardList,
      href: "/client-portal/production-planner",
    },
  ];
}

export function getUpcomingPosts(posts: Post[], limit = 5): Post[] {
  const today = new Date().toISOString().slice(0, 10);

  return posts
    .filter(
      (post) => post.status !== "Posted" && post.to_be_posted_date >= today,
    )
    .sort((a, b) => {
      const dateCompare = a.to_be_posted_date.localeCompare(b.to_be_posted_date);
      if (dateCompare !== 0) {
        return dateCompare;
      }

      return (a.to_be_posted_time ?? "").localeCompare(b.to_be_posted_time ?? "");
    })
    .slice(0, limit);
}
