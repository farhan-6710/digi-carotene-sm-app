import { useMemo } from "react";

import type { ProjectTeamMembersSelectProps } from "@/features/projects-management/types/components";
import { fetchTeamMembers } from "@/services/teamMembersService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { MultiSelect } from "@/shared/ui/MultiSelect";

export function ProjectTeamMembersSelect({
  value = [],
  onChange,
  excludeMemberIds = [],
  disabled = false,
  preload = false,
}: ProjectTeamMembersSelectProps) {
  const { items: members, isLoading, handleOpenChange } = useLazyEntityList(
    fetchTeamMembers,
    { preload },
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
      onOpenChange={handleOpenChange}
    />
  );
}
