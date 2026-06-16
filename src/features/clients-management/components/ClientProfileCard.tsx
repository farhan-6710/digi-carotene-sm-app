import { format } from "date-fns";

import type { ClientProfileCardProps } from "@/features/clients-management/types/components";

export function ClientProfileCard({ client }: ClientProfileCardProps) {
  const website = client.website_name?.trim();
  const details = [
    {
      label: "Mobile",
      value: client.mobile_number || "—",
    },
    {
      label: "Website",
      value: website ? (
        <a
          href={website.startsWith("http") ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {website}
        </a>
      ) : (
        "—"
      ),
    },
    {
      label: "Joined",
      value: format(new Date(client.created_at), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Client profile
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          {client.client_name}
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
