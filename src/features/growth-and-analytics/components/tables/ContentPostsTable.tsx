import { Link } from "react-router";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { useGrowthPaths } from "../../hooks/shared/useGrowthPaths";
import { MobileLabel } from "./tableBits";
import type { ContentPostsTableProps } from "../../types/components";
import type { ContentPostRow } from "../../types/types";
import { formatCompact, formatPercent } from "../../utils/shared/formatters";

/**
 * Track mins match the Ovo header widths (Comments ~75px, Eng. rate ~66px).
 * Below that, the card scrolls instead of crushing the caption.
 */
const INSTAGRAM_GRID =
  "max-sm:grid-cols-1 sm:min-w-[53rem] sm:grid-cols-[minmax(10rem,1.8fr)_minmax(4.5rem,0.5fr)_minmax(4.25rem,0.55fr)_minmax(4.25rem,0.55fr)_minmax(5.25rem,0.72fr)_minmax(4.25rem,0.55fr)_minmax(4.5rem,0.6fr)_minmax(5.25rem,0.75fr)]";

const FACEBOOK_GRID =
  "max-sm:grid-cols-1 sm:grid-cols-[minmax(10rem,2.2fr)_minmax(4.5rem,0.55fr)_minmax(5.1rem,0.72fr)_minmax(5.25rem,0.75fr)_minmax(4rem,0.6fr)_minmax(6.5rem,0.95fr)]";

type PostMetricColumn = {
  label: string;
  accent?: boolean;
  value: (row: ContentPostRow) => string;
};

const INSTAGRAM_METRICS: PostMetricColumn[] = [
  { label: "REACH", value: (row) => formatCompact(row.reach) },
  { label: "LIKES", value: (row) => formatCompact(row.likes) },
  { label: "COMMENTS", value: (row) => formatCompact(row.comments) },
  { label: "SAVES", value: (row) => formatCompact(row.saves) },
  { label: "SHARES", value: (row) => formatCompact(row.shares) },
  {
    label: "ENG. RATE",
    accent: true,
    value: (row) => formatPercent(row.engagementRate),
  },
];

const FACEBOOK_METRICS: PostMetricColumn[] = [
  { label: "REACTIONS", value: (row) => formatCompact(row.likes) },
  { label: "COMMENTS", value: (row) => formatCompact(row.comments) },
  { label: "SHARES", value: (row) => formatCompact(row.shares) },
  {
    label: "INTERACTIONS",
    accent: true,
    value: (row) => formatCompact(row.engagementRate),
  },
];

function MetricCell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "font-mono text-sm whitespace-nowrap max-sm:text-left sm:text-right",
        accent ? "text-primary" : "text-foreground",
      )}
    >
      <MobileLabel>{label}</MobileLabel>
      {value}
    </div>
  );
}

export function ContentPostsTable({
  rows,
  variant = "instagram",
}: ContentPostsTableProps) {
  const { buildPostDetailPath } = useGrowthPaths();
  const isFacebook = variant === "facebook";
  const gridClass = isFacebook ? FACEBOOK_GRID : INSTAGRAM_GRID;
  const metricColumns = isFacebook ? FACEBOOK_METRICS : INSTAGRAM_METRICS;

  return (
    <DirectoryTable
      title="Post Performance"
      description="Individual post metrics for the selected account and period."
      gridClass={gridClass}
      columns={[
        { label: "POST" },
        { label: "TYPE" },
        ...metricColumns.map((metric) => ({
          label: metric.label,
          align: "right" as const,
          header: (
            <span className="block whitespace-nowrap">{metric.label}</span>
          ),
        })),
      ]}
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="No posts found for this period."
    >
      {rows.map((row) => {
        const canLink = row.linkToDetail !== false && !isFacebook;
        const metrics = metricColumns.map((metric) => ({
          label: metric.label,
          value: metric.value(row),
          accent: metric.accent,
        }));

        return (
          <div
            key={row.id}
            className={cn(
              "grid items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/10 sm:gap-4 sm:px-6",
              gridClass,
            )}
          >
            <div className="min-w-0 text-sm font-medium text-foreground">
              <div className="flex items-center gap-3">
                {row.postThumbnail ? (
                  <img
                    src={row.postThumbnail}
                    alt=""
                    className="size-10 shrink-0 rounded-md bg-muted object-cover"
                  />
                ) : (
                  <div
                    className="size-10 shrink-0 rounded-md bg-muted"
                    aria-hidden
                  />
                )}
                <div className="min-w-0">
                  {canLink ? (
                    <Link
                      to={buildPostDetailPath(row.id)}
                      className="line-clamp-1 text-primary hover:underline"
                    >
                      {row.caption}
                    </Link>
                  ) : (
                    <span className="line-clamp-1">{row.caption}</span>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                    {row.mediaType}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden text-sm text-muted-foreground sm:block">
              {row.mediaType}
            </div>
            <div
              className={cn(
                "grid gap-x-3 gap-y-2 sm:contents",
                isFacebook ? "grid-cols-2" : "grid-cols-2 min-[400px]:grid-cols-3",
              )}
            >
              {metrics.map((metric) => (
                <MetricCell key={metric.label} {...metric} />
              ))}
            </div>
          </div>
        );
      })}
    </DirectoryTable>
  );
}
