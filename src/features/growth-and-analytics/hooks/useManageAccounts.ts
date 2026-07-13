import { useCallback, useState } from "react";

import { notifyGrowthAccountsUpdated } from "../constants/growthAccountsEvents";
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
    setIsOrganicSaving(true);
    try {
      if (organicEditId) {
        await updateOrganicAccount(organicEditId, organicForm);
        showToast(
          "success",
          organicForm.accessToken.trim()
            ? "Account updated. Cached metrics cleared — open Growth pages to reload."
            : "Organic account updated.",
        );
      } else {
        showToast("info", "Validating account with Meta…");
        await connectOrganicAccount(organicForm);
        showToast("success", "Account connected. Open Dashboard or Content to load metrics.");
      }
      setIsOrganicOpen(false);
      await reloadOrganic();
      notifyGrowthAccountsUpdated();
    } catch (error) {
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
      clientId: account.clientId ?? "",
      clientName: account.clientName,
      accountName: account.accountName,
      adAccountId: account.adAccountId,
      accessToken: "",
      currencyCode: account.currencyCode,
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
    setIsAdSaving(true);
    try {
      if (adEditId) {
        await updateAdAccount(adEditId, adForm);
        showToast(
          "success",
          adForm.accessToken.trim()
            ? "Ad account updated. Cached metrics cleared — open Campaign Analytics to reload."
            : "Ad account updated.",
        );
      } else {
        showToast("info", "Validating ad account and syncing 90 days of campaign data…");
        await connectAdAccount(adForm);
        showToast("success", "Ad account connected. Open Campaign Analytics to view metrics.");
      }
      setIsAdOpen(false);
      await reloadAds();
      notifyGrowthAccountsUpdated();
    } catch (error) {
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
      isSaving: isOrganicSaving,
      values: organicForm,
      onFieldChange: changeOrganicField,
      onSave: saveOrganic,
      onDelete: organicEditId ? deleteOrganic : undefined,
    },
    adDialog: {
      open: isAdOpen,
      onOpenChange: setIsAdOpen,
      isEditing: adEditId !== null,
      isSaving: isAdSaving,
      values: adForm,
      onFieldChange: changeAdField,
      onSave: saveAd,
      onDelete: adEditId ? deleteAd : undefined,
    },
    openOrganicCreate,
    openOrganicEdit,
    openAdCreate,
    openAdEdit,
  };
}
