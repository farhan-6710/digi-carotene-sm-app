import { LeadFollowUpFilterSelect } from "@/features/crm/components/LeadFollowUpFilterSelect";
import { LeadMonthFilter } from "@/features/crm/components/LeadMonthFilter";
import { LeadSortSelect } from "@/features/crm/components/LeadSortSelect";
import { LeadsTableRow } from "@/features/crm/components/LeadsTableRow";
import { DEFAULT_LEAD_FOLLOW_UP_FILTER } from "@/features/crm/constants/leadFollowUpFilters";
import { LEAD_MONTH_FILTER_ALL } from "@/features/crm/constants/leadSort";
import { leadsDirectoryConfig } from "@/features/crm/constants/leadsDirectory";
import type { LeadsTableProps } from "@/features/crm/types/components";
import { getListingFollowUp } from "@/features/crm/utils/leadFollowUpFilterUtils";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function LeadsTable({
  leads,
  followUpsByLeadId,
  isLoading,
  canEdit,
  isSavingFollowUp = false,
  onEditLead,
  onUpdateFollowUpStatus,
  onRescheduleFollowUp,
  searchQuery,
  onSearchQueryChange,
  sort,
  onSortChange,
  monthFilter,
  onMonthFilterChange,
  followUpFilter,
  onFollowUpFilterChange,
}: LeadsTableProps) {
  const hasFilters =
    Boolean(searchQuery.trim()) ||
    monthFilter !== LEAD_MONTH_FILTER_ALL ||
    followUpFilter !== DEFAULT_LEAD_FOLLOW_UP_FILTER;

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
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="w-full min-w-0 sm:max-w-sm">
            <ListingSearchInput
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="Search leads"
              disabled={isLoading}
            />
          </div>
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <LeadFollowUpFilterSelect
              value={followUpFilter}
              onChange={onFollowUpFilterChange}
              disabled={isLoading}
            />
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
          </div>
        </div>
      }
    >
      {leads.map((lead) => (
        <LeadsTableRow
          key={lead.id}
          lead={lead}
          nextFollowUp={getListingFollowUp(
            followUpsByLeadId.get(lead.id) ?? [],
            followUpFilter,
          )}
          canEdit={canEdit}
          isSavingFollowUp={isSavingFollowUp}
          onEditLead={onEditLead}
          onUpdateFollowUpStatus={onUpdateFollowUpStatus}
          onRescheduleFollowUp={onRescheduleFollowUp}
        />
      ))}
    </DirectoryTable>
  );
}
