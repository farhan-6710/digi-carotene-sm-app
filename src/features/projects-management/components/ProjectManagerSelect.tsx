import { UserRound } from "lucide-react";
import { useMemo } from "react";

import type { ProjectManagerSelectProps } from "@/features/projects-management/types/components";
import { fetchProjectManagers } from "@/services/teamMembersService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { mergeOptionsByValue } from "@/shared/utils/mergeOptionsByValue";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ProjectManagerSelect({
  value,
  onChange,
  disabled = false,
  preload = false,
  seedManager = null,
}: ProjectManagerSelectProps) {
  const { items: members, isLoading, handleOpenChange } = useLazyEntityList(
    fetchProjectManagers,
    { preload },
  );

  const options = useMemo(() => {
    const seedOptions =
      seedManager && seedManager.id === value
        ? [
            {
              value: seedManager.id,
              label: seedManager.member_name,
              icon: <UserRound className="size-3.5 opacity-70" />,
            },
          ]
        : [];

    const fetchedOptions = members.map((member) => ({
      value: member.id,
      label: member.member_name,
      icon: <UserRound className="size-3.5 opacity-70" />,
    }));

    return mergeOptionsByValue(seedOptions, fetchedOptions);
  }, [members, seedManager, value]);

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder="Select manager"
      listTitle="Select manager or admin"
      emptyMessage="No managers or admins found. Add a team member with manager or admin role first."
      noMatchMessage="No matching managers or admins found."
      mode="value"
      onOpenChange={handleOpenChange}
    />
  );
}
