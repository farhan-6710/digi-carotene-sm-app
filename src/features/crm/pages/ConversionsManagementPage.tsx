import { useMemo, useState } from "react";

import { ConversionsTable } from "@/features/crm/components/ConversionsTable";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { useConversionsQuery } from "@/features/crm/hooks/useConversionsQuery";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ConversionsManagementPage() {
  const { conversions, isLoading, error } = useConversionsQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversions = useMemo(() => {
    return conversions.filter((conversion) =>
      matchesListingSearch(searchQuery, [
        conversion.name,
        conversion.company,
        conversion.email,
        conversion.phone,
        conversion.industry,
        LEAD_SOURCE_LABELS[conversion.lead_source],
      ]),
    );
  }, [conversions, searchQuery]);

  return (
    <PageShell
      heading="Conversions"
      description="Leads that converted successfully (score 5). Use Leads Management to update a lead’s score."
      error={error}
    >
      <ConversionsTable
        conversions={filteredConversions}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
