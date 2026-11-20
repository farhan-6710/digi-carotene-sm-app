import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import { CHANGE_CATEGORY_LABEL } from "../../constants/learning/campaignChanges";
import type { CampaignChangeRow } from "../../types/types";
import { MobileLabel } from "../tables/tableBits";
import {
  ChangeImpactChip,
  ChangeVerificationChip,
} from "./CampaignChangeStatusChips";

const GRID_CLASS =
  "grid-cols-[1.1fr_1.4fr_0.7fr_1.3fr_0.8fr_0.9fr]";

type CampaignChangesTableProps = {
  rows: CampaignChangeRow[];
  onExplain: (row: CampaignChangeRow) => void;
};

function formatWhen(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CampaignChangesTable({
  rows,
  onExplain,
}: CampaignChangesTableProps) {
  return (
    <DirectoryTable
      title="Change log"
      description="Platform changes with reason, verification, and impact. Spec §8.3."
      gridClass={GRID_CLASS}
      contentMinWidthPx={960}
      columns={[
        { label: "WHEN / WHO" },
        { label: "WHAT CHANGED" },
        { label: "CATEGORY" },
        { label: "REASON & EXPECTATION" },
        { label: "VERIFICATION" },
        { label: "IMPACT" },
      ]}
      isLoading={false}
      isEmpty={rows.length === 0}
      emptyMessage="No changes in this filter."
    >
      {rows.map((row) => {
        const needsReason = row.verification === "needs_reason";
        return (
          <div
            key={row.id}
            className={cn(
              "grid items-start gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
              GRID_CLASS,
              needsReason && "bg-destructive/5",
            )}
          >
            <div className="min-w-0 text-sm">
              <MobileLabel>WHEN / WHO</MobileLabel>
              <p className="font-medium text-foreground">
                {formatWhen(row.occurredAt)}
              </p>
              <p className="text-muted-foreground">{row.actorLabel}</p>
            </div>

            <div className="min-w-0 text-sm text-foreground">
              <MobileLabel>WHAT CHANGED</MobileLabel>
              <p className="font-medium">{row.summary}</p>
              {row.plannedValueNote ? (
                <p className="text-xs text-muted-foreground">
                  {row.plannedValueNote}
                </p>
              ) : null}
            </div>

            <div className="text-sm text-muted-foreground">
              <MobileLabel>CATEGORY</MobileLabel>
              {CHANGE_CATEGORY_LABEL[row.category]}
            </div>

            <div className="min-w-0 text-sm">
              <MobileLabel>REASON & EXPECTATION</MobileLabel>
              {needsReason ? (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto px-0 text-destructive"
                  onClick={() => onExplain(row)}
                >
                  Add reason
                </Button>
              ) : (
                <>
                  <p className="text-foreground">{row.reason}</p>
                  {row.expectation ? (
                    <p className="text-xs text-muted-foreground">
                      {row.expectation}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div>
              <MobileLabel>VERIFICATION</MobileLabel>
              <ChangeVerificationChip value={row.verification} />
            </div>

            <div>
              <MobileLabel>IMPACT</MobileLabel>
              <ChangeImpactChip
                value={row.impact}
                detail={row.impactDetail}
              />
            </div>
          </div>
        );
      })}
    </DirectoryTable>
  );
}
