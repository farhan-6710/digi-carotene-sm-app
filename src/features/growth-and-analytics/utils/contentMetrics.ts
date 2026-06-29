import { Bookmark, Eye, Heart, MessageCircle } from "lucide-react";

import type { StatCardItem } from "@/shared/types/statsCards";

import type {
  CategoryDatum,
  ContentPostRow,
  LabeledValue,
  PostRow,
} from "../types/types";
import { formatCompact } from "./formatters";

const TYPE_ORDER: ContentPostRow["mediaType"][] = [
  "Reel",
  "Image",
  "Carousel",
  "Story",
];

const TYPE_COLOR: Record<ContentPostRow["mediaType"], string> = {
  Reel: "var(--chart-1)",
  Image: "var(--chart-3)",
  Carousel: "var(--chart-2)",
  Story: "var(--chart-4)",
};

const TYPE_PLURAL: Record<ContentPostRow["mediaType"], string> = {
  Reel: "Reels",
  Image: "Images",
  Carousel: "Carousels",
  Story: "Stories",
};

export function buildContentStatCards(posts: PostRow[]): StatCardItem[] {
  const count = posts.length;
  const reach = posts.reduce((sum, post) => sum + post.reach, 0);
  const likes = posts.reduce((sum, post) => sum + post.likes, 0);
  const comments = posts.reduce((sum, post) => sum + post.comments, 0);
  const saves = posts.reduce((sum, post) => sum + post.saves, 0);
  const description = `Across ${count} posts`;

  return [
    {
      id: "reach",
      label: "Reach",
      value: formatCompact(reach),
      description: "In selected range",
      icon: Eye,
    },
    {
      id: "likes",
      label: "Total Likes",
      value: formatCompact(likes),
      description,
      icon: Heart,
    },
    {
      id: "comments",
      label: "Comments",
      value: formatCompact(comments),
      description,
      icon: MessageCircle,
    },
    {
      id: "saves",
      label: "Saves",
      value: formatCompact(saves),
      description,
      icon: Bookmark,
    },
  ];
}

export function buildContentTypeSplit(posts: PostRow[]): CategoryDatum[] {
  const counts = new Map<ContentPostRow["mediaType"], number>();
  for (const post of posts) {
    counts.set(post.mediaType, (counts.get(post.mediaType) ?? 0) + 1);
  }

  return TYPE_ORDER.filter((type) => counts.has(type)).map((type) => ({
    key: type.toLowerCase(),
    label: TYPE_PLURAL[type],
    value: counts.get(type) ?? 0,
    color: TYPE_COLOR[type],
  }));
}

export function buildEngagementByType(posts: PostRow[]): LabeledValue[] {
  const totals = new Map<ContentPostRow["mediaType"], { sum: number; count: number }>();
  for (const post of posts) {
    const current = totals.get(post.mediaType) ?? { sum: 0, count: 0 };
    current.sum += post.engagementRate;
    current.count += 1;
    totals.set(post.mediaType, current);
  }

  return TYPE_ORDER.filter((type) => totals.has(type)).map((type) => {
    const agg = totals.get(type)!;
    return {
      label: TYPE_PLURAL[type],
      value: Number((agg.sum / agg.count).toFixed(1)),
    };
  });
}

export function mapPostRows(posts: PostRow[]): ContentPostRow[] {
  return posts.map((post) => ({
    id: post.id,
    caption: post.caption,
    mediaType: post.mediaType,
    reach: post.reach,
    likes: post.likes,
    comments: post.comments,
    saves: post.saves,
    engagementRate: post.engagementRate,
  }));
}
