import { Link } from "react-router";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { useGrowthPaths } from "../../hooks/useGrowthPaths";
import { MobileLabel } from "./tableBits";
import type { ContentPostsTableProps } from "../../types/components";
import { formatCompact, formatPercent } from "../../utils/formatters";

const GRID_CLASS = "grid-cols-[2.4fr_0.75fr_0.7fr_0.7fr_0.7fr_0.8fr]";

export function ContentPostsTable({
  rows,
  variant = "instagram",
}: ContentPostsTableProps) {
  const { buildPostDetailPath } = useGrowthPaths();
  const isFacebook = variant === "facebook";

  return (
    <DirectoryTable
      title="Post Performance"
      description="Individual post metrics for the selected account and period."
      gridClass={GRID_CLASS}
      columns={[
        { label: "POST" },
        { label: "TYPE" },
        {
          label: isFacebook ? "REACTIONS" : "REACH",
          align: "right",
        },
        {
          label: isFacebook ? "COMMENTS" : "LIKES",
          align: "right",
        },
        {
          label: isFacebook ? "SHARES" : "SAVES",
          align: "right",
        },
        {
          label: isFacebook ? "INTERACTIONS" : "ENG. RATE",
          align: "right",
        },
      ]}
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="No posts found for this period."
    >
      {rows.map((row) => {
        const canLink = row.linkToDetail !== false && !isFacebook;
        const primaryMetric = isFacebook ? row.likes : row.reach;
        const secondaryMetric = isFacebook ? row.comments : row.likes;
        const tertiaryMetric = isFacebook ? row.shares : row.saves;

        return (
          <div
            key={row.id}
            className={cn(
              "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
              GRID_CLASS,
            )}
          >
            <div className="min-w-0 text-sm font-medium text-foreground">
              <MobileLabel>POST</MobileLabel>
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
                {canLink ? (
                  <Link
                    to={buildPostDetailPath(row.id)}
                    className="line-clamp-1 min-w-0 text-primary hover:underline"
                  >
                    {row.caption}
                  </Link>
                ) : (
                  <span className="line-clamp-1 min-w-0">{row.caption}</span>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <MobileLabel>TYPE</MobileLabel>
              {row.mediaType}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>{isFacebook ? "REACTIONS" : "REACH"}</MobileLabel>
              {formatCompact(primaryMetric)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>{isFacebook ? "COMMENTS" : "LIKES"}</MobileLabel>
              {formatCompact(secondaryMetric)}
            </div>
            <div className="text-right font-mono text-sm text-foreground">
              <MobileLabel>{isFacebook ? "SHARES" : "SAVES"}</MobileLabel>
              {formatCompact(tertiaryMetric)}
            </div>
            <div className="text-right font-mono text-sm text-primary">
              <MobileLabel>
                {isFacebook ? "INTERACTIONS" : "ENG. RATE"}
              </MobileLabel>
              {isFacebook
                ? formatCompact(row.engagementRate)
                : formatPercent(row.engagementRate)}
            </div>
          </div>
        );
      })}
    </DirectoryTable>
  );
}
