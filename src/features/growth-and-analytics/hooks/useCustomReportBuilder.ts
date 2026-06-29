import { useCallback, useMemo, useState } from "react";

import { fetchAdAccounts, fetchOrganicAccounts } from "@/services/growthAccountsService";
import { useUrlDateFields } from "@/shared/hooks/useUrlDateFields";
import { useFetch } from "@/shared/hooks/useFetch";
import { showToast } from "@/shared/utils/showToast";

import { defaultCustomReportForm } from "../constants/customReportData";
import type { CustomReportFormState } from "../types/components";
import type { ReportableAccount } from "../types/types";
import { buildCustomReportInput } from "../utils/customReportMeta";
import { saveGrowthReport } from "../utils/generateReport";
import { resolveGrowthReportPeriod } from "../utils/reportPeriod";
import { buildReportableAccounts } from "../utils/reportableAccounts";
import { useGrowthAccountsUpdated } from "./useGrowthAccountsUpdated";

const NO_ACCOUNTS: ReportableAccount[] = [];

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id)
    ? ids.filter((value) => value !== id)
    : [...ids, id];
}

export function useCustomReportBuilder() {
  const { fromDate, toDate, setFromDate, setToDate } = useUrlDateFields();

  const loadAccounts = useCallback(async () => {
    const [organic, ads] = await Promise.all([
      fetchOrganicAccounts(),
      fetchAdAccounts(),
    ]);
    return buildReportableAccounts(organic, ads);
  }, []);

  const {
    data: reportableAccounts,
    isLoading: isAccountsLoading,
    error: accountsError,
    reload: reloadAccounts,
  } = useFetch<ReportableAccount[]>(loadAccounts, NO_ACCOUNTS);

  useGrowthAccountsUpdated(reloadAccounts);

  const [localValues, setLocalValues] = useState(() => ({
    selectedAccountIds: defaultCustomReportForm.selectedAccountIds,
    selectedMetricIds: defaultCustomReportForm.selectedMetricIds,
    format: defaultCustomReportForm.format,
  }));
  const [isGenerating, setIsGenerating] = useState(false);

  const values: CustomReportFormState = {
    ...localValues,
    startDate: fromDate,
    endDate: toDate,
  };

  const toggleAccount = useCallback((id: string) => {
    setLocalValues((prev) => ({
      ...prev,
      selectedAccountIds: toggleId(prev.selectedAccountIds, id),
    }));
  }, []);

  const toggleMetric = useCallback((id: string) => {
    setLocalValues((prev) => ({
      ...prev,
      selectedMetricIds: toggleId(prev.selectedMetricIds, id),
    }));
  }, []);

  const changeField = useCallback(
    (field: "startDate" | "endDate" | "format", value: string) => {
      if (field === "startDate") {
        setFromDate(value);
        return;
      }
      if (field === "endDate") {
        setToDate(value);
        return;
      }
      setLocalValues((prev) => ({ ...prev, [field]: value }));
    },
    [setFromDate, setToDate],
  );

  const generate = useCallback(async () => {
    if (reportableAccounts.length === 0) {
      showToast("error", "Connect an organic or ad account before generating a report.");
      return;
    }
    if (values.selectedAccountIds.length === 0) {
      showToast("error", "Select at least one account to include in the report.");
      return;
    }
    if (values.selectedMetricIds.length === 0) {
      showToast("error", "Select at least one metric to include in the report.");
      return;
    }

    const { periodStart, periodEnd } = resolveGrowthReportPeriod({
      from: values.startDate,
      to: values.endDate,
    });

    setIsGenerating(true);
    try {
      await saveGrowthReport(
        buildCustomReportInput(
          values.selectedAccountIds,
          reportableAccounts,
          periodStart,
          periodEnd,
        ),
      );
    } finally {
      setIsGenerating(false);
    }
  }, [
    reportableAccounts,
    values.endDate,
    values.selectedAccountIds,
    values.selectedMetricIds.length,
    values.startDate,
  ]);

  const accountsEmpty = useMemo(
    () => !isAccountsLoading && reportableAccounts.length === 0,
    [isAccountsLoading, reportableAccounts.length],
  );

  return {
    values,
    reportableAccounts,
    isAccountsLoading,
    accountsError,
    accountsEmpty,
    isGenerating,
    toggleAccount,
    toggleMetric,
    changeField,
    generate,
  };
}
