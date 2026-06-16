import { useTeamMemberDialog } from "@/features/team-management/hooks/useTeamMemberDialog";
import { useTeamMembersQuery } from "@/features/team-management/hooks/useTeamMembersQuery";

export function useTeamManagement() {
  const { members, isLoading, error, setError, reload } = useTeamMembersQuery();
  const { openAddDialog, openEditDialog, dialog } = useTeamMemberDialog({
    reload,
    setError,
  });

  return {
    members,
    isLoading,
    error,
    openAddDialog,
    openEditDialog,
    dialog,
  };
}
