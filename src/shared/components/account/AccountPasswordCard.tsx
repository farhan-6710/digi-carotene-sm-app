import { useState } from "react";

import { AccountPasswordDialog } from "@/shared/components/account/AccountPasswordDialog";
import { AccountPanelCard } from "@/shared/components/account/AccountPanelCard";
import type { AccountPasswordCardProps } from "@/shared/components/account/types";
import { ACCOUNT_PASSWORD_HINT } from "@/shared/constants/accountPassword";
import {
  getUserEmail,
  userCanRemovePassword,
  userHasPasswordLogin,
} from "@/shared/utils/authUserDisplay";
import { Button } from "@/shared/ui/button";

export function AccountPasswordCard({ user }: AccountPasswordCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const email = user?.email ?? "";
  const hasPassword = userHasPasswordLogin(user);
  const canRemove = userCanRemovePassword(user);
  const displayEmail = getUserEmail(user);

  return (
    <>
      <AccountPanelCard title="Login password">
        <p className="text-sm text-muted-foreground">{ACCOUNT_PASSWORD_HINT}</p>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </p>
          <p className="truncate text-sm font-medium text-foreground">
            {displayEmail}
          </p>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </p>
          <p
            className={
              hasPassword
                ? "text-sm font-medium text-status-posted"
                : "text-sm font-medium text-muted-foreground"
            }
          >
            {hasPassword ? "Password is set" : "No password set yet"}
          </p>
        </div>

        <Button
          type="button"
          className="mt-5"
          onClick={() => setDialogOpen(true)}
        >
          {hasPassword ? "Change password" : "Set a password"}
        </Button>
      </AccountPanelCard>

      <AccountPasswordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        email={email}
        isChange={hasPassword}
        canRemove={canRemove}
      />
    </>
  );
}
