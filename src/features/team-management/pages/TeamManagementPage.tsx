import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { TeamMemberDialog } from "@/features/team-management/components/TeamMemberDialog";
import { TeamMembersTable } from "@/features/team-management/components/TeamMembersTable";
import { useTeamMemberDialog } from "@/features/team-management/hooks/useTeamMemberDialog";
import { useTeamMembersQuery } from "@/features/team-management/hooks/useTeamMembersQuery";
import { useDirectoryBulkDelete } from "@/shared/hooks/useDirectoryBulkDelete";
import { useDirectoryBulkSelection } from "@/shared/hooks/useDirectoryBulkSelection";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { deleteTeamMembersByIds } from "@/services/teamMembersService";

export function TeamManagementPage() {
  const { can } = usePermissions();
  const { members, isLoading, error, setError, reload } = useTeamMembersQuery();
  const { openAddDialog, openEditDialog, dialog } = useTeamMemberDialog({
    reload,
    setError,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const canDelete = can("team.delete");

  const filteredMembers = useMemo(
    () =>
      members.filter((member) =>
        matchesListingSearch(searchQuery, [
          member.member_name,
          member.email,
          member.mobile_number,
          member.team_role,
        ]),
      ),
    [members, searchQuery],
  );

  const filteredIds = useMemo(
    () => filteredMembers.map((member) => member.id),
    [filteredMembers],
  );
  const bulk = useDirectoryBulkSelection(filteredIds);
  const deleteByIds = useCallback(
    (ids: string[]) => deleteTeamMembersByIds(ids),
    [],
  );
  const { isDeleting, runBulkDelete } = useDirectoryBulkDelete({
    deleteByIds,
    reload,
    clearSelection: bulk.clear,
    successMessage: "Selected team members deleted.",
  });

  return (
    <PageShell
      heading="Team Management"
      description="Manage Digi Carotene specialists — SM executives, editors/designers, managers, and admins — with roles and contact details."
      error={error}
      actions={
        can("team.create") ? (
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Team Member
          </Button>
        ) : null
      }
      dialog={
        can("team.create") || can("team.update") ? (
          <TeamMemberDialog {...dialog} />
        ) : null
      }
    >
      <TeamMembersTable
        members={filteredMembers}
        isLoading={isLoading}
        canEdit={can("team.update")}
        canDelete={canDelete}
        selectedIds={bulk.selectedIds}
        allVisibleSelected={bulk.allVisibleSelected}
        isDeleting={isDeleting}
        onToggleSelect={bulk.toggle}
        onToggleAllVisible={bulk.toggleAllVisible}
        onClearSelection={bulk.clear}
        onBulkDelete={() => runBulkDelete(bulk.selectedIds)}
        onEditMember={openEditDialog}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
