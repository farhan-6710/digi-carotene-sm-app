import { useClientGrowthAccounts } from "@/features/client-portal/hooks/useClientGrowthAccounts";
import {
  MobileLabel,
  PlatformBadge,
} from "@/features/growth-and-analytics/components/tables/tableBits";
import { formatCompact } from "@/features/growth-and-analytics/utils/formatters";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { PageShell } from "@/shared/components/PageShell";
import { cn } from "@/shared/lib/utils";

const ORGANIC_GRID = "grid-cols-[1.6fr_1fr_1fr]";
const AD_GRID = "grid-cols-[1.6fr_1fr]";

export function ClientGrowthPage() {
  const { organic, ads, hasAccounts, isLoading, error } =
    useClientGrowthAccounts();

  return (
    <PageShell
      heading="Growth & Analytics"
      description="Performance insights for the social and ad accounts connected to your brand."
      error={error && !isLoading ? error : null}
    >
      {!isLoading && !hasAccounts ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">
            Your analytics aren’t connected yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please contact Digi Carotene to connect your social and ad accounts.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <DirectoryTable
            title="Social Accounts"
            description="Instagram and Facebook profiles connected to your brand."
            gridClass={ORGANIC_GRID}
            columns={[
              { label: "ACCOUNT" },
              { label: "PLATFORM" },
              { label: "FOLLOWERS", align: "right" },
            ]}
            isLoading={isLoading}
            isEmpty={organic.length === 0}
            emptyMessage="No social accounts connected yet."
          >
            {organic.map((account) => (
              <div
                key={account.id}
                className={cn(
                  "grid items-center gap-2 px-6 py-4 sm:gap-4",
                  ORGANIC_GRID,
                )}
              >
                <div className="text-sm font-medium text-foreground">
                  <MobileLabel>ACCOUNT</MobileLabel>
                  {account.accountName}
                </div>
                <div>
                  <MobileLabel>PLATFORM</MobileLabel>
                  <PlatformBadge platform={account.platform} />
                </div>
                <div className="text-right font-mono text-sm text-foreground">
                  <MobileLabel>FOLLOWERS</MobileLabel>
                  {formatCompact(account.followers)}
                </div>
              </div>
            ))}
          </DirectoryTable>

          <DirectoryTable
            title="Ad Accounts"
            description="Meta ad accounts connected to your brand."
            gridClass={AD_GRID}
            columns={[{ label: "ACCOUNT" }, { label: "CURRENCY" }]}
            isLoading={isLoading}
            isEmpty={ads.length === 0}
            emptyMessage="No ad accounts connected yet."
          >
            {ads.map((account) => (
              <div
                key={account.id}
                className={cn(
                  "grid items-center gap-2 px-6 py-4 sm:gap-4",
                  AD_GRID,
                )}
              >
                <div className="text-sm font-medium text-foreground">
                  <MobileLabel>ACCOUNT</MobileLabel>
                  {account.accountName}
                </div>
                <div className="text-sm text-muted-foreground">
                  <MobileLabel>CURRENCY</MobileLabel>
                  {account.currencyCode}
                </div>
              </div>
            ))}
          </DirectoryTable>
        </div>
      )}
    </PageShell>
  );
}
