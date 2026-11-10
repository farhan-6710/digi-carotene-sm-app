import { Link } from "react-router";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";

import { useGrowthPaths } from "../../hooks/useGrowthPaths";
import { MobileLabel, StatusBadge } from "./tableBits";
import type { CampaignTableProps } from "../../types/components";
import {
  formatCampaignObjective,
  formatCompact,
  formatCpm,
  formatCurrency,
  formatPercent,
} from "../../utils/formatters";
import { formatGapPercent, gapStatusLabel } from "../../utils/gapStatus";
import { GOOGLE_CAMPAIGN_TYPE_LABEL } from "../../constants/googleCampaignTypeMatrix";
import { resolveGoogleCampaignType } from "../../utils/resolveGoogleCampaignType";

const GRID_CLASS =
  "grid-cols-[1.4fr_0.9fr_0.6fr_0.7fr_0.8fr_0.7fr_0.7fr]";

function campaignTypeLabel(
  isGoogle: boolean,
  objective: string | null,
): string {
  if (!isGoogle) return formatCampaignObjective(objective);
  return GOOGLE_CAMPAIGN_TYPE_LABEL[resolveGoogleCampaignType(objective)];
}

export function CampaignTable({
  rows,
  adAccountId,
  platform = "meta_ads",
}: CampaignTableProps) {
  const { buildCampaignDetailPath, buildCampaignLearningPath } = useGrowthPaths();
  const isGoogle = platform === "google_ads";
  const objectiveLabel = isGoogle ? "CAMPAIGN TYPE" : "OBJECTIVE";

  return (
    <DirectoryTable
      title="Campaign Breakdown"
      description="Spend, gap to benchmark, and learning mode."
      gridClass={GRID_CLASS}
      columns={[
        { label: "CAMPAIGN" },
        { label: objectiveLabel },
        { label: "STATUS" },
        { label: "SPEND", align: "right" },
        { label: "PRIMARY KPI", align: "right" },
        { label: "GAP", align: "right" },
        { label: "LEARNING" },
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
              to={buildCampaignDetailPath(row.id, adAccountId)}
              className="line-clamp-2 text-primary hover:underline"
            >
              {row.name}
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <MobileLabel>{objectiveLabel}</MobileLabel>
            {campaignTypeLabel(isGoogle, row.objective)}
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
            <MobileLabel>PRIMARY KPI</MobileLabel>
            {row.primaryKpiCurrent == null
              ? "—"
              : formatCpm(row.primaryKpiCurrent)}
            {row.benchmarkValue != null ? (
              <span className="block text-[11px] text-muted-foreground">
                vs {formatCpm(row.benchmarkValue)}
              </span>
            ) : null}
          </div>
          <div className="text-right text-sm">
            <MobileLabel>GAP</MobileLabel>
            {row.gapStatus ? (
              <>
                <span className="font-mono tabular-nums">
                  {formatGapPercent(row.gap ?? null)}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {gapStatusLabel(row.gapStatus)}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
          <div className="text-sm">
            <MobileLabel>LEARNING</MobileLabel>
            <Link
              to={buildCampaignLearningPath(row.id, adAccountId)}
              className="capitalize text-primary hover:underline"
            >
              {row.learningMode ?? "open"}
            </Link>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">
              CTR {formatPercent(row.ctr)} · {formatCompact(row.conversions)}{" "}
              conv.
            </span>
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
