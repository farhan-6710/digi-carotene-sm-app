import { useCallback, useRef, useState } from "react";

import { notifyGrowthAccountsUpdated } from "../constants/growthAccountsEvents";
import type { BackfillProgress } from "../types/types";
import {
  connectAdAccount,
  connectOrganicAccount,
  deleteAdAccount,
  deleteOrganicAccount,
  fetchAdAccounts,
  fetchOrganicAccounts,
  updateAdAccount,
  updateOrganicAccount,
} from "@/services/growthAccountsService";
import { useFetch } from "@/shared/hooks/useFetch";
import { showToast } from "@/shared/utils/showToast";

import { emptyAdForm, emptyOrganicForm } from "../constants/accountsData";
import type {
  AdAccount,
  AdAccountForm,
  OrganicAccount,
  OrganicAccountForm,
} from "../types/types";

const NO_ORGANIC: OrganicAccount[] = [];
const NO_ADS: AdAccount[] = [];

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function percentFromProgress(progress: BackfillProgress): number {
  if (progress.total <= 0) return 0;
  return Math.min(100, Math.round((progress.completed / progress.total) * 100));
}

export function useManageAccounts() {
  const loadOrganic = useCallback(() => fetchOrganicAccounts(), []);
  const loadAds = useCallback(() => fetchAdAccounts(), []);

  const {
    data: organic,
    isLoading: isOrganicLoading,
    reload: reloadOrganic,
  } = useFetch<OrganicAccount[]>(loadOrganic, NO_ORGANIC);
  const {
    data: ads,
    isLoading: isAdsLoading,
    reload: reloadAds,
  } = useFetch<AdAccount[]>(loadAds, NO_ADS);

  const [isOrganicOpen, setIsOrganicOpen] = useState(false);
  const [organicEditId, setOrganicEditId] = useState<string | null>(null);
  const [organicForm, setOrganicForm] = useState<OrganicAccountForm>(emptyOrganicForm);
  const [isOrganicSaving, setIsOrganicSaving] = useState(false);

  const [isAdOpen, setIsAdOpen] = useState(false);
  const [adEditId, setAdEditId] = useState<string | null>(null);
  const [adForm, setAdForm] = useState<AdAccountForm>(emptyAdForm);
  const [isAdSaving, setIsAdSaving] = useState(false);

  const [backfillOpen, setBackfillOpen] = useState(false);
  const [backfillPercent, setBackfillPercent] = useState(0);
  const [backfillLabel, setBackfillLabel] = useState("Starting…");
  const [backfillFootnote, setBackfillFootnote] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  function beginBackfillModal(footnote?: string) {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setBackfillPercent(0);
    setBackfillLabel("Starting…");
    setBackfillFootnote(footnote);
    setBackfillOpen(true);
  }

  function handleBackfillProgress(progress: BackfillProgress) {
    setBackfillPercent(percentFromProgress(progress));
    setBackfillLabel(progress.label);
  }

  function cancelBackfill() {
    abortRef.current?.abort();
  }

  const backfillOptions = () => ({
    signal: abortRef.current?.signal,
    onProgress: handleBackfillProgress,
  });

  const openOrganicCreate = useCallback(() => {
    setOrganicForm(emptyOrganicForm);
    setOrganicEditId(null);
    setIsOrganicOpen(true);
  }, []);

  const openOrganicEdit = useCallback((account: OrganicAccount) => {
    setOrganicForm({
      platform: account.platform,
      accountName: account.accountName,
      accountId: account.accountId,
      accessToken: "",
      clientId: account.clientId ?? "",
      clientName: "",
    });
    setOrganicEditId(account.id);
    setIsOrganicOpen(true);
  }, []);

  const changeOrganicField = useCallback(
    <Field extends keyof OrganicAccountForm>(
      field: Field,
      value: OrganicAccountForm[Field],
    ) => {
      setOrganicForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const saveOrganic = useCallback(async () => {
    const willBackfill =
      organicForm.platform === "instagram" &&
      (!organicEditId || Boolean(organicForm.accessToken.trim()));

    setIsOrganicSaving(true);
    try {
      if (willBackfill) {
        setIsOrganicOpen(false);
        beginBackfillModal(
          "Follower history covers about the last 30 days (Meta limit).",
        );
      }

      if (organicEditId) {
        await updateOrganicAccount(
          organicEditId,
          organicForm,
          willBackfill ? backfillOptions() : undefined,
        );
        showToast(
          "success",
          organicForm.accessToken.trim()
            ? "Account updated and data synced."
            : "Organic account updated.",
        );
      } else {
        await connectOrganicAccount(
          organicForm,
          willBackfill ? backfillOptions() : undefined,
        );
        showToast("success", "Account connected and data synced.");
      }

      setBackfillOpen(false);
      setIsOrganicOpen(false);
      await reloadOrganic();
      notifyGrowthAccountsUpdated();
    } catch (error) {
      setBackfillOpen(false);
      if (isAbortError(error)) {
        showToast(
          "info",
          "Sync cancelled. The account may still be saved — use Refetch to finish later.",
        );
        await reloadOrganic();
        notifyGrowthAccountsUpdated();
        return;
      }
      showToast("error", errorMessage(error, "Failed to save organic account."));
    } finally {
      setIsOrganicSaving(false);
    }
  }, [organicEditId, organicForm, reloadOrganic]);

  const deleteOrganic = useCallback(async () => {
    if (!organicEditId) return;
    setIsOrganicSaving(true);
    try {
      await deleteOrganicAccount(organicEditId);
      showToast("success", "Organic account removed.");
      setIsOrganicOpen(false);
      await reloadOrganic();
      notifyGrowthAccountsUpdated();
    } catch (error) {
      showToast("error", errorMessage(error, "Failed to remove organic account."));
    } finally {
      setIsOrganicSaving(false);
    }
  }, [organicEditId, reloadOrganic]);

  const openAdCreate = useCallback(() => {
    setAdForm(emptyAdForm);
    setAdEditId(null);
    setIsAdOpen(true);
  }, []);

  const openAdEdit = useCallback((account: AdAccount) => {
    setAdForm({
      platform: account.platform,
      clientId: account.clientId ?? "",
      clientName: account.clientName,
      accountName: account.accountName,
      adAccountId: account.adAccountId,
      accessToken: "",
      currencyCode: account.currencyCode,
      managerId: account.managerId,
      developerToken: "",
      oauthClientId: "",
      oauthClientSecret: "",
      oauthRefreshToken: "",
    });
    setAdEditId(account.id);
    setIsAdOpen(true);
  }, []);

  const changeAdField = useCallback(
    <Field extends keyof AdAccountForm>(field: Field, value: AdAccountForm[Field]) => {
      setAdForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const saveAd = useCallback(async () => {
    const refreshingCreds =
      adForm.platform === "google_ads"
        ? Boolean(adForm.oauthRefreshToken.trim())
        : Boolean(adForm.accessToken.trim());
    const willBackfill = !adEditId || refreshingCreds;

    setIsAdSaving(true);
    try {
      if (willBackfill) {
        setIsAdOpen(false);
        beginBackfillModal();
      }

      if (adEditId) {
        await updateAdAccount(
          adEditId,
          adForm,
          willBackfill ? backfillOptions() : undefined,
        );
        showToast(
          "success",
          refreshingCreds
            ? "Ad account updated and data synced."
            : "Ad account updated.",
        );
      } else {
        await connectAdAccount(adForm, backfillOptions());
        showToast("success", "Ad account connected and data synced.");
      }

      setBackfillOpen(false);
      setIsAdOpen(false);
      await reloadAds();
      notifyGrowthAccountsUpdated();
    } catch (error) {
      setBackfillOpen(false);
      if (isAbortError(error)) {
        showToast(
          "info",
          "Sync cancelled. The account may still be saved — use Refetch to finish later.",
        );
        await reloadAds();
        notifyGrowthAccountsUpdated();
        return;
      }
      showToast("error", errorMessage(error, "Failed to save ad account."));
    } finally {
      setIsAdSaving(false);
    }
  }, [adEditId, adForm, reloadAds]);

  const deleteAd = useCallback(async () => {
    if (!adEditId) return;
    setIsAdSaving(true);
    try {
      await deleteAdAccount(adEditId);
      showToast("success", "Ad account removed.");
      setIsAdOpen(false);
      await reloadAds();
      notifyGrowthAccountsUpdated();
    } catch (error) {
      showToast("error", errorMessage(error, "Failed to remove ad account."));
    } finally {
      setIsAdSaving(false);
    }
  }, [adEditId, reloadAds]);

  return {
    organic,
    ads,
    isOrganicLoading,
    isAdsLoading,
    organicDialog: {
      open: isOrganicOpen,
      onOpenChange: setIsOrganicOpen,
      isEditing: organicEditId !== null,
      isSaving: isOrganicSaving || backfillOpen,
      values: organicForm,
      onFieldChange: changeOrganicField,
      onSave: saveOrganic,
      onDelete: organicEditId ? deleteOrganic : undefined,
    },
    adDialog: {
      open: isAdOpen,
      onOpenChange: setIsAdOpen,
      isEditing: adEditId !== null,
      isSaving: isAdSaving || backfillOpen,
      values: adForm,
      onFieldChange: changeAdField,
      onSave: saveAd,
      onDelete: adEditId ? deleteAd : undefined,
    },
    openOrganicCreate,
    openOrganicEdit,
    openAdCreate,
    openAdEdit,
    backfillModal: {
      open: backfillOpen,
      percent: backfillPercent,
      label: backfillLabel,
      onCancel: cancelBackfill,
      footnote: backfillFootnote,
      title: "Connecting account data",
      description:
        "Pulling the last 90 days and saving this account. This can take a few minutes — please keep this tab open.",
      cancelLabel: "Cancel sync",
    },
  };
}
