import { format } from "date-fns";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { buildClientDetailPath } from "@/features/clients-management/constants/routes";
import type { OtherProjectProfileCardProps } from "@/features/other-projects/types/components";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";

export function OtherProjectProfileCard({
  project,
  hideClientLink = false,
}: OtherProjectProfileCardProps) {
  const clientName = project.clients?.client_name ?? "—";

  const details: Array<{ label: string; value: ReactNode }> = [
    {
      label: "Client",
      value:
        !hideClientLink && project.client_id ? (
          <Link
            to={buildClientDetailPath(project.client_id)}
            className="text-primary hover:underline"
          >
            {clientName}
          </Link>
        ) : (
          clientName
        ),
    },
    {
      label: "Manager",
      value: project.team_members?.member_name ?? "—",
    },
    {
      label: "Status",
      value: <ActiveStatusLabel isActive={project.is_active} />,
    },
    {
      label: "Start date",
      value: project.start_date
        ? format(new Date(project.start_date), "MMM d, yyyy")
        : "—",
    },
    {
      label: "ETA",
      value: project.eta_date
        ? format(new Date(project.eta_date), "MMM d, yyyy")
        : "—",
    },
    {
      label: "Created",
      value: format(new Date(project.created_at), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Project profile
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          {project.project_name}
        </h2>
        {project.description?.trim() ? (
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {project.description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-0 sm:grid-cols-2">
        {details.map((item) => (
          <div
            key={item.label}
            className="border-b border-border px-6 py-4 last:border-b-0 sm:odd:border-r"
          >
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {item.label}
            </p>
            <div className="mt-1 text-sm text-foreground">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
