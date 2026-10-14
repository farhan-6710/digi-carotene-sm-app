import { LeadMonthFilter } from "@/features/crm/components/LeadMonthFilter";
import { LeadSortSelect } from "@/features/crm/components/LeadSortSelect";
import { LeadsTableRow } from "@/features/crm/components/LeadsTableRow";
import { LEAD_MONTH_FILTER_ALL } from "@/features/crm/constants/leadSort";
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
  sort,
  onSortChange,
  monthFilter,
  onMonthFilterChange,
}: LeadsTableProps) {
  const hasFilters =
    Boolean(searchQuery.trim()) || monthFilter !== LEAD_MONTH_FILTER_ALL;

  return (
    <DirectoryTable
      title={leadsDirectoryConfig.title}
      description={leadsDirectoryConfig.description}
      gridClass={leadsDirectoryConfig.gridClass}
      columns={leadsDirectoryConfig.columns}
      emptyMessage={
        hasFilters
          ? "No leads match those filters."
          : leadsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={leads.length === 0}
      filters={
        <>
          <LeadMonthFilter
            value={monthFilter}
            onChange={onMonthFilterChange}
            disabled={isLoading}
          />
          <LeadSortSelect
            value={sort}
            onChange={onSortChange}
            disabled={isLoading}
          />
          <div className="w-full min-w-0 sm:min-w-[200px] sm:flex-1 sm:max-w-sm">
            <ListingSearchInput
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="Search leads"
              disabled={isLoading}
            />
          </div>
        </>
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
