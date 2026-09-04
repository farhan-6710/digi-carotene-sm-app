import { Link2 } from "lucide-react";

import { useGrowthPaths } from "@/features/growth-and-analytics/hooks/useGrowthPaths";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { buttonVariants } from "@/shared/utils/shadcn";
import { cn } from "@/shared/lib/utils";

type GrowthNoAccountsEmptyProps = {
  /** Organic pages vs Campaign Analytics copy. */
  accountKind?: "organic" | "ads";
};

export function GrowthNoAccountsEmpty({
  accountKind = "organic",
}: GrowthNoAccountsEmptyProps) {
  const { canManageAccounts, manageAccountsPath } = useGrowthPaths();

  const title =
    accountKind === "ads"
      ? "No ad accounts connected"
      : "No accounts connected";

  const description = canManageAccounts
    ? accountKind === "ads"
      ? "Please connect an ad account from the Manage Accounts page to view campaign analytics."
      : "Please connect an account from the Manage Accounts page to view analytics."
    : "No accounts are linked yet. Ask your agency team to connect an account.";

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground">
        <Link2 className="size-5" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {canManageAccounts ? (
        <TransitionLink
          to={manageAccountsPath}
          className={cn(buttonVariants(), "rounded-full")}
        >
          Manage Accounts
        </TransitionLink>
      ) : null}
    </div>
  );
}
