import { useCallback, useState } from "react";

import type { OtherProjectListItem } from "@/features/other-projects/types/types";
import {
  emptyOtherProjectFormValues,
  otherProjectToFormValues,
  trimOrNull,
  validateOtherProjectForm,
  type OtherProjectFormValues,
} from "@/features/other-projects/utils/otherProjectFormUtils";
import {
  createOtherProject,
  deleteOtherProject,
  updateOtherProject,
} from "@/services/otherProjectsService";
import { fetchTeamMembersByIds } from "@/services/teamMembersService";
import { showToast } from "@/shared/utils/showToast";

type UseOtherProjectDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useOtherProjectDialog({
  reload,
  setError,
}: UseOtherProjectDialogOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<OtherProjectFormValues>(
    emptyOtherProjectFormValues,
  );
  const [formSeeds, setFormSeeds] = useState<{
    client: OtherProjectListItem["clients"];
    manager: OtherProjectListItem["team_members"];
    teamMembers: { id: string; member_name: string }[];
  } | null>(null);

  const resetForm = useCallback(() => {
    setValues(emptyOtherProjectFormValues());
    setEditingProjectId(null);
    setFormSeeds(null);
  }, []);

  const onFieldChange = useCallback(
    <K extends keyof OtherProjectFormValues>(
      field: K,
      value: OtherProjectFormValues[K],
    ) => {
      setValues((current) => {
        if (field === "managerId" && typeof value === "string") {
          return {
            ...current,
            managerId: value,
            teamMemberIds: current.teamMemberIds.filter((id) => id !== value),
          };
        }
        return { ...current, [field]: value };
      });
    },
    [],
  );

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    },
    [resetForm],
  );

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((project: OtherProjectListItem) => {
    setEditingProjectId(project.id);
    setValues(otherProjectToFormValues(project));
    setFormSeeds({
      client: project.clients,
      manager: project.team_members,
      teamMembers: [],
    });
    setIsDialogOpen(true);

    const memberIds = project.team_member_ids ?? [];
    if (memberIds.length === 0) return;

    void fetchTeamMembersByIds(memberIds)
      .then((members) => {
        setFormSeeds((current) =>
          current
            ? {
                ...current,
                teamMembers: members.map(({ id, member_name }) => ({
                  id,
                  member_name,
                })),
              }
            : current,
        );
      })
      .catch(() => undefined);
  }, []);

  const saveProject = useCallback(async () => {
    if (isSaving) return;

    const validationError = validateOtherProjectForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        projectName: values.projectName.trim(),
        clientId: values.clientId,
        managerId: values.managerId,
        teamMemberIds: values.teamMemberIds,
        description: trimOrNull(values.description),
        startDate: values.startDate || null,
        etaDate: values.etaDate || null,
      };
      const projectName = values.projectName.trim();

      if (editingProjectId) {
        await updateOtherProject(editingProjectId, {
          ...payload,
          isActive: values.isActive,
        });
        showToast("success", `"${projectName}" updated successfully.`);
      } else {
        await createOtherProject(payload);
        showToast("success", `"${projectName}" added successfully.`);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save project.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingProjectId,
    handleDialogOpenChange,
    isSaving,
    reload,
    setError,
    values,
  ]);

  const removeProject = useCallback(async () => {
    if (!editingProjectId || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const projectName = values.projectName.trim();
      await deleteOtherProject(editingProjectId);
      await reload();
      handleDialogOpenChange(false);
      showToast("success", `"${projectName}" removed successfully.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete project.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingProjectId,
    handleDialogOpenChange,
    isSaving,
    reload,
    setError,
    values.projectName,
  ]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: editingProjectId !== null,
      isSaving,
      values,
      formSeeds,
      onFieldChange,
      onSave: () => void saveProject(),
      onDelete: editingProjectId ? () => void removeProject() : undefined,
    },
  };
}
