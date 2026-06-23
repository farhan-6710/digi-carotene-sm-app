import { ReportStatCards } from "@/features/reports/components/ReportStatCards";
import { ReportDateRangePicker } from "@/features/reports/components/ReportDateRangePicker";
import { ReportsTable } from "@/features/reports/components/ReportsTable";
import { useReportsManagement } from "@/features/reports/hooks/useReportsManagement";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";

export function ReportsPage() {
  const {
    statusFilterOptions,
    showAll,
    activeStatuses,
    pickerRange,
    appliedRangeLabel,
    summaries,
    stats,
    isLoading,
    error,
    hasGenerated,
    periodLabel,
    isPickerOpen,
    handlePickerOpenChange,
    toggleStatusFilter,
    handlePickerRangeChange,
    handlePickerKeyDown,
    applyDateRange,
  } = useReportsManagement();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Reports"
        description="View client post activity for any date range. Results are sorted by clients with the most posted content first."
        actions={
          <ReportDateRangePicker
            open={isPickerOpen}
            onOpenChange={handlePickerOpenChange}
            range={pickerRange}
            rangeLabel={appliedRangeLabel}
            onRangeChange={handlePickerRangeChange}
            onApply={() => void applyDateRange()}
            onKeyDown={handlePickerKeyDown}
            isLoading={isLoading}
          />
        }
      />

      <ReportStatCards stats={stats} />

      {error ? <ErrorBanner message={error} /> : null}

      <ReportsTable
        summaries={summaries}
        isLoading={isLoading}
        hasGenerated={hasGenerated}
        periodLabel={periodLabel}
        statusFilterOptions={statusFilterOptions}
        showAll={showAll}
        activeStatuses={activeStatuses}
        onToggleStatusFilter={toggleStatusFilter}
      />
    </section>
  );
}
