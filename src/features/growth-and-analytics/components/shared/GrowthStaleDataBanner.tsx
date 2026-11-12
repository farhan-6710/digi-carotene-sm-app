import {
  formatLastSyncedLabel,
  formatStaleAgeLabel,
} from "../../utils/shared/isSyncStale";
import { Button } from "@/shared/ui/button";

type GrowthStaleDataBannerProps = {
  lastSyncedAt: string | null;
  isStale: boolean;
  onRefetch?: () => void;
  refetchDisabled?: boolean;
};

export function GrowthStaleDataBanner({
  lastSyncedAt,
  isStale,
  onRefetch,
  refetchDisabled = false,
}: GrowthStaleDataBannerProps) {
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
      className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="font-medium">
        Some data is still stale from {formatStaleAgeLabel(lastSyncedAt)}.
        Numbers below may be out of date — refetch to refresh.
      </p>
      {onRefetch ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-destructive/40 bg-background text-destructive hover:bg-destructive/10"
          onClick={onRefetch}
          disabled={refetchDisabled}
        >
          Refetch data
        </Button>
      ) : null}
    </div>
  );
}
