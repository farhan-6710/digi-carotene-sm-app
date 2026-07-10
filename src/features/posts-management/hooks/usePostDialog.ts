import { useCallback, useState } from "react";

import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import {
  deletePostMutation,
  savePostMutation,
} from "@/features/posts-management/utils/postDialogMutations";
import type { Post, Slot } from "@/features/posts-management/types/types";
import { getDayLabel } from "@/features/posts-management/utils/calendarUtils";
import { postToSlotClient } from "@/features/posts-management/utils/postsSlots";
import {
  buildAddFormValues,
  buildEditFormValues,
  emptyPostFormValues,
  type ActiveSlot,
  type PostFormValues,
} from "@/features/posts-management/utils/postFormUtils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { showToast } from "@/shared/utils/showToast";

type UsePostDialogOptions = {
  slots: Slot[];
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function usePostDialog({ slots, reload, setError }: UsePostDialogOptions) {
  const { teamRole, teamMemberId } = useAuth();
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

  const openEditDialogFromPost = useCallback((post: Post) => {
    const [year, month, day] = post.to_be_posted_date.split("-").map(Number);

    if (!year || !month || !day) {
      return;
    }

    const client = postToSlotClient(post);

    setActiveSlot({
      year,
      month,
      date: day,
      day: getDayLabel(year, month, day),
    });
    setEditingPostId(post.id);
    setValues(buildEditFormValues(client, year, month, day));
    setIsDialogOpen(true);
  }, []);

  const savePost = useCallback(async () => {
    if (!activeSlot || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const saved = await savePostMutation({
        values,
        editingPostId,
        teamRole,
        teamMemberId,
        setError,
      });

      if (!saved) {
        return;
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Failed to save this post.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [activeSlot, editingPostId, handleDialogOpenChange, isSaving, reload, setError, teamMemberId, teamRole, values]);

  const removePost = useCallback(async () => {
    if (!editingPostId || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const deleted = await deletePostMutation({ editingPostId, setError });
      if (!deleted) {
        return;
      }

      await reload();
      handleDialogOpenChange(false);
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
    openEditDialogFromPost,
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
