import { ContactsTableRow } from "@/features/crm/components/ContactsTableRow";
import { contactsDirectoryConfig } from "@/features/crm/constants/contactsDirectory";
import type { ContactsTableProps } from "@/features/crm/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function ContactsTable({
  contacts,
  isLoading,
  searchQuery,
  onSearchQueryChange,
}: ContactsTableProps) {
  return (
    <DirectoryTable
      title={contactsDirectoryConfig.title}
      description={contactsDirectoryConfig.description}
      gridClass={contactsDirectoryConfig.gridClass}
      columns={contactsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No contacts match that search."
          : contactsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={contacts.length === 0}
      headerAside={
        <ListingSearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search contacts"
          disabled={isLoading}
        />
      }
    >
      {contacts.map((contact) => (
        <ContactsTableRow key={contact.id} contact={contact} />
      ))}
    </DirectoryTable>
  );
}
