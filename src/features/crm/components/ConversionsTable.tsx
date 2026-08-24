import { ConversionsTableRow } from "@/features/crm/components/ConversionsTableRow";
import { conversionsDirectoryConfig } from "@/features/crm/constants/conversionsDirectory";
import type { ConversionsTableProps } from "@/features/crm/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function ConversionsTable({
  conversions,
  isLoading,
  searchQuery,
  onSearchQueryChange,
}: ConversionsTableProps) {
  return (
    <DirectoryTable
      title={conversionsDirectoryConfig.title}
      description={conversionsDirectoryConfig.description}
      gridClass={conversionsDirectoryConfig.gridClass}
      columns={conversionsDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No conversions match that search."
          : conversionsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={conversions.length === 0}
      headerAside={
        <ListingSearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search conversions"
          disabled={isLoading}
        />
      }
    >
      {conversions.map((conversion) => (
        <ConversionsTableRow key={conversion.id} conversion={conversion} />
      ))}
    </DirectoryTable>
  );
}
