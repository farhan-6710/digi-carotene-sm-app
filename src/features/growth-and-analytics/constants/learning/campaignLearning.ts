/** Campaign Learning Tab — static config (PDF §6–7). */

export const LEARNING_MIN_HISTORY_DAYS = 21;
export const LEARNING_STALE_SYNC_HOURS = 24;
export const LEARNING_NEW_BEST_GAP = 0.05;
export const LEARNING_NEW_BEST_DAYS = 7;
export const LEARNING_NEW_BEST_DISMISS_DAYS = 14;

export const BENCHMARK_WINDOW_DAYS = [7, 14] as const;
export const BENCHMARK_LOOKBACK_DAYS = [30, 60, 90, 180] as const;
export const BENCHMARK_DEFAULT_WINDOW_DAYS = 7;
export const BENCHMARK_DEFAULT_LOOKBACK_DAYS = 90;
export const BENCHMARK_DEFAULT_MIN_RESULTS = 10;
export const BENCHMARK_DEFAULT_METHOD = "top3" as const;

/** One real day is enough. Short ad sets and ads still get a default. */
export const IDEAL_BENCHMARK_MIN_DAYS = 1;
/** Share of days in the tightest cluster ("where the chart sits"). */
export const IDEAL_BENCHMARK_DENSE_SHARE = 0.5;
/** Nudge that cluster slightly toward a better result. */
export const IDEAL_BENCHMARK_NUDGE = 0.08;

/** Gap status thresholds (PDF §7.5). */
export const GAP_ON_TRACK_MIN = -0.1;
export const GAP_BELOW_MIN = -0.25;

export const BENCHMARK_MODES = ["auto", "manual", "client_target"] as const;
export const BENCHMARK_METHODS = ["top3", "best", "p80"] as const;
export const BENCHMARK_STATUSES = [
  "active",
  "pending",
  "suggested",
  "superseded",
  "rejected",
] as const;

export const LEARNING_MODES = ["collecting", "tracking"] as const;

export const GAP_STATUSES = [
  "on_track",
  "below",
  "off_track",
  "not_enough_data",
] as const;

/** Spec default: executives need team-lead/admin approval. */
export const EXECUTIVE_BENCHMARK_NEEDS_APPROVAL = true;

export const CAMPAIGN_DETAIL_TABS = ["overview", "learning"] as const;
