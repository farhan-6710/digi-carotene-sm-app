import { Link } from "react-router";
import { Loader2 } from "lucide-react";

import type { PostsTopClientsTableProps } from "@/features/analytics/types/components";

export function PostsTopClientsTable({
  clients,
  isLoading = false,
}: PostsTopClientsTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="text-sm font-semibold text-foreground">
          Clients With Most Posts
        </div>
        <Link
          to="/admin/posts-management"
          className="text-sm font-medium text-primary hover:underline"
        >
          View posts <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div>
        <div className="grid grid-cols-[1.4fr_0.6fr_0.7fr_0.6fr] gap-4 bg-muted/50 px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground">
          <div>CLIENT</div>
          <div className="text-right">POSTS</div>
          <div className="text-right">SCHEDULED</div>
          <div className="text-right">MISSED</div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center border-t border-border">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : clients.length === 0 ? (
          <div className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
            No posts scheduled this month yet.
          </div>
        ) : (
          <div className="divide-y divide-border border-t">
            {clients.map((client, index) => (
              <div
                key={client.name}
                className={[
                  "grid grid-cols-[1.4fr_0.6fr_0.7fr_0.6fr] items-center gap-4 px-6 py-3.5",
                  index === 0 ? "bg-primary/5" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span
                    className={[
                      "inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold shadow-2xs",
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {index + 1}
                  </span>
                  {client.name}
                </div>
                <div
                  className={[
                    "text-right font-mono text-sm",
                    index === 0 ? "font-semibold text-primary" : "text-foreground",
                  ].join(" ")}
                >
                  {client.posts}
                </div>
                <div className="text-right font-mono text-sm text-status-scheduled">
                  {client.scheduled}
                </div>
                <div className="text-right font-mono text-sm text-status-missed">
                  {client.missed}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
