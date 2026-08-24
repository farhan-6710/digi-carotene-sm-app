import { Link } from "react-router";

import { buildTeamMemberDetailPath } from "@/features/team-management/constants/routes";
import type { ProjectTeamMemberAvatarsProps } from "@/features/projects-management/types/components";
import { MemberInitialsAvatar } from "@/shared/components/MemberInitialsAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function ProjectTeamMemberAvatars({
  members,
}: ProjectTeamMemberAvatarsProps) {
  if (members.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {members.map((member) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <Link
                to={buildTeamMemberDetailPath(member.id)}
                className="inline-flex shrink-0 rounded-full"
                aria-label={member.member_name}
              >
                <MemberInitialsAvatar name={member.member_name} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">{member.member_name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
