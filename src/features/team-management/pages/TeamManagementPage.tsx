import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { TeamMemberDialog } from "@/features/team-management/components/TeamMemberDialog";
import { TeamMembersTable } from "@/features/team-management/components/TeamMembersTable";
import { useTeamMemberDialog } from "@/features/team-management/hooks/useTeamMemberDialog";
import { useTeamMembersQuery } from "@/features/team-management/hooks/useTeamMembersQuery";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function TeamManagementPage() {
  const { can } = usePermissions();
  const { members, isLoading, error, setError, reload } = useTeamMembersQuery();
  const { openAddDialog, openEditDialog, dialog } = useTeamMemberDialog({
    reload,
    setError,
  });
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <PageShell
      heading="Team Management"
      description="Manage Digi Carotene specialists — executives, managers, and team — with roles and contact details."
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
        onEditMember={openEditDialog}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
