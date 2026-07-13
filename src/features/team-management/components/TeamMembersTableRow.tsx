import type { ReactNode } from "react";
import { Link } from "react-router";
import { Pencil } from "lucide-react";

import { buildTeamMemberDetailPath } from "@/features/team-management/constants/routes";
import { TEAM_DIRECTORY_ROW_GRID_CLASS } from "@/features/team-management/constants/teamDirectory";
import {
  TEAM_MEMBER_ROLE_BADGE_CLASS,
  TEAM_MEMBER_ROLE_LABELS,
} from "@/features/team-management/constants/teamMemberRoles";
import type { TeamMembersTableRowProps } from "@/features/team-management/types/components";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
      {children}
    </span>
  );
}

export function TeamMembersTableRow({
  member,
  canEdit,
  onEditMember,
}: TeamMembersTableRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
        TEAM_DIRECTORY_ROW_GRID_CLASS,
      )}
    >
      <div className="text-sm font-medium text-foreground">
        <MobileLabel>NAME</MobileLabel>
        <Link
          to={buildTeamMemberDetailPath(member.id)}
          className="text-primary hover:underline"
        >
          {member.member_name}
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>EMAIL</MobileLabel>
        <a
          href={`mailto:${member.email}`}
          className="text-primary hover:underline"
        >
          {member.email}
        </a>
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>MOBILE NUMBER</MobileLabel>
        {member.mobile_number || (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>TEAM MEMBER ROLE</MobileLabel>
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
            TEAM_MEMBER_ROLE_BADGE_CLASS[member.team_role],
          )}
        >
          {TEAM_MEMBER_ROLE_LABELS[member.team_role]}
        </span>
      </div>

      <div className="flex justify-end gap-2 text-right">
        {canEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => onEditMember(member)}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
