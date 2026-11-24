import { ContactTableRow } from "@/features/crm/components/ContactTableRow";
import { contactDirectoryConfig } from "@/features/crm/constants/contactDirectory";
import type { ContactTableProps } from "@/features/crm/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingFiltersChrome } from "@/shared/components/ListingFiltersChrome";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function ContactTable({
  contacts,
  isLoading,
  searchQuery,
  onSearchQueryChange,
}: ContactTableProps) {
  return (
    <DirectoryTable
      title={contactDirectoryConfig.title}
      description={contactDirectoryConfig.description}
      gridClass={contactDirectoryConfig.gridClass}
      columns={contactDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No contacts match that search."
          : contactDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={contacts.length === 0}
      headerAside={
        <ListingFiltersChrome
          title="Contact filters"
          activeCount={searchQuery.trim() ? 1 : 0}
        >
          <ListingSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search contacts"
            disabled={isLoading}
          />
        </ListingFiltersChrome>
      }
    >
      {contacts.map((contact) => (
        <ContactTableRow key={contact.id} contact={contact} />
      ))}
    </DirectoryTable>
  );
}
