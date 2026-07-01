import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { GrowthDateRange } from "@/features/growth-and-analytics/types/types";

export type DailyFollowerRow = {
  date: string;
  gained: number;
};

type DbRow = {
  date: string;
  followers_gained: number;
};

function applyDateRange<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  range: GrowthDateRange,
): T {
  let next = query;
  if (range.from) {
    next = next.gte("date", range.from);
  }
  if (range.to) {
    next = next.lte("date", range.to);
  }
  return next as T;
}

function mapRow(row: DbRow): DailyFollowerRow {
  return {
    date: row.date,
    gained: row.followers_gained,
  };
}

export async function fetchDailyFollowersForProfile(
  profileId: string,
  range: GrowthDateRange = {},
): Promise<DailyFollowerRow[]> {
  const base = supabase
    .from(DB.INSTAGRAM_DAILY_FOLLOWERS.TABLE)
    .select(DB.INSTAGRAM_DAILY_FOLLOWERS.SELECT)
    .eq("account_id", profileId)
    .order("date", { ascending: true });

  const { data, error } = await applyDateRange<typeof base>(base, range);
  if (error) throw new Error(error.message);
  return ((data ?? []) as DbRow[]).map(mapRow);
}

export function sumFollowersGained(rows: DailyFollowerRow[]): number {
  return rows.reduce((sum, row) => sum + row.gained, 0);
}

export async function replaceDailyFollowersForProfile(
  profileId: string,
  rows: DailyFollowerRow[],
  fromDate: string,
  toDate: string,
): Promise<void> {
  const { error: deleteError } = await supabase
    .from(DB.INSTAGRAM_DAILY_FOLLOWERS.TABLE)
    .delete()
    .eq("account_id", profileId)
    .gte("date", fromDate)
    .lte("date", toDate);

  if (deleteError) throw new Error(deleteError.message);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase
    .from(DB.INSTAGRAM_DAILY_FOLLOWERS.TABLE)
    .insert(
      rows.map((row) => ({
        account_id: profileId,
        date: row.date,
        followers_gained: row.gained,
      })),
    );

  if (insertError) throw new Error(insertError.message);
}

export async function upsertDailyFollower(
  profileId: string,
  date: string,
  gained: number,
): Promise<void> {
  const { error } = await supabase.from(DB.INSTAGRAM_DAILY_FOLLOWERS.TABLE).upsert(
    {
      account_id: profileId,
      date,
      followers_gained: gained,
    },
    { onConflict: "account_id,date" },
  );

  if (error) throw new Error(error.message);
}
