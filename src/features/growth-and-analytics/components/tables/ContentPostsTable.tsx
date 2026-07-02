import { Link } from "react-router";

import { buildGrowthPostDetailPath } from "../../constants/routes";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { MobileLabel } from "./tableBits";
import type { ContentPostsTableProps } from "../../types/components";
import { formatCompact, formatPercent } from "../../utils/formatters";

const GRID_CLASS =
  "grid-cols-[2.4fr_0.75fr_0.7fr_0.7fr_0.7fr_0.8fr]";

export function ContentPostsTable({ rows }: ContentPostsTableProps) {
  return (
    <DirectoryTable
      title="Post Performance"
      description="Individual post metrics for the selected account and period."
      gridClass={GRID_CLASS}
      columns={[
        { label: "POST" },
        { label: "TYPE" },
        { label: "REACH", align: "right" },
        { label: "LIKES", align: "right" },
        { label: "SAVES", align: "right" },
        { label: "ENG. RATE", align: "right" },
      ]}
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="No posts found for this period."
    >
      {rows.map((row) => (
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
              <Link
                to={buildGrowthPostDetailPath(row.id)}
                className="line-clamp-1 min-w-0 text-primary hover:underline"
              >
                {row.caption}
              </Link>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <MobileLabel>TYPE</MobileLabel>
            {row.mediaType}
          </div>
          <div className="text-right font-mono text-sm text-foreground">
            <MobileLabel>REACH</MobileLabel>
            {formatCompact(row.reach)}
          </div>
          <div className="text-right font-mono text-sm text-foreground">
            <MobileLabel>LIKES</MobileLabel>
            {formatCompact(row.likes)}
          </div>
          <div className="text-right font-mono text-sm text-foreground">
            <MobileLabel>SAVES</MobileLabel>
            {formatCompact(row.saves)}
          </div>
          <div className="text-right font-mono text-sm text-primary">
            <MobileLabel>ENG. RATE</MobileLabel>
            {formatPercent(row.engagementRate)}
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
