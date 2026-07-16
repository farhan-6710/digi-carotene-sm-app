import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { statusOptions } from "@/features/posts-management/constants/postsManagement";
import {
  POSTS_MANAGEMENT_PATH,
  parseAddPostPrefillDate,
  parseAddPostPrefillProject,
} from "@/features/posts-management/constants/routes";
import { saveDraftDaysMutation } from "@/features/posts-management/utils/postDialogMutations";
import {
  buildAddFormValues,
  createDraftDay,
  type PostDraftDay,
  type PostFormValues,
} from "@/features/posts-management/utils/postFormUtils";
import { showToast } from "@/shared/utils/showToast";

function seedValuesFromDate(
  date: Date,
  project?: { projectId: string; projectName: string } | null,
): PostFormValues {
  return {
    ...buildAddFormValues(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ),
    projectId: project?.projectId ?? "",
    projectName: project?.projectName ?? "",
  };
}

function bumpScheduleDay(values: PostFormValues): PostFormValues {
  const schedule = values.toBePostedOn;
  if (!schedule) {
    return seedValuesFromDate(new Date());
  }

  const next = new Date(schedule.year, schedule.month - 1, schedule.day);
  next.setDate(next.getDate() + 1);

  return {
    ...values,
    toBePostedOn: {
      year: next.getFullYear(),
      month: next.getMonth() + 1,
      day: next.getDate(),
      time: schedule.time,
    },
    postedOn: null,
  };
}

export function useAddPostsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { teamRole, teamMemberId } = useAuth();

  const initialDraft = useMemo(() => {
    const prefillDate = parseAddPostPrefillDate(searchParams) ?? new Date();
    const prefillProject = parseAddPostPrefillProject(searchParams);
    return createDraftDay(seedValuesFromDate(prefillDate, prefillProject));
  }, [searchParams]);

  const [drafts, setDrafts] = useState<PostDraftDay[]>([initialDraft]);
  const [activeDayId, setActiveDayId] = useState(initialDraft.id);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removeDayId, setRemoveDayId] = useState<string | null>(null);

  const activeDraft = drafts.find((draft) => draft.id === activeDayId) ?? drafts[0];

  const selectDay = useCallback((dayId: string) => {
    setActiveDayId(dayId);
  }, []);

  const addDay = useCallback(() => {
    const source = drafts.find((draft) => draft.id === activeDayId) ?? drafts[drafts.length - 1];
    const next = createDraftDay(bumpScheduleDay(source.values));
    setDrafts((current) => [...current, next]);
    setActiveDayId(next.id);
  }, [activeDayId, drafts]);

  const confirmRemoveDay = useCallback(() => {
    if (!removeDayId || drafts.length <= 1) {
      setRemoveDayId(null);
      return;
    }

    setDrafts((current) => {
      const next = current.filter((draft) => draft.id !== removeDayId);
      if (activeDayId === removeDayId) {
        setActiveDayId(next[0]?.id ?? "");
      }
      return next;
    });
    setRemoveDayId(null);
  }, [activeDayId, drafts.length, removeDayId]);

  const patchActiveValues = useCallback(
    (patch: Partial<PostFormValues>) => {
      setDrafts((current) =>
        current.map((draft) =>
          draft.id === activeDayId
            ? { ...draft, values: { ...draft.values, ...patch } }
            : draft,
        ),
      );
    },
    [activeDayId],
  );

  const saveAll = useCallback(async () => {
    if (isSaving || drafts.length === 0) {
      return;
    }

    setIsSaving(true);

    try {
      const saved = await saveDraftDaysMutation({
        drafts,
        teamRole,
        teamMemberId,
        setError,
      });

      if (!saved) {
        return;
      }

      navigate(POSTS_MANAGEMENT_PATH);
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Failed to create posts.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [drafts, isSaving, navigate, teamMemberId, teamRole]);

  const canSave = drafts.every((draft) => {
    const schedule = draft.values.toBePostedOn;
    return Boolean(
      draft.values.projectId.trim() &&
        schedule?.time.trim() &&
        schedule.day &&
        schedule.month &&
        schedule.year,
    );
  });

  return {
    drafts,
    activeDayId,
    activeDraft,
    statusOptions,
    isSaving,
    error,
    removeDayId,
    setRemoveDayId,
    selectDay,
    addDay,
    confirmRemoveDay,
    patchActiveValues,
    saveAll,
    canSave,
    backPath: POSTS_MANAGEMENT_PATH,
  };
}
