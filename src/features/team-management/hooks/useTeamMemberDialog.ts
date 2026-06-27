import { useCallback, useState } from "react";

import type { TeamMember } from "@/features/team-management/types/types";
import type {
  TeamMemberFormField,
  TeamMemberFormValues,
} from "@/features/team-management/utils/teamMemberFormUtils";
import {
  emptyTeamMemberFormValues,
  teamMemberToFormValues,
  validateTeamMemberForm,
} from "@/features/team-management/utils/teamMemberFormUtils";
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
} from "@/services/teamMembersService";
import { showToast } from "@/shared/utils/showToast";

type UseTeamMemberDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useTeamMemberDialog({ reload, setError }: UseTeamMemberDialogOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<TeamMemberFormValues>(emptyTeamMemberFormValues);

  const resetForm = useCallback(() => {
    setValues(emptyTeamMemberFormValues());
    setEditingMemberId(null);
  }, []);

  const onFieldChange = useCallback((field: TeamMemberFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm],
  );

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((member: TeamMember) => {
    setEditingMemberId(member.id);
    setValues(teamMemberToFormValues(member));
    setIsDialogOpen(true);
  }, []);

  const saveMember = useCallback(async () => {
    if (isSaving) {
      return;
    }

    const validationError = validateTeamMemberForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        memberName: values.memberName.trim(),
        email: values.email.trim(),
        mobileNumber: values.mobileNumber.trim() || null,
        teamRole: values.teamRole,
      };

      const memberName = values.memberName.trim();

      if (editingMemberId) {
        await updateTeamMember(editingMemberId, payload);
        showToast("success", `"${memberName}" updated successfully.`);
      } else {
        await createTeamMember(payload);
        showToast("success", `"${memberName}" added successfully.`);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save team member.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingMemberId, handleDialogOpenChange, isSaving, reload, setError, values]);

  const removeMember = useCallback(async () => {
    if (!editingMemberId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const memberName = values.memberName.trim();
      await deleteTeamMember(editingMemberId);
      await reload();
      handleDialogOpenChange(false);
      showToast("success", `"${memberName}" removed successfully.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete team member.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingMemberId, handleDialogOpenChange, isSaving, reload, setError, values.memberName]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: editingMemberId !== null,
      isSaving,
      values,
      onFieldChange,
      onSave: saveMember,
      onDelete: editingMemberId ? removeMember : undefined,
    },
  };
}
