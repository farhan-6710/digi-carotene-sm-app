import { useCallback, useState } from "react";

import type { ProjectFormSeeds } from "@/features/projects-management/types/components";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/services/projectsService";
import { fetchTeamMembersByIds } from "@/services/teamMembersService";
import {
  emptyProjectFormValues,
  projectToFormValues,
  formValuesToSocials,
  validateProjectForm,
  type ProjectFormField,
  type ProjectFormValues,
} from "@/features/projects-management/utils/projectFormUtils";
import { showToast } from "@/shared/utils/showToast";

type UseProjectDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useProjectDialog({ reload, setError }: UseProjectDialogOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<ProjectFormValues>(emptyProjectFormValues);
  const [formSeeds, setFormSeeds] = useState<ProjectFormSeeds | null>(null);

  const resetForm = useCallback(() => {
    setValues(emptyProjectFormValues());
    setEditingProjectId(null);
    setFormSeeds(null);
  }, []);

  const onFieldChange = useCallback((field: ProjectFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const onClientChange = useCallback((clientId: string) => {
    setValues((current) => ({ ...current, clientId }));
  }, []);

  const onManagerChange = useCallback((managerId: string) => {
    setValues((current) => ({
      ...current,
      managerId,
      teamMemberIds: current.teamMemberIds.filter((id) => id !== managerId),
    }));
  }, []);

  const onTeamMemberIdsChange = useCallback((teamMemberIds: string[]) => {
    setValues((current) => ({ ...current, teamMemberIds }));
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

  const openEditDialog = useCallback((project: ProjectListItem) => {
    setEditingProjectId(project.id);
    setValues(projectToFormValues(project));
    setFormSeeds({
      client: project.clients,
      manager: project.team_members,
      teamMembers: [],
    });
    setIsDialogOpen(true);

    if (project.team_member_ids.length > 0) {
      void fetchTeamMembersByIds(project.team_member_ids).then((members) => {
        setFormSeeds((current) =>
          current
            ? {
                ...current,
                teamMembers: members.map(({ id, member_name }) => ({
                  id,
                  member_name,
                })),
              }
            : null,
        );
      });
    }
  }, []);

  const saveProject = useCallback(async () => {
    if (isSaving) {
      return;
    }

    const validationError = validateProjectForm(values);
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
        socials: formValuesToSocials(values),
        teamMemberIds: values.teamMemberIds,
      };

      const projectName = values.projectName.trim();

      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
        showToast("success", `"${projectName}" updated successfully.`);
      } else {
        await createProject(payload);
        showToast("success", `"${projectName}" added successfully.`);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save project.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingProjectId, handleDialogOpenChange, isSaving, reload, setError, values]);

  const removeProject = useCallback(async () => {
    if (!editingProjectId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const projectName = values.projectName.trim();
      await deleteProject(editingProjectId);
      await reload();
      handleDialogOpenChange(false);
      showToast("success", `"${projectName}" removed successfully.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete project.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingProjectId, handleDialogOpenChange, isSaving, reload, setError, values.projectName]);

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
      onClientChange,
      onManagerChange,
      onTeamMemberIdsChange,
      onSave: saveProject,
      onDelete: editingProjectId ? removeProject : undefined,
    },
  };
}
