import { Link } from "react-router";

import { useGrowthPaths } from "../../hooks/useGrowthPaths";
import { formatLastSyncedLabel } from "../../utils/isSyncStale";

type LearningStaleDataBannerProps = {
  lastSyncedAt: string | null;
  isStale: boolean;
};

export function LearningStaleDataBanner({
  lastSyncedAt,
  isStale,
}: LearningStaleDataBannerProps) {
  const { manageAccountsPath, canManageAccounts } = useGrowthPaths();

  if (!isStale) {
    return (
      <p className="text-sm text-muted-foreground">
        {formatLastSyncedLabel(lastSyncedAt)}
      </p>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <p className="font-medium">
        Data is stale — {formatLastSyncedLabel(lastSyncedAt)}. Numbers below may
        be out of date.
      </p>
      {canManageAccounts ? (
        <Link
          to={manageAccountsPath}
          className="mt-1 inline-block underline underline-offset-2"
        >
          Manage Accounts
        </Link>
      ) : null}
    </div>
  );
}
