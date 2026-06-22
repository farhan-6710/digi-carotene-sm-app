import { Plus } from "lucide-react";

import { TeamMemberDialog } from "@/features/team-management/components/TeamMemberDialog";
import { TeamMembersTable } from "@/features/team-management/components/TeamMembersTable";
import { useTeamMemberDialog } from "@/features/team-management/hooks/useTeamMemberDialog";
import { useTeamMembersQuery } from "@/features/team-management/hooks/useTeamMembersQuery";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { ManagementPageShell } from "@/shared/components/ManagementPageShell";
import { Button } from "@/shared/ui/button";

export function TeamManagementPage() {
  const { can } = usePermissions();
  const { members, isLoading, error, setError, reload } = useTeamMembersQuery();
  const { openAddDialog, openEditDialog, dialog } = useTeamMemberDialog({
    reload,
    setError,
  });

  return (
    <ManagementPageShell
      heading="Team Management"
      description="Manage your agency team. Add executives, managers, and admins with their contact details."
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
        members={members}
        isLoading={isLoading}
        canEdit={can("team.update")}
        onEditMember={openEditDialog}
      />
    </ManagementPageShell>
  );
}
