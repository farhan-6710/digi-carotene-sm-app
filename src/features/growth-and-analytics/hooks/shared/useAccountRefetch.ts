import { useRef, useState } from "react";

import type { AdAccount, BackfillProgress, OrganicAccount } from "../../types/types";
import {
  fetchAdAccountAccessToken,
  fetchOrganicAccessToken,
} from "@/services/growthAccountsService";
import { rerunAdBackfillForAccount } from "@/services/adBackfillService";
import { rerunInstagramBackfillForOrganicAccount } from "@/services/instagramBackfillService";
import { triggerGoogleAdAccountBackfill } from "@/services/googleAdBackfillService";
import { showToast } from "@/shared/utils/showToast";

function percentFromProgress(progress: BackfillProgress): number {
  if (progress.total <= 0) return 0;
  return Math.min(100, Math.round((progress.completed / progress.total) * 100));
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function useAccountRefetch() {
  const [open, setOpen] = useState(false);
  const [percent, setPercent] = useState(0);
  const [label, setLabel] = useState("Starting…");
  const abortRef = useRef<AbortController | null>(null);

  function beginModal() {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setPercent(0);
    setLabel("Starting…");
    setOpen(true);
  }

  function handleProgress(progress: BackfillProgress) {
    setPercent(percentFromProgress(progress));
    setLabel(progress.label);
  }

  function cancel() {
    abortRef.current?.abort();
  }

  async function finishSuccess() {
    setOpen(false);
    showToast("success", "Account data refreshed.");
    window.location.reload();
  }

  async function finishError(error: unknown) {
    setOpen(false);
    if (isAbortError(error)) {
      showToast("info", "Refetch cancelled. Older numbers are still on screen.");
      return;
    }
    const message =
      error instanceof Error ? error.message : "Could not refresh this account.";
    showToast("error", message);
  }

  async function refetchOrganic(account: OrganicAccount) {
    if (account.platform !== "instagram") {
      showToast(
        "info",
        "Refetch for Facebook Pages is not available yet. Use Manage Accounts to reconnect.",
      );
      return;
    }

    beginModal();
    try {
      const token = await fetchOrganicAccessToken(account.id);
      await rerunInstagramBackfillForOrganicAccount(account.id, token, {
        signal: abortRef.current?.signal,
        onProgress: handleProgress,
      });
      await finishSuccess();
    } catch (error) {
      await finishError(error);
    }
  }

  async function refetchAd(account: AdAccount) {
    beginModal();
    try {
      if (account.platform === "google_ads") {
        await triggerGoogleAdAccountBackfill(account.id, undefined, {
          signal: abortRef.current?.signal,
          onProgress: handleProgress,
        });
        await finishSuccess();
        return;
      }

      const token = await fetchAdAccountAccessToken(account.id);
      await rerunAdBackfillForAccount(account.id, account.adAccountId, token, {
        signal: abortRef.current?.signal,
        onProgress: handleProgress,
      });
      await finishSuccess();
    } catch (error) {
      await finishError(error);
    }
  }

  return {
    refetchOrganic,
    refetchAd,
    cancel,
    modalProps: {
      open,
      percent,
      label,
      onCancel: cancel,
    },
  };
}
