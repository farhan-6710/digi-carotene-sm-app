import { format } from "date-fns";
import { Link } from "react-router";

import { buildClientDetailPath } from "@/features/clients-management/constants/routes";
import { projectProfileStatItems } from "@/features/projects-management/constants/projectProfileStats";
import { ProjectTeamMemberAvatars } from "@/features/projects-management/components/ProjectTeamMemberAvatars";
import type { ProjectProfileCardProps } from "@/features/projects-management/types/components";
import { cn } from "@/shared/lib/utils";
import { SocialPlatformButtons } from "@/shared/components/SocialPlatformButtons";

export function ProjectProfileCard({
  project,
  postStats,
  teamMembers,
}: ProjectProfileCardProps) {
  const clientName = project.clients?.client_name ?? "—";

  const details = [
    {
      label: "Client",
      value: project.client_id ? (
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
      label: "Team members",
      value: <ProjectTeamMemberAvatars members={teamMembers} />,
    },
    {
      label: "Socials",
      value: <SocialPlatformButtons socials={project.socials} />,
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
      </div>

      <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
        {projectProfileStatItems.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "px-6 py-4",
              index < projectProfileStatItems.length - 1 &&
                "sm:border-r sm:border-border",
              index % 2 === 0 && "border-r border-border sm:border-r",
              index < 2 && "border-b border-border sm:border-b-0",
            )}
          >
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tracking-tight",
                item.valueClassName,
              )}
            >
              {item.getValue(postStats)}
            </p>
          </div>
        ))}
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
