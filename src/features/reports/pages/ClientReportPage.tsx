import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { buildDummyClientReport } from "@/features/reports/utils/clientReportUtils";
import { decodeClientReportId } from "@/features/reports/utils/reportsUtils";
import { buildReportsListPath } from "@/features/reports/utils/reportsUrlParams";
import { PageHeader } from "@/shared/components/PageHeader";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ClientReportPage() {
  const { clientId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const clientName = decodeClientReportId(clientId);
  const report = buildDummyClientReport(clientName);
  const backToReportsPath = buildReportsListPath(searchParams);

  return (
    <section className="space-y-8">
      <PageHeader
        heading={report.clientName}
        description={`Dummy overview for ${report.periodLabel}. Live analytics will replace this view in a later iteration.`}
        backButton={
          <Button asChild variant="outline" className="rounded-full">
            <Link to={backToReportsPath}>
              <ArrowLeft className="mr-2 size-4" />
              Back to reports
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total posts", value: report.totalPosts },
          { label: "Posted", value: report.postedCount },
          { label: "Scheduled", value: report.scheduledCount },
          { label: "Not posted", value: report.notPostedCount },
        ].map((item, idx) => (
          <div
            key={item.label}
            className={cn(
              "rounded-2xl border border-border bg-card p-6 shadow-sm",
              idx % 2 === 0
                ? "border-primary/40 bg-glow-bg-primary"
                : "border-accent/40 bg-glow-bg-accent",
            )}
          >
            <div className="text-xs font-semibold tracking-wider text-muted-foreground">
              {item.label.toUpperCase()}
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold">Highlights</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {report.highlights.map((highlight) => (
              <li key={highlight} className="leading-relaxed">
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-sm font-semibold">Recent scheduled posts</h2>
          </div>
          <div className="divide-y divide-border">
            {report.recentPosts.map((post) => (
              <div
                key={`${post.date}-${post.time}`}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <div className="text-sm font-medium">{post.date}</div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">
                    {post.time}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${statusText[post.status]}`}
                >
                  <span
                    className={`size-2 rounded-full ${statusColors[post.status]}`}
                  />
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
