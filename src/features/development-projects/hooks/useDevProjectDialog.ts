import { useCallback, useState } from "react";

import type { DevProjectListItem } from "@/features/development-projects/types/types";
import {
  emptyDevProjectFormValues,
  devProjectToFormValues,
  trimOrNull,
  validateDevProjectForm,
  type DevProjectFormValues,
} from "@/features/development-projects/utils/devProjectFormUtils";
import {
  createDevProject,
  deleteDevProject,
  updateDevProject,
} from "@/services/devProjectsService";
import { fetchTeamMembersByIds } from "@/services/teamMembersService";
import { showToast } from "@/shared/utils/showToast";

type UseDevProjectDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useDevProjectDialog({
  reload,
  setError,
}: UseDevProjectDialogOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<DevProjectFormValues>(
    emptyDevProjectFormValues,
  );
  const [formSeeds, setFormSeeds] = useState<{
    client: DevProjectListItem["clients"];
    manager: DevProjectListItem["team_members"];
    teamMembers: { id: string; member_name: string }[];
  } | null>(null);

  const resetForm = useCallback(() => {
    setValues(emptyDevProjectFormValues());
    setEditingProjectId(null);
    setFormSeeds(null);
  }, []);

  const onFieldChange = useCallback(
    <K extends keyof DevProjectFormValues>(
      field: K,
      value: DevProjectFormValues[K],
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

  const openEditDialog = useCallback((project: DevProjectListItem) => {
    setEditingProjectId(project.id);
    setValues(devProjectToFormValues(project));
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

    const validationError = validateDevProjectForm(values);
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
        techStack: trimOrNull(values.techStack),
        repoUrl: trimOrNull(values.repoUrl),
        stagingUrl: trimOrNull(values.stagingUrl),
        productionUrl: trimOrNull(values.productionUrl),
        startDate: values.startDate || null,
        etaDate: values.etaDate || null,
      };
      const projectName = values.projectName.trim();

      if (editingProjectId) {
        await updateDevProject(editingProjectId, {
          ...payload,
          isActive: values.isActive,
        });
        showToast("success", `"${projectName}" updated successfully.`);
      } else {
        await createDevProject(payload);
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
      await deleteDevProject(editingProjectId);
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
