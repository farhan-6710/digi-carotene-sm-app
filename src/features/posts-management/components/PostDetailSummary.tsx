import { format } from "date-fns";
import type { ReactNode } from "react";
import { Link } from "react-router";

import {
  postTypeLabels,
  statusBadgeStyles,
  type SocialPlatform,
  platformColors,
} from "@/features/posts-management/constants/postsManagement";
import { buildPostsDayPath } from "@/features/posts-management/constants/routes";
import type { PostDetailSummaryProps } from "@/features/posts-management/types/components";
import type { PostLinks } from "@/features/posts-management/types/types";
import { buildProjectDetailPath } from "@/features/projects-management/constants/routes";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";
import { cn } from "@/shared/lib/utils";

function formatSchedule(date: string | null, time: string | null): string {
  if (!date) return "—";
  const parsed = parseUrlDateParam(date);
  const dateLabel = parsed ? format(parsed, "MMMM d, yyyy") : date;
  return time?.trim() ? `${dateLabel} · ${time}` : dateLabel;
}

function getLinkHref(links: PostLinks, platform: string): string | null {
  const key = platform.toLowerCase() as keyof PostLinks;
  const href = links[key]?.trim();
  return href || null;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3 sm:px-6">
      <span className="shrink-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm font-medium break-words text-foreground">
        {value}
      </span>
    </div>
  );
}

export function PostDetailSummary({ post }: PostDetailSummaryProps) {
  const projectName = post.project_name?.trim() || "Unknown project";
  const socials = (post.socials ?? []).filter(Boolean);
  const links = post.post_links ?? {};
  const linkEntries = socials
    .map((platform) => {
      const href = getLinkHref(links, platform);
      return href ? { platform, href } : null;
    })
    .filter((entry): entry is { platform: string; href: string } =>
      Boolean(entry),
    );

  const scheduleDate = parseUrlDateParam(post.to_be_posted_date);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Post details
        </p>
        <p className="mt-2 text-base font-semibold text-foreground">
          {post.post_title?.trim() || "Untitled post"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
              statusBadgeStyles[post.status],
            )}
          >
            {post.status}
          </span>
          <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {postTypeLabels[post.post_type]}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        <DetailRow label="Client" value={post.client_name?.trim() || "—"} />
        <DetailRow
          label="Project"
          value={
            <Link
              to={buildProjectDetailPath(post.project_id)}
              className="text-primary hover:underline"
            >
              {projectName}
            </Link>
          }
        />
        <DetailRow
          label="To be posted"
          value={
            scheduleDate ? (
              <Link
                to={buildPostsDayPath(scheduleDate)}
                className="text-primary hover:underline"
              >
                {formatSchedule(post.to_be_posted_date, post.to_be_posted_time)}
              </Link>
            ) : (
              formatSchedule(post.to_be_posted_date, post.to_be_posted_time)
            )
          }
        />
        <DetailRow
          label="Posted on"
          value={formatSchedule(post.posted_date, post.posted_time)}
        />
        <DetailRow
          label="Platforms"
          value={
            socials.length > 0 ? (
              <span className="inline-flex flex-wrap items-center justify-end gap-1.5">
                {socials.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium"
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        platformColors[platform as SocialPlatform] ??
                          "bg-muted-foreground",
                      )}
                    />
                    {platform}
                  </span>
                ))}
              </span>
            ) : (
              "—"
            )
          }
        />
        <DetailRow
          label="Post links"
          value={
            linkEntries.length > 0 ? (
              <span className="inline-flex flex-col items-end gap-1">
                {linkEntries.map(({ platform, href }) => (
                  <a
                    key={`${platform}-${href}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="max-w-full truncate text-primary hover:underline"
                  >
                    {platform}
                  </a>
                ))}
              </span>
            ) : (
              "—"
            )
          }
        />
      </div>
    </div>
  );
}
