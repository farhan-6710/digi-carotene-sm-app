import { getTeamMemberInitials } from "@/features/team-management/utils/teamMemberDisplayUtils";
import { cn } from "@/shared/lib/utils";
import type { MemberInitialsAvatarProps } from "@/shared/types/components";

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
} as const;

export function MemberInitialsAvatar({
  name,
  size = "sm",
  className,
}: MemberInitialsAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      {getTeamMemberInitials(name)}
    </span>
  );
}
