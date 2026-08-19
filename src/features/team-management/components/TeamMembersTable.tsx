import { TeamMembersTableRow } from "@/features/team-management/components/TeamMembersTableRow";
import { teamDirectoryConfig } from "@/features/team-management/constants/teamDirectory";
import type { TeamMembersTableProps } from "@/features/team-management/types/components";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function TeamMembersTable({
  members,
  isLoading,
  canEdit,
  onEditMember,
  searchQuery,
  onSearchQueryChange,
}: TeamMembersTableProps) {
  return (
    <DirectoryTable
      title={teamDirectoryConfig.title}
      description={teamDirectoryConfig.description}
      gridClass={teamDirectoryConfig.gridClass}
      columns={teamDirectoryConfig.columns}
      emptyMessage={
        searchQuery.trim()
          ? "No team members match that search."
          : teamDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={members.length === 0}
      headerAside={
        <ListingSearchInput
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search team"
          disabled={isLoading}
        />
      }
    >
      {members.map((member) => (
        <TeamMembersTableRow
          key={member.id}
          member={member}
          canEdit={canEdit}
          onEditMember={onEditMember}
        />
      ))}
    </DirectoryTable>
  );
}
