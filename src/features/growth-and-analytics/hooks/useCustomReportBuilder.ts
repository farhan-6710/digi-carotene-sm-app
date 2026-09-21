import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";

import { useFetch } from "@/shared/hooks/useFetch";
import { showToast } from "@/shared/utils/showToast";
import { sendCustomReportEmail } from "@/services/customReportEmailService";

import {
  CUSTOM_REPORT_MAX_ACCOUNTS,
  type CustomReportKind,
  type CustomReportPeriodId,
} from "../constants/customReport";
import type { CustomReportFormState } from "../types/customReport";
import type { AdAccountKind, GrowthPlatform } from "../types/types";
import {
  buildCustomReportDocument,
  listCustomReportAccounts,
} from "../utils/buildCustomReportDocument";
import {
  resolveCustomReportPeriod,
  validateCustomReportRange,
} from "../utils/customReportPeriod";
import {
  blobToBase64,
  buildCustomReportPdfBlob,
  downloadBlob,
} from "../utils/customReportPdf";

function defaultPlatform(kind: CustomReportKind): GrowthPlatform | AdAccountKind {
  return kind === "organic" ? "instagram" : "meta_ads";
}

export function useCustomReportBuilder() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [values, setValues] = useState<CustomReportFormState>(() => ({
    kind: "organic",
    platform: "instagram",
    selectedAccountIds: [],
    periodId: "this_month",
    startDate: today,
    endDate: today,
  }));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [periodLabel, setPeriodLabel] = useState("");

  const loadAccounts = useCallback(
    () => listCustomReportAccounts(values.kind),
    [values.kind],
  );
  const { data: accounts, isLoading, error } = useFetch(loadAccounts, []);

  const platformAccounts = useMemo(
    () => accounts.filter((account) => account.platform === values.platform),
    [accounts, values.platform],
  );

  const setKind = (kind: CustomReportKind) => {
    setValues((prev) => ({
      ...prev,
      kind,
      platform: defaultPlatform(kind),
      selectedAccountIds: [],
    }));
    setPdfBlob(null);
  };

  const setPlatform = (platform: GrowthPlatform | AdAccountKind) => {
    setValues((prev) => ({
      ...prev,
      platform,
      selectedAccountIds: [],
    }));
    setPdfBlob(null);
  };

  const setAccounts = (ids: string[]) => {
    setValues((prev) => ({
      ...prev,
      selectedAccountIds: ids.slice(0, CUSTOM_REPORT_MAX_ACCOUNTS),
    }));
    setPdfBlob(null);
  };

  const setPeriodId = (periodId: CustomReportPeriodId) => {
    setValues((prev) => {
      if (periodId !== "custom") {
        return { ...prev, periodId };
      }
      // Prefill custom from the period the user was viewing — avoid today→today zeros.
      const resolved = resolveCustomReportPeriod(
        prev.periodId === "custom" ? "this_month" : prev.periodId,
        prev.startDate,
        prev.endDate,
      );
      return {
        ...prev,
        periodId,
        startDate: resolved.from,
        endDate: resolved.to,
      };
    });
    setPdfBlob(null);
  };

  const setDate = (field: "startDate" | "endDate", value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setPdfBlob(null);
  };

  const generate = async () => {
    if (values.selectedAccountIds.length === 0) {
      showToast("error", "Select at least one account.");
      return;
    }

    const { from, to } = resolveCustomReportPeriod(
      values.periodId,
      values.startDate,
      values.endDate,
    );
    const rangeError = validateCustomReportRange(from, to);
    if (rangeError) {
      showToast("error", rangeError);
      return;
    }

    setIsGenerating(true);
    try {
      const documentData = await buildCustomReportDocument({
        kind: values.kind,
        accountIds: values.selectedAccountIds,
        from,
        to,
      });
      const blob = await buildCustomReportPdfBlob(documentData);
      setPdfBlob(blob);
      setPeriodLabel(documentData.periodLabel);
      showToast("success", "Report PDF ready — download or email it.");
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Could not generate the report.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const download = () => {
    if (!pdfBlob) return;
    downloadBlob(pdfBlob, `digi-carotene-growth-report-${Date.now()}.pdf`);
  };

  const sendEmail = async (emails: string[]) => {
    if (!pdfBlob) {
      showToast("error", "Generate the report first.");
      return;
    }
    setIsSending(true);
    try {
      const base64 = await blobToBase64(pdfBlob);
      await sendCustomReportEmail({
        toEmails: emails,
        pdfBase64: base64,
        filename: `digi-carotene-growth-report.pdf`,
        periodLabel: periodLabel || "Selected period",
        accountCount: values.selectedAccountIds.length,
      });
      showToast("success", `Report emailed to ${emails.length} recipient(s).`);
      setEmailOpen(false);
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Could not send the email.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return {
    values,
    accounts: platformAccounts,
    isAccountsLoading: isLoading,
    accountsError: error,
    accountsEmpty: !isLoading && accounts.length === 0,
    isGenerating,
    isSending,
    hasPdf: Boolean(pdfBlob),
    emailOpen,
    setEmailOpen,
    setKind,
    setPlatform,
    setAccounts,
    setPeriodId,
    setDate,
    generate,
    download,
    sendEmail,
  };
}
