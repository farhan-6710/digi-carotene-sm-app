import { Plus } from "lucide-react";

import { TeamMemberDialog } from "@/features/team-management/components/TeamMemberDialog";
import { TeamMembersTable } from "@/features/team-management/components/TeamMembersTable";
import { useTeamMemberDialog } from "@/features/team-management/hooks/useTeamMemberDialog";
import { useTeamMembersQuery } from "@/features/team-management/hooks/useTeamMembersQuery";
import { ManagementPageShell } from "@/shared/components/ManagementPageShell";
import { Button } from "@/shared/ui/button";

export function TeamManagementPage() {
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
        <Button onClick={openAddDialog} className="rounded-full shadow-sm">
          <Plus className="mr-2 size-4" />
          Add Team Member
        </Button>
      }
      dialog={<TeamMemberDialog {...dialog} />}
    >
      <TeamMembersTable
        members={members}
        isLoading={isLoading}
        onEditMember={openEditDialog}
      />
    </ManagementPageShell>
  );
}
