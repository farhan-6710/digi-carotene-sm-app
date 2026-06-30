import { useMemo } from "react";

import type { ProjectTeamMembersSelectProps } from "@/features/projects-management/types/components";
import { fetchTeamMembers } from "@/services/teamMembersService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { mergeOptionsByValue } from "@/shared/utils/mergeOptionsByValue";
import { MultiSelect } from "@/shared/ui/MultiSelect";

export function ProjectTeamMembersSelect({
  value = [],
  onChange,
  excludeMemberIds = [],
  disabled = false,
  preload = false,
  seedMembers = [],
}: ProjectTeamMembersSelectProps) {
  const { items: members, isLoading, handleOpenChange } = useLazyEntityList(
    fetchTeamMembers,
    { preload },
  );

  const options = useMemo(() => {
    const seedOptions = seedMembers
      .filter((member) => value.includes(member.id))
      .map((member) => ({
        value: member.id,
        label: member.member_name,
      }));

    const fetchedOptions = members.map((member) => ({
      value: member.id,
      label: member.member_name,
    }));

    return mergeOptionsByValue(seedOptions, fetchedOptions);
  }, [members, seedMembers, value]);

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
