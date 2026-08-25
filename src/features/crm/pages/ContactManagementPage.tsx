import { useMemo, useState } from "react";

import { ContactTable } from "@/features/crm/components/ContactTable";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { useContactQuery } from "@/features/crm/hooks/useContactQuery";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ContactManagementPage() {
  const { contacts, isLoading, error } = useContactQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      matchesListingSearch(searchQuery, [
        contact.name,
        contact.company,
        contact.email,
        contact.phone,
        contact.industry,
        LEAD_SOURCE_LABELS[contact.lead_source],
      ]),
    );
  }, [contacts, searchQuery]);

  return (
    <PageShell
      heading="Contact"
      description="Leads that converted successfully (score 5). Use Leads Management to update a lead’s score."
      error={error}
    >
      <ContactTable
        contacts={filteredContacts}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
