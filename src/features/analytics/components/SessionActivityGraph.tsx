import { weekdayLabels } from "@/features/analytics/constants/sessionActivity";
import {
  CONTRIBUTION_YEAR,
  contributionMonthLabels,
  contributionWeeks,
} from "@/shared/fixtures/sessionActivityMock";
import {
  formatPostActivityDate,
  postActivityLevelClasses,
} from "@/features/analytics/utils/postActivityLevels";
import type { DayContribution } from "@/features/analytics/types/types";
import { SessionActivityLegend } from "./SessionActivityLegend";

const CELL_SIZE = "size-[11px] shrink-0";

function ActivityCell({ day }: { day: DayContribution | null }) {
  if (!day) {
    return <span className={`${CELL_SIZE} rounded-sm bg-transparent`} />;
  }

  const levelClass = postActivityLevelClasses[day.level];
  const tooltip = day.isFuture
    ? `${formatPostActivityDate(day.date)} · Upcoming`
    : `${formatPostActivityDate(day.date)} · ${day.completedCount} post${
        day.completedCount === 1 ? "" : "s"
      } published`;

  return (
    <span
      title={tooltip}
      aria-label={tooltip}
      className={`${CELL_SIZE} block rounded-sm ${levelClass} transition-opacity hover:opacity-80`}
    />
  );
}

export function SessionActivityGraph() {
  const weekCount = contributionWeeks.length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {CONTRIBUTION_YEAR} posts &amp; content activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each square is one day. Darker greens mean more posts published.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Based on daily post completions
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-max flex-col gap-2">
          <div
            className="grid w-max gap-1"
            style={{
              gridTemplateColumns: `2rem repeat(${weekCount}, 11px)`,
            }}
          >
            <div aria-hidden="true" />

            {contributionMonthLabels.map((month) => (
              <div
                key={month.label}
                className="flex items-end justify-center text-[11px] leading-none text-muted-foreground"
                style={{
                  gridColumn: `${month.startColumn + 2} / ${month.endColumn + 3}`,
                  gridRow: 1,
                }}
              >
                {month.label}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <div className="flex w-8 shrink-0 flex-col gap-1 text-[11px] leading-none text-muted-foreground">
              {weekdayLabels.map((label, index) => (
                <span
                  key={label}
                  className={`${CELL_SIZE} flex items-center ${
                    index % 2 === 0 ? "invisible" : ""
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            {contributionWeeks.map((week) => (
              <div key={week.index} className="flex flex-col gap-1">
                {week.days.map((day, dayIndex) => (
                  <ActivityCell
                    key={`${week.index}-${dayIndex}-${day?.date ?? "empty"}`}
                    day={day}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <SessionActivityLegend />
      </div>
    </div>
  );
}
