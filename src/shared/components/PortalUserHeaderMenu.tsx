import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
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
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitials,
} from "@/shared/utils/authUserDisplay";
import type { PortalUserHeaderMenuProps } from "@/shared/types/components";

export function PortalUserHeaderMenu({
  accountPath,
  settingsPath,
}: PortalUserHeaderMenuProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            aria-label={`Account menu for ${displayName}`}
            className={cn(
              "size-9 overflow-hidden rounded-full border border-border p-0",
              avatarUrl && "bg-transparent",
            )}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="truncate font-normal">
            <span className="block truncate font-medium text-foreground">
              {displayName}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to={accountPath} className="flex items-center gap-2">
              <User className="size-4" />
              Account
            </Link>
          </DropdownMenuItem>

          {settingsPath ? (
            <DropdownMenuItem asChild>
              <Link to={settingsPath} className="flex items-center gap-2">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setSignOutOpen(true);
            }}
            className="flex items-center gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
