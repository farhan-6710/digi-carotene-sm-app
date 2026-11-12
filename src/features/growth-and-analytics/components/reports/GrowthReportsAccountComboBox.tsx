import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { ComboBox } from "@/shared/ui/ComboBox";

import { GROWTH_REPORT_ACCOUNT_PARAM } from "../constants/growthUrlParams";
import { useGrowthSelectedAccount } from "../hooks/useGrowthSelectedAccount";
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";

// Single combobox listing both organic and ad accounts. Selecting one drives the
// underlying selection so Reports / Custom Report Builder show that account's data.
export function GrowthReportsAccountComboBox() {
  const organic = useGrowthSelectedAccount();
  const ads = useGrowthSelectedAdAccount();
  const [searchParams, setSearchParams] = useSearchParams();

  const options = useMemo(
    () => [
      ...organic.accounts.map((account) => ({
        value: `organic:${account.id}`,
        label: `${account.accountName} · ${
          account.platform === "instagram" ? "Instagram" : "Facebook"
        }`,
      })),
      ...ads.accounts.map((account) => ({
        value: `ad:${account.id}`,
        label: `${account.accountName} · Ad account`,
      })),
    ],
    [organic.accounts, ads.accounts],
  );

  const paramValue = searchParams.get(GROWTH_REPORT_ACCOUNT_PARAM) ?? "";
  const value = options.some((option) => option.value === paramValue)
    ? paramValue
    : (options[0]?.value ?? "");

  function handleChange(next: string) {
    if (!next) return;

    const [kind, id] = next.split(":");
    if (kind === "organic") organic.setAccountId(id);
    if (kind === "ad") ads.setAccountId(id);

    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        params.set(GROWTH_REPORT_ACCOUNT_PARAM, next);
        return params;
      },
      { replace: true },
    );
  }

  return (
    <div className="w-full sm:w-72">
      <ComboBox
        value={value}
        onChange={handleChange}
        options={options}
        isLoading={organic.isLoading || ads.isLoading}
        placeholder="Select account"
        listTitle="Connected accounts"
        emptyMessage="No accounts connected yet."
        noMatchMessage="No matching accounts found."
        mode="value"
      />
    </div>
  );
}
