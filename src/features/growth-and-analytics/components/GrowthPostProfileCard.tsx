import { format } from "date-fns";

import { growthPostDetailStatItems } from "../constants/postDetailStats";
import type { GrowthPostProfileCardProps } from "../types/components";
import { formatCompact, formatPercent } from "../utils/formatters";
import { cn } from "@/shared/lib/utils";

export function GrowthPostProfileCard({ view }: GrowthPostProfileCardProps) {
  const { post, accountUsername, mediaTypeLabel } = view;
  const postedOnInstagram = format(
    new Date(post.createdAt),
    "MMM d, yyyy 'at' h:mm a",
  );

  const details = [
    { label: "Account", value: `@${accountUsername}` },
    { label: "Content type", value: mediaTypeLabel },
    { label: "Posted on Instagram", value: postedOnInstagram },
    { label: "Instagram post ID", value: post.postId },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-start">
        {post.postThumbnail ? (
          <img
            src={post.postThumbnail}
            alt=""
            className="size-24 shrink-0 rounded-xl bg-muted object-cover"
          />
        ) : (
          <div
            className="size-24 shrink-0 rounded-xl bg-muted"
            aria-hidden
          />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Post details
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            {mediaTypeLabel} post
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Total reach, views, and engagement this post has earned since it was
            published.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
        {growthPostDetailStatItems.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "px-6 py-4",
              index < growthPostDetailStatItems.length - 1 &&
                "sm:border-r sm:border-border",
              index % 2 === 0 && "border-r border-border sm:border-r",
              index < 4 && "border-b border-border sm:border-b-0",
            )}
          >
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tracking-tight",
                item.valueClassName,
              )}
            >
              {item.label === "Eng. rate"
                ? formatPercent(item.getValue(view))
                : formatCompact(item.getValue(view))}
            </p>
          </div>
        ))}
      </div>

      <div className="divide-y divide-border">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex flex-wrap items-center justify-between gap-2 px-6 py-3"
          >
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {detail.label.toUpperCase()}
            </span>
            <span className="text-sm text-foreground">{detail.value}</span>
          </div>
        ))}

        <div className="px-6 py-4">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Caption
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {post.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
