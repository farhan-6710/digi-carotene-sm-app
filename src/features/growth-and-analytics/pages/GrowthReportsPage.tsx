import { useMemo } from "react";

import { GrowthReportsAccountComboBox } from "../components/GrowthReportsAccountComboBox";
import { GrowthReportTabs } from "../components/GrowthReportTabs";
import { ReportsTable } from "../components/tables/ReportsTable";
import { useGrowthReports } from "../hooks/useGrowthReports";
import { useGrowthSelectedAccount } from "../hooks/useGrowthSelectedAccount";
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";
import { useReportsFilter } from "../hooks/useReportsFilter";
import { filterReportsByType } from "../utils/reportsFilter";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function GrowthReportsPage() {
  const { activeType, setActiveType } = useReportsFilter();
  const { reports, isLoading, error } = useGrowthReports();
  const organic = useGrowthSelectedAccount();
  const ads = useGrowthSelectedAdAccount();

  const accountsLoading = organic.isLoading || ads.isLoading;
  const hasMetaAccounts =
    organic.accounts.length > 0 || ads.accounts.length > 0;
  const showNoAccounts = !accountsLoading && !hasMetaAccounts;

  const visibleReports = useMemo(
    () => filterReportsByType(reports, activeType),
    [reports, activeType],
  );

  return (
    <PageContent>
      <PageHeader
        heading="Reports"
        description="Browse generated Instagram, Facebook, campaign, and content reports."
        actions={hasMetaAccounts ? <GrowthReportsAccountComboBox /> : null}
      />

      {error ? <ErrorBanner message={error} /> : null}

      {showNoAccounts ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            No reports yet
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            No accounts connected to Meta.
          </p>
        </div>
      ) : (
        <>
          <GrowthReportTabs
            activeType={activeType}
            onTypeChange={setActiveType}
          />
          <ReportsTable
            rows={visibleReports}
            isLoading={isLoading || accountsLoading}
          />
        </>
      )}
    </PageContent>
  );
}
