import { format } from "date-fns";

import { LEAD_SOURCE_LABELS } from "@/features/crm/constants/leadSources";
import { LEAD_STATUS_LABELS } from "@/features/crm/constants/leadStatuses";
import type { LeadProfileCardProps } from "@/features/crm/types/components";

export function LeadProfileCard({ lead }: LeadProfileCardProps) {
  const details = [
    { label: "Company", value: lead.company || "—" },
    { label: "Email", value: lead.email || "—" },
    { label: "Phone", value: lead.phone || "—" },
    { label: "Industry", value: lead.industry || "—" },
    { label: "Score", value: String(lead.lead_score) },
    { label: "Status", value: LEAD_STATUS_LABELS[lead.status] },
    { label: "Source", value: LEAD_SOURCE_LABELS[lead.lead_source] },
    {
      label: "Created",
      value: format(new Date(lead.created_at), "MMM d, yyyy"),
    },
    {
      label: "Updated",
      value: format(new Date(lead.updated_at), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Lead profile
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          {lead.name}
        </h2>
      </div>

      <div className="divide-y divide-border">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex flex-wrap items-center justify-between gap-2 px-6 py-3"
          >
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {detail.label.toUpperCase()}
            </span>
            <span className="text-sm text-foreground">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
