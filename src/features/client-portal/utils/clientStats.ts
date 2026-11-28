import {
  CalendarClock,
  Camera,
  CheckCircle2,
  ClipboardList,
  FileText,
  FolderKanban,
  Hourglass,
  PenLine,
} from "lucide-react";

import { CLIENT_SHOOT_BOOKINGS_PATH } from "@/features/client-portal/constants/routes";
import type { DevProjectListItem } from "@/features/development-projects/types/types";
import type { OtherProjectListItem } from "@/features/other-projects/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import type { Post } from "@/features/posts-management/types/types";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import type { StatCardItem } from "@/shared/types/statsCards";

export function buildClientStatCards(
  posts: Post[],
  projects: ProjectListItem[] = [],
  plans: ProductionPlan[] = [],
  devProjects: DevProjectListItem[] = [],
  otherProjects: OtherProjectListItem[] = [],
  upcomingShoots = 0,
): StatCardItem[] {
  const projectCount =
    projects.length + devProjects.length + otherProjects.length;
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
      value: String(posts.filter((post) => post.status === "scheduled").length),
      description: "Waiting to go live",
      icon: CalendarClock,
      href: "/client-portal/posts",
    },
    {
      id: "client-posted",
      label: "Posted",
      value: String(posts.filter((post) => post.status === "posted").length),
      description: "Published successfully",
      icon: CheckCircle2,
      href: "/client-portal/posts",
    },
    {
      id: "client-editing",
      label: "Editing",
      value: String(posts.filter((post) => post.status === "editing").length),
      description: "Being prepared by the team",
      icon: PenLine,
      href: "/client-portal/posts",
    },
    {
      id: "client-awaiting-approval",
      label: "Awaiting approval",
      value: String(
        posts.filter((post) => post.status === "sent_for_approval").length,
      ),
      description: "Sent to you for review",
      icon: Hourglass,
      href: "/client-portal/posts",
    },
    {
      id: "client-projects",
      label: "Projects",
      value: String(projectCount),
      description: "Social, development, and other work",
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
    {
      id: "client-upcoming-shoots",
      label: "Upcoming shoots",
      value: String(upcomingShoots),
      description: "Booked shoot slots",
      icon: Camera,
      href: CLIENT_SHOOT_BOOKINGS_PATH,
    },
  ];
}

export function getUpcomingPosts(posts: Post[], limit = 5): Post[] {
  const today = new Date().toISOString().slice(0, 10);

  return posts
    .filter(
      (post) => post.status !== "posted" && post.to_be_posted_date >= today,
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
