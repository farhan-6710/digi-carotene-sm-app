import { useMemo, useState } from "react";

import { ContactsTable } from "@/features/crm/components/ContactsTable";
import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { useContactsQuery } from "@/features/crm/hooks/useContactsQuery";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ContactsManagementPage() {
  const { contacts, isLoading, error } = useContactsQuery();
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
      heading="Contacts"
      description="Leads that converted successfully (score 5). Use Leads Management to update a lead’s score."
      error={error}
    >
      <ContactsTable
        contacts={filteredContacts}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
