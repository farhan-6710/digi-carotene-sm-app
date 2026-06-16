import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserEmail,
  getUserInitials,
} from "@/shared/utils/authUserDisplay";
import type { AccountHeaderProps } from "@/shared/components/account/types";

export function AccountHeader({ user, roleLabel, bio }: AccountHeaderProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const email = getUserEmail(user);
  const avatarUrl = getUserAvatarUrl(user);

  async function handleConfirmSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      setSignOutOpen(false);
      navigate("/auth", { replace: true });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex min-w-0 items-start gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="size-14 shrink-0 rounded-2xl border border-border object-cover sm:size-16"
              />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-xl font-semibold text-primary sm:size-16 sm:text-2xl">
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                {displayName}
              </h2>
              <p className="text-sm text-muted-foreground">{roleLabel}</p>
              <p className="break-all text-sm text-muted-foreground sm:break-normal">
                {email}
              </p>
              {bio ? (
                <p className="hidden max-w-2xl text-sm leading-relaxed text-muted-foreground sm:block sm:pt-1">
                  {bio}
                </p>
              ) : null}
            </div>
          </div>

          {bio ? (
            <p className="text-sm leading-relaxed text-muted-foreground sm:hidden">
              {bio}
            </p>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSignOutOpen(true)}
            disabled={signingOut}
            className="w-full shrink-0 sm:ml-auto sm:w-auto sm:self-start"
          >
            <LogOut aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </div>

      <ConfirmationModal
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        title="Sign out?"
        description="You will need to log in again to access your dashboard or client portal."
        confirmLabel="Sign out"
        confirmVariant="destructive"
        loading={signingOut}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}
