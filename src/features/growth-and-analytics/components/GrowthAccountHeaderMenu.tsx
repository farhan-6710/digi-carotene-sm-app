import { Check, Loader2, Settings2 } from "lucide-react";
import { Link } from "react-router";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { growthBasePath } from "../constants/navigation";
import { useGrowthSelectedAccount } from "../hooks/useGrowthSelectedAccount";
import { getOrganicAccountInitials } from "../utils/accountDisplay";
import { PlatformBadge } from "./tables/tableBits";

export function GrowthAccountHeaderMenu() {
  const {
    accounts,
    accountId,
    setAccountId,
    activeAccount,
    isLoading,
    hasAccounts,
  } = useGrowthSelectedAccount();

  const initials = activeAccount
    ? getOrganicAccountInitials(activeAccount.accountName)
    : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          aria-label={
            activeAccount
              ? `Selected account: ${activeAccount.accountName}. Change account.`
              : "Select organic account"
          }
          className="size-9 rounded-full border border-border p-0"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <span className="flex size-full items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Organic accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hasAccounts ? (
          <DropdownMenuItem asChild>
            <Link to={`${growthBasePath}/manage-accounts`}>
              Connect an account
            </Link>
          </DropdownMenuItem>
        ) : (
          accounts.map((account) => {
            const isSelected = account.id === accountId;

            return (
              <DropdownMenuItem
                key={account.id}
                onSelect={() => setAccountId(account.id)}
                className="flex items-center gap-3 py-2.5"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
                    account.platform === "instagram" && "bg-accent/10 text-accent",
                  )}
                >
                  {getOrganicAccountInitials(account.accountName)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">
                    {account.accountName}
                  </span>
                  <span className="mt-1 block">
                    <PlatformBadge platform={account.platform} />
                  </span>
                </span>
                {isSelected ? (
                  <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                ) : null}
              </DropdownMenuItem>
            );
          })
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to={`${growthBasePath}/manage-accounts`}
            className="flex items-center gap-2"
          >
            <Settings2 className="size-4" />
            Manage accounts
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
