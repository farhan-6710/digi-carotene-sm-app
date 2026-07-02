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
import { useGrowthSelectedAdAccount } from "../hooks/useGrowthSelectedAdAccount";
import { getOrganicAccountInitials } from "../utils/accountDisplay";

export function GrowthAdAccountHeaderMenu() {
  const {
    accounts,
    accountId,
    setAccountId,
    activeAccount,
    isLoading,
    hasAccounts,
  } = useGrowthSelectedAdAccount();

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
              ? `Selected ad account: ${activeAccount.accountName}. Change account.`
              : "Select ad account"
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
        <DropdownMenuLabel>Ad accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hasAccounts ? (
          <DropdownMenuItem asChild>
            <Link to={`${growthBasePath}/manage-accounts`}>
              Connect an ad account
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
                  )}
                >
                  {getOrganicAccountInitials(account.accountName)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">
                    {account.accountName}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {account.clientName} · {account.currencyCode}
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
