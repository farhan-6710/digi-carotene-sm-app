import { useMemo } from "react";

import type { ProjectTeamMembersSelectProps } from "@/features/projects-management/types/components";
import { fetchTeamMembers } from "@/features/team-management/utils/teamMembersRepository";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { MultiSelect } from "@/shared/ui/MultiSelect";

export function ProjectTeamMembersSelect({
  value = [],
  onChange,
  excludeMemberIds = [],
  disabled = false,
}: ProjectTeamMembersSelectProps) {
  const { items: members, isLoading, handleOpenChange } = useLazyEntityList(
    fetchTeamMembers,
  );

  const options = useMemo(
    () =>
      members.map((member) => ({
        value: member.id,
        label: member.member_name,
      })),
    [members],
  );

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      label="Team members"
      placeholder="Select team members"
      emptyMessage="No team members available."
      excludeValues={excludeMemberIds}
      fallbackSelectedLabel="Team member"
      onOpenChange={handleOpenChange}
    />
  );
}
