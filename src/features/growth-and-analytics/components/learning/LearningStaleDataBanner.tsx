import { GrowthStaleDataBanner } from "../GrowthStaleDataBanner";

type LearningStaleDataBannerProps = {
  lastSyncedAt: string | null;
  isStale: boolean;
  onRefetch?: () => void;
  refetchDisabled?: boolean;
};

/** Learning surfaces reuse the shared Growth stale + refetch banner. */
export function LearningStaleDataBanner({
  lastSyncedAt,
  isStale,
  onRefetch,
  refetchDisabled,
}: LearningStaleDataBannerProps) {
  return (
    <GrowthStaleDataBanner
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      onRefetch={onRefetch}
      refetchDisabled={refetchDisabled}
    />
  );
}
