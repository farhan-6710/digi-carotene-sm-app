import { Pencil, Plus } from "lucide-react";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { AdsPlatformBadge, MobileLabel } from "../tables/tableBits";
import type { AdAccountsListProps } from "../../types/components";

const GRID_CLASS = "grid-cols-[1.4fr_1fr_1.1fr_0.8fr_0.5fr]";

export function AdAccountsList({
  accounts,
  isLoading = false,
  onAdd,
  onEdit,
}: AdAccountsListProps) {
  return (
    <DirectoryTable
      title="Ad Accounts"
      description="Connected Meta and Google ad accounts for paid campaign reporting."
      gridClass={GRID_CLASS}
      columns={[
        { label: "ACCOUNT" },
        { label: "PLATFORM" },
        { label: "CLIENT" },
        { label: "CURRENCY" },
        { label: "", align: "right" },
      ]}
      isLoading={isLoading}
      isEmpty={accounts.length === 0}
      emptyMessage="No ad accounts connected yet."
      headerAside={
        <Button onClick={onAdd} className="rounded-full">
          <Plus className="size-4" />
          Connect Account
        </Button>
      }
    >
      {accounts.map((account) => (
        <div
          key={account.id}
          className={cn(
            "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
            GRID_CLASS,
          )}
        >
          <div className="text-sm font-medium text-foreground">
            <MobileLabel>ACCOUNT</MobileLabel>
            {account.accountName}
            <span className="block font-mono text-xs text-muted-foreground">
              {account.adAccountId}
            </span>
          </div>
          <div>
            <MobileLabel>PLATFORM</MobileLabel>
            <AdsPlatformBadge platform={account.platform} />
          </div>
          <div className="text-sm font-medium text-foreground">
            <MobileLabel>CLIENT</MobileLabel>
            {account.clientName}
          </div>
          <div className="text-sm text-foreground">
            <MobileLabel>CURRENCY</MobileLabel>
            {account.currencyCode}
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(account)}
            >
              <Pencil className="size-3.5" />
              <span className="sr-only">Edit ad account</span>
            </Button>
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
