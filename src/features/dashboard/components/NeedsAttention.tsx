import { Link } from "react-router";

import { needsAttentionItems } from "@/shared/fixtures/dashboardSamples";
import { needsAttentionStatusStyles } from "@/features/dashboard/constants/needsAttentionStyles";

export function NeedsAttention() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">Needs Attention</div>
        <Link
          to="/admin/posts-management"
          className="text-sm font-medium text-primary hover:underline"
        >
          View posts <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {needsAttentionItems.map((row) => {
          const styles = needsAttentionStatusStyles[row.status];

          return (
            <div
              key={`${row.time}-${row.from}`}
              className="flex items-start gap-3 rounded-xl border border-transparent px-2 py-1.5 transition hover:bg-muted/40"
            >
              <div
                className={[
                  "mt-2 size-2 shrink-0 rounded-full",
                  styles.dot,
                ].join(" ")}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-medium text-foreground">
                    {row.from}
                  </div>
                  <div
                    className={[
                      "shrink-0 text-[10px] font-semibold",
                      styles.text,
                    ].join(" ")}
                  >
                    {row.status}
                  </div>
                </div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                  Due: {row.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
