import { buildEmployeeAnalyticsStatCards } from "@/features/analytics/utils/analyticsStatsUtils";
import { StatsCards } from "@/shared/components/StatsCards";

export function EmployeesAnalyticsPanel() {
  const statCards = buildEmployeeAnalyticsStatCards();

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Team workload, assignments, and role distribution. Live data will replace
        these placeholders in a future release.
      </p>
      <StatsCards cards={statCards} />
    </div>
  );
}
