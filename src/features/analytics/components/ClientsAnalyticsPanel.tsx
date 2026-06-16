import { buildClientAnalyticsStatCards } from "@/features/analytics/utils/analyticsStatsUtils";
import { StatsCards } from "@/shared/components/StatsCards";

export function ClientsAnalyticsPanel() {
  const statCards = buildClientAnalyticsStatCards();

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Client portfolio metrics and engagement trends. Live data will replace
        these placeholders in a future release.
      </p>
      <StatsCards cards={statCards} />
    </div>
  );
}
