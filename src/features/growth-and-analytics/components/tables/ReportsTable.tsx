import { Download, Eye, Trash2 } from "lucide-react";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { MobileLabel } from "./tableBits";
import { reportTabs } from "../../constants/reports/reportsData";
import type { ReportsTableProps } from "../../types/components";

const GRID_CLASS = "grid-cols-[2fr_1fr_1.2fr_1fr]";

function typeLabel(type: string): string {
  return reportTabs.find((tab) => tab.id === type)?.label ?? type;
}

export function ReportsTable({ rows, isLoading = false }: ReportsTableProps) {
  return (
    <DirectoryTable
      title="Report Library"
      description="Generated reports ready to view or download."
      gridClass={GRID_CLASS}
      columns={[
        { label: "REPORT" },
        { label: "TYPE" },
        { label: "PERIOD" },
        { label: "ACTIONS", align: "right" },
      ]}
      isLoading={isLoading}
      isEmpty={rows.length === 0}
      emptyMessage="No reports match this filter yet."
    >
      {rows.map((row) => (
        <div
          key={row.id}
          className={cn(
            "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
            GRID_CLASS,
          )}
        >
          <div className="text-sm font-medium text-foreground">
            <MobileLabel>REPORT</MobileLabel>
            {row.title}
          </div>
          <div className="text-sm text-muted-foreground">
            <MobileLabel>TYPE</MobileLabel>
            {typeLabel(row.type)}
          </div>
          <div className="text-sm text-muted-foreground">
            <MobileLabel>PERIOD</MobileLabel>
            {row.periodStart} → {row.periodEnd}
          </div>
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Eye className="size-3.5" />
              <span className="sr-only">View report</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Download className="size-3.5" />
              <span className="sr-only">Download report</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete report</span>
            </Button>
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
