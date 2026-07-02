import { Link } from "react-router";

import { buildGrowthCampaignDetailPath } from "../../constants/routes";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { MobileLabel, StatusBadge } from "./tableBits";
import type { CampaignTableProps } from "../../types/components";
import {
  formatCampaignObjective,
  formatCompact,
  formatCurrency,
  formatPercent,
} from "../../utils/formatters";

const GRID_CLASS = "grid-cols-[1.5fr_1fr_0.7fr_0.8fr_0.7fr_0.8fr]";

export function CampaignTable({ rows, adAccountId }: CampaignTableProps) {
  return (
    <DirectoryTable
      title="Campaign Breakdown"
      description="Spend and performance across active and recent campaigns."
      gridClass={GRID_CLASS}
      columns={[
        { label: "CAMPAIGN" },
        { label: "OBJECTIVE" },
        { label: "STATUS" },
        { label: "SPEND", align: "right" },
        { label: "CTR", align: "right" },
        { label: "CONVERSIONS", align: "right" },
      ]}
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="No campaigns for this ad account yet."
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
            <MobileLabel>CAMPAIGN</MobileLabel>
            <Link
              to={buildGrowthCampaignDetailPath(row.id, adAccountId)}
              className="line-clamp-2 text-primary hover:underline"
            >
              {row.name}
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <MobileLabel>OBJECTIVE</MobileLabel>
            {formatCampaignObjective(row.objective)}
          </div>
          <div>
            <MobileLabel>STATUS</MobileLabel>
            <StatusBadge status={row.status} />
          </div>
          <div className="text-right font-mono text-sm text-foreground">
            <MobileLabel>SPEND</MobileLabel>
            {formatCurrency(row.spend)}
          </div>
          <div className="text-right font-mono text-sm text-foreground">
            <MobileLabel>CTR</MobileLabel>
            {formatPercent(row.ctr)}
          </div>
          <div className="text-right font-mono text-sm text-primary">
            <MobileLabel>CONVERSIONS</MobileLabel>
            {formatCompact(row.conversions)}
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
