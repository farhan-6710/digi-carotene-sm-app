import { Link } from "react-router";

import { buildTeamMemberDetailPath } from "@/features/team-management/constants/routes";
import type { ProjectTeamMemberAvatarsProps } from "@/features/projects-management/types/components";
import { MemberInitialsAvatar } from "@/shared/components/MemberInitialsAvatar";
import { cn } from "@/shared/lib/utils";
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
      <div className="flex items-center">
        {members.map((member, index) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <Link
                to={buildTeamMemberDetailPath(member.id)}
                className={cn(
                  "relative rounded-full ring-2 ring-card transition hover:z-10 hover:scale-105",
                  index > 0 && "-ml-2",
                )}
                style={{ zIndex: members.length - index }}
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
