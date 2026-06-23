import { Link } from "react-router";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { agencyMeta } from "@/features/public/constants/agency";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";

export function UserPortalPage() {
  const { loading, signOut, refreshProfile } = useAuth();

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-3xl font-semibold tracking-wider text-muted-foreground uppercase transition hover:text-foreground"
          >
            {agencyMeta.name}
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold tracking-tight">Access pending</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is active, but portal access has not been configured yet.
            Please contact Digi Carotene Management to get staff or client access
            assigned to your email.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Once access is granted, refresh this page and you will be redirected
            automatically.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void refreshProfile()}
            >
              Refresh access
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void signOut()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
