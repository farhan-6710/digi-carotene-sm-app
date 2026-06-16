import { Plus } from "lucide-react";

import { TeamMemberDialog } from "@/features/team-management/components/TeamMemberDialog";
import { TeamMembersTable } from "@/features/team-management/components/TeamMembersTable";
import { useTeamManagement } from "@/features/team-management/hooks/useTeamManagement";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function TeamManagementPage() {
  const { members, isLoading, error, openAddDialog, openEditDialog, dialog } =
    useTeamManagement();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Team Management"
        description="Manage your agency team. Add executives, managers, and admins with their contact details."
        actions={
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Team Member
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <TeamMembersTable
        members={members}
        isLoading={isLoading}
        onEditMember={openEditDialog}
      />

      <TeamMemberDialog {...dialog} />
    </section>
  );
}
