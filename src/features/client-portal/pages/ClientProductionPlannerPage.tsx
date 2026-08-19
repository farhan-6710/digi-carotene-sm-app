import { useMemo, useState } from "react";

import { ClientProductionPlansTable } from "@/features/client-portal/components/ClientProductionPlansTable";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ClientProductionPlannerPage() {
  const { productionPlans, loading, error } = useClientPortal();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPlans = useMemo(
    () =>
      productionPlans.filter((plan) =>
        matchesListingSearch(searchQuery, [plan.plan_name, plan.plan_description]),
      ),
    [productionPlans, searchQuery],
  );

  return (
    <PageShell
      heading="Production Planner"
      description="Review shoot plans for your brand. Open a plan to set Client approval on each piece of content."
      error={error && !loading ? error : null}
    >
      <ClientProductionPlansTable
        plans={filteredPlans}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
