import { useCallback, useState } from "react";

import type { EmployeeRole } from "@/features/employees-management/constants/employeeRoles";
import type { TeamMember } from "@/features/employees-management/types/types";
import type {
  TeamMemberFormField,
  TeamMemberFormValues,
} from "@/features/employees-management/utils/employeeFormUtils";
import {
  emptyTeamMemberFormValues,
  teamMemberToFormValues,
  validateTeamMemberForm,
} from "@/features/employees-management/utils/employeeFormUtils";
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
} from "@/features/employees-management/utils/employeesRepository";

type UseEmployeeDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useEmployeeDialog({ reload, setError }: UseEmployeeDialogOptions) {
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
        role: values.role as EmployeeRole,
      };

      if (editingMemberId) {
        await updateTeamMember(editingMemberId, payload);
      } else {
        await createTeamMember(payload);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team member.");
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
      await deleteTeamMember(editingMemberId);
      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team member.");
    } finally {
      setIsSaving(false);
    }
  }, [editingMemberId, handleDialogOpenChange, isSaving, reload, setError]);

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
