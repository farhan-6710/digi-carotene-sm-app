import { LEARNING_STALE_SYNC_HOURS } from "../constants/campaignLearning";

/** True when last sync is missing or older than 24 hours (PDF §4 header). */
export function isSyncStale(
  lastSyncedAt: string | null | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!lastSyncedAt) return true;
  const syncedMs = Date.parse(lastSyncedAt);
  if (Number.isNaN(syncedMs)) return true;
  const maxAgeMs = LEARNING_STALE_SYNC_HOURS * 60 * 60 * 1000;
  return nowMs - syncedMs > maxAgeMs;
}

export function formatLastSyncedLabel(lastSyncedAt: string | null): string {
  if (!lastSyncedAt) return "Never synced";
  const syncedMs = Date.parse(lastSyncedAt);
  if (Number.isNaN(syncedMs)) return "Never synced";
  const diffHours = Math.floor((Date.now() - syncedMs) / (60 * 60 * 1000));
  if (diffHours < 1) return "Last synced just now";
  if (diffHours < 24) return `Last synced ${diffHours}h ago`;
  const days = Math.floor(diffHours / 24);
  return `Last synced ${days} day${days === 1 ? "" : "s"} ago`;
}
