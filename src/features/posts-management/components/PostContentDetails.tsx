import { format } from "date-fns";
import type { ReactNode } from "react";

import {
  postTypeLabels,
  type SocialPlatform,
  platformColors,
} from "@/features/posts-management/constants/postsManagement";
import type { PostContentDetailsProps } from "@/features/posts-management/types/components";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";
import { cn } from "@/shared/lib/utils";

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="space-y-1.5 px-5 py-3 sm:px-6">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <div className="text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
        {value}
      </div>
    </div>
  );
}

function formatShootDate(date: string | null): string {
  if (!date) return "—";
  const parsed = parseUrlDateParam(date);
  return parsed ? format(parsed, "MMMM d, yyyy") : date;
}

export function PostContentDetails({ content }: PostContentDetailsProps) {
  const socials = (content.socials ?? []).filter(Boolean);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Post content
        </p>
        <p className="mt-2 text-base font-semibold text-foreground">
          {content.title?.trim() || "Untitled content"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Production plan details for this posting.
        </p>
      </div>

      <div className="divide-y divide-border">
        <DetailBlock
          label="Content pillar"
          value={content.contentPillar?.trim() || "—"}
        />
        <DetailBlock
          label="Shoot date"
          value={formatShootDate(content.shootDate)}
        />
        <DetailBlock
          label="Context description"
          value={content.contextDescription?.trim() || "—"}
        />
        <DetailBlock label="Script" value={content.script?.trim() || "—"} />
        <DetailBlock
          label="Reference link"
          value={
            content.referenceLink?.trim() ? (
              <a
                href={content.referenceLink.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {content.referenceLink.trim()}
              </a>
            ) : (
              "—"
            )
          }
        />
        <DetailBlock
          label="Post type"
          value={postTypeLabels[content.postType]}
        />
        <DetailBlock
          label="Platforms"
          value={
            socials.length > 0 ? (
              <span className="inline-flex flex-wrap items-center gap-1.5">
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
        {content.shootNotes?.trim() ? (
          <DetailBlock label="Shoot notes" value={content.shootNotes.trim()} />
        ) : null}
      </div>
    </div>
  );
}
