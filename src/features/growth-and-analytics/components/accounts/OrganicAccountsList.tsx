import { Pencil, Plus } from "lucide-react";

import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { MobileLabel, PlatformBadge } from "../tables/tableBits";
import type { OrganicAccountsListProps } from "../../types/components";
import { formatCompact } from "../../utils/formatters";

const GRID_CLASS = "grid-cols-[1.4fr_1fr_1fr_0.8fr_0.5fr]";

export function OrganicAccountsList({
  accounts,
  isLoading = false,
  onAdd,
  onEdit,
}: OrganicAccountsListProps) {
  return (
    <DirectoryTable
      title="Organic Accounts"
      description="Connected Instagram and Facebook profiles for organic insights."
      gridClass={GRID_CLASS}
      columns={[
        { label: "ACCOUNT" },
        { label: "PLATFORM" },
        { label: "FOLLOWERS", align: "right" },
        { label: "STATUS" },
        { label: "", align: "right" },
      ]}
      isLoading={isLoading}
      isEmpty={accounts.length === 0}
      emptyMessage="No organic accounts connected yet."
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
              {account.accountId}
            </span>
          </div>
          <div>
            <MobileLabel>PLATFORM</MobileLabel>
            <PlatformBadge platform={account.platform} />
          </div>
          <div className="text-right font-mono text-sm text-foreground">
            <MobileLabel>FOLLOWERS</MobileLabel>
            {formatCompact(account.followers)}
          </div>
          <div>
            <MobileLabel>STATUS</MobileLabel>
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                account.isActive
                  ? "bg-status-posted/15 text-status-posted"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {account.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(account)}
            >
              <Pencil className="size-3.5" />
              <span className="sr-only">Edit account</span>
            </Button>
          </div>
        </div>
      ))}
    </DirectoryTable>
  );
}
