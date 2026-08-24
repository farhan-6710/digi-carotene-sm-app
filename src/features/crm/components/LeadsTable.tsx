import { LeadsTableRow } from "@/features/crm/components/LeadsTableRow";
import { leadsDirectoryConfig } from "@/features/crm/constants/leadsDirectory";
import type { LeadsTableProps } from "@/features/crm/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function LeadsTable({
  leads,
  isLoading,
  canEdit,
  onEditLead,
  searchQuery,
  onSearchQueryChange,
}: LeadsTableProps) {
  return (
    <DirectoryTable
      title={leadsDirectoryConfig.title}
      description={leadsDirectoryConfig.description}
      gridClass={leadsDirectoryConfig.gridClass}
      columns={leadsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No leads match that search."
          : leadsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={leads.length === 0}
      headerAside={
        <ListingSearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search leads"
          disabled={isLoading}
        />
      }
    >
      {leads.map((lead) => (
        <LeadsTableRow
          key={lead.id}
          lead={lead}
          canEdit={canEdit}
          onEditLead={onEditLead}
        />
      ))}
    </DirectoryTable>
  );
}
