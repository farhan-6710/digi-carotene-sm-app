import { UserRound } from "lucide-react";
import { useMemo } from "react";

import { fetchTeamMembers } from "@/services/teamMembersService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { ComboBox } from "@/shared/ui/ComboBox";
import { MultiSelect } from "@/shared/ui/MultiSelect";

type TaskAssigneeSelectProps = {
  value: string;
  onChange: (memberId: string) => void;
  disabled?: boolean;
  preload?: boolean;
};

export function TaskAssigneeSelect({
  value,
  onChange,
  disabled = false,
  preload = false,
}: TaskAssigneeSelectProps) {
  const { items: members, isLoading, handleOpenChange } = useLazyEntityList(
    fetchTeamMembers,
    { preload },
  );

  const options = useMemo(
    () =>
      members.map((member) => ({
        value: member.id,
        label: member.member_name,
        icon: <UserRound className="size-3.5 opacity-70" />,
      })),
    [members],
  );

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder="Assign to"
      listTitle="Assign to teammate"
      emptyMessage="No team members found."
      noMatchMessage="No matching team members."
      mode="value"
      onOpenChange={handleOpenChange}
    />
  );
}

type TaskTagsSelectProps = {
  value: string[];
  onChange: (memberIds: string[]) => void;
  excludeMemberIds?: string[];
  disabled?: boolean;
  preload?: boolean;
};

export function TaskTagsSelect({
  value,
  onChange,
  excludeMemberIds = [],
  disabled = false,
  preload = false,
}: TaskTagsSelectProps) {
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
      label="Tag teammates"
      placeholder="Tag teammates"
      emptyMessage="No team members available."
      excludeValues={excludeMemberIds}
      onOpenChange={handleOpenChange}
    />
  );
}
