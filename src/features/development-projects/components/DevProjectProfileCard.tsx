import { format } from "date-fns";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { buildClientDetailPath } from "@/features/clients-management/constants/routes";
import type { DevProjectProfileCardProps } from "@/features/development-projects/types/components";
import { ActiveStatusLabel } from "@/shared/components/ActiveStatusSwitchField";

function ExternalLink({ href, label }: { href: string | null; label: string }) {
  if (!href?.trim()) {
    return <span className="text-muted-foreground">—</span>;
  }

  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-primary hover:underline"
    >
      {label}
    </a>
  );
}

export function DevProjectProfileCard({
  project,
  hideClientLink = false,
}: DevProjectProfileCardProps) {
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
      label: "Tech stack",
      value: project.tech_stack?.trim() || "—",
    },
    {
      label: "Start date",
      value: project.start_date
        ? format(new Date(project.start_date), "MMM d, yyyy")
        : "—",
    },
    {
      label: "Target date",
      value: project.target_date
        ? format(new Date(project.target_date), "MMM d, yyyy")
        : "—",
    },
    {
      label: "Repo",
      value: <ExternalLink href={project.repo_url} label={project.repo_url ?? ""} />,
    },
    {
      label: "Staging",
      value: (
        <ExternalLink
          href={project.staging_url}
          label={project.staging_url ?? ""}
        />
      ),
    },
    {
      label: "Production",
      value: (
        <ExternalLink
          href={project.production_url}
          label={project.production_url ?? ""}
        />
      ),
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
