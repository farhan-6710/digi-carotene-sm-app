import { useCallback, useState } from "react";

import { fetchProjects } from "@/features/projects-management/utils/projectsRepository";
import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import { findRegisteredProject } from "@/features/posts-management/utils/projectValidationUtils";
import { showToast } from "@/shared/utils/showToast";
import type { Slot } from "@/features/posts-management/types/types";
import { getDayLabel } from "@/features/posts-management/utils/calendarUtils";
import {
  buildAddFormValues,
  buildEditFormValues,
  emptyPostFormValues,
  postFormToPayload,
  validatePostForm,
  type ActiveSlot,
  type PostFormValues,
} from "@/features/posts-management/utils/postFormUtils";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/features/posts-management/utils/postsRepository";

type UsePostDialogOptions = {
  slots: Slot[];
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function usePostDialog({ slots, reload, setError }: UsePostDialogOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<ActiveSlot | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<PostFormValues>(emptyPostFormValues);

  const resetDialog = useCallback(() => {
    setActiveSlot(null);
    setEditingPostId(null);
    setValues(emptyPostFormValues());
  }, []);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        resetDialog();
      }
    },
    [resetDialog],
  );

  const openAddDialog = useCallback(
    (slotYear: number, slotMonth: number, date: number) => {
      setActiveSlot({
        year: slotYear,
        month: slotMonth,
        date,
        day: getDayLabel(slotYear, slotMonth, date),
      });
      setEditingPostId(null);
      setValues(buildAddFormValues(slotYear, slotMonth, date));
      setIsDialogOpen(true);
    },
    [],
  );

  const openEditDialog = useCallback(
    (slotYear: number, slotMonth: number, date: number, postId: string) => {
      const slot = slots.find(
        (entry) =>
          entry.year === slotYear &&
          entry.month === slotMonth &&
          entry.date === date,
      );
      const client = slot?.clients.find((entry) => entry.id === postId);

      if (!client) {
        return;
      }

      setActiveSlot({
        year: slotYear,
        month: slotMonth,
        date,
        day: slot?.day ?? getDayLabel(slotYear, slotMonth, date),
      });
      setEditingPostId(postId);
      setValues(buildEditFormValues(client, slotYear, slotMonth, date));
      setIsDialogOpen(true);
    },
    [slots],
  );

  const savePost = useCallback(async () => {
    if (!activeSlot || isSaving) {
      return;
    }

    const validationError = validatePostForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const projects = await fetchProjects();

      if (projects.length === 0) {
        showToast("error", "Create a project before adding posts.");
        return;
      }

      const registeredProject = findRegisteredProject(values.projectId, projects);

      if (!registeredProject) {
        showToast("error", "Please select a valid project or create one first.");
        return;
      }

      const payload = {
        ...postFormToPayload(values),
        projectId: registeredProject.id,
      };

      if (editingPostId) {
        await updatePost(editingPostId, payload);
      } else {
        await createPost(payload);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save this post.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [activeSlot, editingPostId, handleDialogOpenChange, isSaving, reload, setError, values]);

  const removePost = useCallback(async () => {
    if (!editingPostId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await deletePost(editingPostId);
      await reload();
      handleDialogOpenChange(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete this post.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [editingPostId, handleDialogOpenChange, isSaving, reload, setError]);

  const patchValues = useCallback((patch: Partial<PostFormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
  }, []);

  return {
    statusOptions,
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: editingPostId !== null,
      isSaving,
      statusOptions,
      values,
      patchValues,
      onSave: savePost,
      onDelete: editingPostId ? removePost : undefined,
    },
  };
}
