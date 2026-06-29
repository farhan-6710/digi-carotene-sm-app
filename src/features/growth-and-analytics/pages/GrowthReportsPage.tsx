import { useMemo } from "react";

import { GrowthReportTabs } from "../components/GrowthReportTabs";
import { ReportsTable } from "../components/tables/ReportsTable";
import { useGrowthReports } from "../hooks/useGrowthReports";
import { useReportsFilter } from "../hooks/useReportsFilter";
import { filterReportsByType } from "../utils/reportsFilter";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function GrowthReportsPage() {
  const { activeType, setActiveType } = useReportsFilter();
  const { reports } = useGrowthReports();

  const visibleReports = useMemo(
    () => filterReportsByType(reports, activeType),
    [reports, activeType],
  );

  return (
    <PageContent>
      <PageHeader
        heading="Reports"
        description="Browse generated Instagram, Facebook, campaign, and content reports."
      />

      <GrowthReportTabs activeType={activeType} onTypeChange={setActiveType} />

      <ReportsTable rows={visibleReports} />
    </PageContent>
  );
}
