import { Button } from "@/shared/ui/button";
import { DatePicker } from "@/shared/components/DatePicker";
import { MultiSelect } from "@/shared/ui/MultiSelect";
import { cn } from "@/shared/lib/utils";

import {
  AD_PLATFORM_ORDER,
  CUSTOM_REPORT_MAX_ACCOUNTS,
  CUSTOM_REPORT_MAX_DAYS,
  CUSTOM_REPORT_PERIOD_OPTIONS,
  ORGANIC_PLATFORM_ORDER,
  type CustomReportKind,
  type CustomReportPeriodId,
} from "../../constants/customReport";
import {
  AD_PLATFORM_BADGE_CLASS,
  ORGANIC_PLATFORM_BADGE_CLASS,
  adAccountKindLabel,
  organicPlatformLabel,
} from "../../constants/growthPlatformConfig";
import type {
  CustomReportAccountOption,
  CustomReportFormState,
} from "../../types/customReport";
import type { AdAccountKind, GrowthPlatform } from "../../types/types";

function SegmentButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "ghost"}
      className="h-8 rounded-full px-3 text-xs"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

type CustomReportBuilderFormProps = {
  values: CustomReportFormState;
  accounts: CustomReportAccountOption[];
  isAccountsLoading: boolean;
  accountsEmpty: boolean;
  isGenerating: boolean;
  hasPdf: boolean;
  onKindChange: (kind: CustomReportKind) => void;
  onPlatformChange: (platform: GrowthPlatform | AdAccountKind) => void;
  onAccountsChange: (ids: string[]) => void;
  onPeriodChange: (periodId: CustomReportPeriodId) => void;
  onDateChange: (field: "startDate" | "endDate", value: string) => void;
  onGenerate: () => void;
  onDownload: () => void;
  onOpenEmail: () => void;
};

export function CustomReportBuilderForm({
  values,
  accounts,
  isAccountsLoading,
  accountsEmpty,
  isGenerating,
  hasPdf,
  onKindChange,
  onPlatformChange,
  onAccountsChange,
  onPeriodChange,
  onDateChange,
  onGenerate,
  onDownload,
  onOpenEmail,
}: CustomReportBuilderFormProps) {
  const platformOptions =
    values.kind === "organic" ? ORGANIC_PLATFORM_ORDER : AD_PLATFORM_ORDER;

  const platformAccounts = accounts.filter(
    (account) => account.platform === values.platform,
  );

  const accountOptions = platformAccounts.map((account) => ({
    value: account.id,
    label: account.label,
    group: account.caption,
  }));

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold">1. Account type</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Organic social or paid ads — one report kind at a time.
          </p>
          <div className="inline-flex gap-1 rounded-full border border-border bg-muted/30 p-1">
            <SegmentButton
              label="Organic"
              active={values.kind === "organic"}
              onClick={() => onKindChange("organic")}
            />
            <SegmentButton
              label="Ads"
              active={values.kind === "ad"}
              onClick={() => onKindChange("ad")}
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold">2. Platform</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Filter accounts by platform.
          </p>
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-muted/30 p-1">
            {platformOptions.map((platform) => {
              const label =
                values.kind === "organic"
                  ? organicPlatformLabel(platform as GrowthPlatform)
                  : adAccountKindLabel(platform as AdAccountKind);
              const colorClass =
                values.kind === "organic"
                  ? ORGANIC_PLATFORM_BADGE_CLASS[platform as GrowthPlatform]
                  : AD_PLATFORM_BADGE_CLASS[platform as AdAccountKind];
              return (
                <Button
                  key={platform}
                  type="button"
                  size="sm"
                  variant={values.platform === platform ? "default" : "ghost"}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs",
                    values.platform !== platform && colorClass,
                  )}
                  onClick={() => onPlatformChange(platform)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold">3. Accounts</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Select up to {CUSTOM_REPORT_MAX_ACCOUNTS} accounts for this PDF.
          </p>
          {isAccountsLoading ? (
            <p className="py-4 text-xs text-muted-foreground">Loading accounts…</p>
          ) : accountsEmpty || platformAccounts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No connected accounts for this platform. Add them in Manage Accounts.
            </p>
          ) : (
            <div className="max-w-xl">
              <MultiSelect
                id="custom-report-accounts"
                label="Accounts"
                value={values.selectedAccountIds}
                onChange={(next) =>
                  onAccountsChange(next.slice(0, CUSTOM_REPORT_MAX_ACCOUNTS))
                }
                options={accountOptions}
                placeholder="Select accounts"
                emptyMessage="No accounts available."
              />
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold">4. Date range</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            One shared range for all selected accounts (max {CUSTOM_REPORT_MAX_DAYS}{" "}
            days). The PDF includes every synced metric for that period.
          </p>
          <div className="mb-3 inline-flex flex-wrap gap-1 rounded-full border border-border bg-muted/30 p-1">
            {CUSTOM_REPORT_PERIOD_OPTIONS.map((option) => (
              <SegmentButton
                key={option.id}
                label={option.label}
                active={values.periodId === option.id}
                onClick={() => onPeriodChange(option.id)}
              />
            ))}
          </div>
          {values.periodId === "custom" ? (
            <div className="grid max-w-xl gap-4 sm:grid-cols-2">
              <DatePicker
                label="Start date"
                value={values.startDate}
                onChange={(value) => onDateChange("startDate", value)}
              />
              <DatePicker
                label="End date"
                value={values.endDate}
                onChange={(value) => onDateChange("endDate", value)}
              />
            </div>
          ) : null}
        </section>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4">
          {hasPdf ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={onDownload}
              >
                Download PDF
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={onOpenEmail}
              >
                Email PDF
              </Button>
            </>
          ) : null}
          <Button
            type="button"
            className="rounded-full"
            disabled={
              isGenerating ||
              accountsEmpty ||
              platformAccounts.length === 0 ||
              values.selectedAccountIds.length === 0
            }
            onClick={onGenerate}
          >
            {isGenerating ? "Generating…" : "Generate report"}
          </Button>
        </div>
      </div>
    </div>
  );
}
