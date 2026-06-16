import { UserRound } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { TeamMemberComboboxProps } from "@/features/team-management/types/components";
import { fetchTeamMembers } from "@/features/team-management/utils/teamMembersRepository";
import { ComboBox } from "@/shared/ui/ComboBox";

export function TeamMemberCombobox({
  value,
  onChange,
  disabled = false,
  activeMemberIds = [],
  placeholder = "Search by name...",
  preload = false,
}: TeamMemberComboboxProps) {
  const [members, setMembers] = useState<
    Awaited<ReturnType<typeof fetchTeamMembers>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadMembers = useCallback(() => {
    setIsLoading(true);
    fetchTeamMembers()
      .then((data) => {
        setMembers(data);
        hasLoadedRef.current = true;
      })
      .catch(() => setMembers([]))
      .finally(() => setIsLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (!preload) {
      hasLoadedRef.current = false;
      return;
    }

    if (!hasLoadedRef.current) {
      loadMembers();
    }
  }, [loadMembers, preload]);

  const options = useMemo(
    () =>
      members
        .filter((member) => !activeMemberIds.includes(member.id))
        .map((member) => ({
          value: member.id,
          label: member.member_name,
          icon: <UserRound className="size-3.5 opacity-70" />,
        })),
    [activeMemberIds, members],
  );

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder={placeholder}
      listTitle="Select"
      emptyMessage="No one available to assign."
      noMatchMessage="No matches found."
      mode="value"
      onOpenChange={(open) => {
        if (open && !hasLoadedRef.current) {
          loadMembers();
        }
      }}
    />
  );
}
