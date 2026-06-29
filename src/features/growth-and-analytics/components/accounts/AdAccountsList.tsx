import { Pencil, Plus } from "lucide-react";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { MobileLabel } from "../tables/tableBits";
import type { AdAccountsListProps } from "../../types/components";

const GRID_CLASS = "grid-cols-[1.4fr_1.2fr_1fr_0.6fr_0.5fr]";

export function AdAccountsList({
  accounts,
  isLoading = false,
  onAdd,
  onEdit,
}: AdAccountsListProps) {
  return (
    <DirectoryTable
      title="Ad Accounts"
      description="Connected Meta ad accounts for paid campaign reporting."
      gridClass={GRID_CLASS}
      columns={[
        { label: "CLIENT" },
        { label: "AD ACCOUNT" },
        { label: "ACCOUNT ID" },
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
            <MobileLabel>CLIENT</MobileLabel>
            {account.clientName}
          </div>
          <div className="text-sm text-muted-foreground">
            <MobileLabel>AD ACCOUNT</MobileLabel>
            {account.accountName}
          </div>
          <div className="font-mono text-sm text-muted-foreground">
            <MobileLabel>ACCOUNT ID</MobileLabel>
            {account.adAccountId}
          </div>
          <div className="text-sm text-foreground">
            <MobileLabel>CURRENCY</MobileLabel>
            {account.currency}
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
