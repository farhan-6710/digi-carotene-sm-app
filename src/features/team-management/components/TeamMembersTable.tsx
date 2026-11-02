import { useMemo } from "react";

import { TeamMembersTableRow } from "@/features/team-management/components/TeamMembersTableRow";
import {
  TEAM_DIRECTORY_BULK_GRID_CLASS,
  teamDirectoryColumns,
  teamDirectoryConfig,
} from "@/features/team-management/constants/teamDirectory";
import type { TeamMembersTableProps } from "@/features/team-management/types/components";
import { DirectoryBulkCheckbox } from "@/shared/components/DirectoryBulkCheckbox";
import { DirectoryBulkDeleteBar } from "@/shared/components/DirectoryBulkDeleteBar";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import type { DirectoryTableColumn } from "@/shared/types/components";

export function TeamMembersTable({
  members,
  isLoading,
  canEdit,
  canDelete = false,
  selectedIds = [],
  allVisibleSelected = false,
  isDeleting = false,
  onToggleSelect,
  onToggleAllVisible,
  onClearSelection,
  onBulkDelete,
  onEditMember,
  searchQuery,
  onSearchQueryChange,
}: TeamMembersTableProps) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const columns = useMemo((): DirectoryTableColumn[] => {
    if (!canDelete || !onToggleAllVisible) {
      return teamDirectoryColumns;
    }
    return [
      {
        id: "bulk",
        label: "Select",
        header: (
          <DirectoryBulkCheckbox
            checked={allVisibleSelected}
            onCheckedChange={onToggleAllVisible}
            ariaLabel="Select all team members"
            disabled={isLoading || members.length === 0}
          />
        ),
      },
      ...teamDirectoryColumns,
    ];
  }, [
    allVisibleSelected,
    canDelete,
    isLoading,
    members.length,
    onToggleAllVisible,
  ]);

  return (
    <DirectoryTable
      title={teamDirectoryConfig.title}
      description={teamDirectoryConfig.description}
      gridClass={
        canDelete ? TEAM_DIRECTORY_BULK_GRID_CLASS : teamDirectoryConfig.gridClass
      }
      columns={columns}
      emptyMessage={
        searchQuery.trim()
          ? "No team members match that search."
          : teamDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={members.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {canDelete && onClearSelection && onBulkDelete ? (
            <DirectoryBulkDeleteBar
              selectedCount={selectedIds.length}
              singularLabel="team member"
              pluralLabel="team members"
              isDeleting={isDeleting}
              onClear={onClearSelection}
              onConfirmDelete={onBulkDelete}
            />
          ) : null}
          <ListingSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search team"
            disabled={isLoading}
          />
        </div>
      }
    >
      {members.map((member) => (
        <TeamMembersTableRow
          key={member.id}
          member={member}
          canEdit={canEdit}
          canDelete={canDelete}
          selected={selectedSet.has(member.id)}
          onToggleSelect={onToggleSelect}
          onEditMember={onEditMember}
        />
      ))}
    </DirectoryTable>
  );
}
