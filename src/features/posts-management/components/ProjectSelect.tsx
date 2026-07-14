import { FolderKanban } from "lucide-react";
import { useCallback, useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ProjectSelectProps } from "@/features/posts-management/types/components";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { fetchProjectsScoped } from "@/services/projectsService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { mergeOptionsByValue } from "@/shared/utils/mergeOptionsByValue";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ProjectSelect({
  id,
  value,
  onChange,
  disabled = false,
  preload = false,
  selectedLabel,
}: ProjectSelectProps) {
  const { teamRole, teamMemberId } = useAuth();
  const loadProjects = useCallback(
    () => fetchProjectsScoped(teamRole, teamMemberId),
    [teamRole, teamMemberId],
  );

  const { items: projects, isLoading, handleOpenChange } = useLazyEntityList(
    loadProjects,
    { preload },
  );

  const options = useMemo(() => {
    const seedOptions =
      value && selectedLabel
        ? [
            {
              value,
              label: selectedLabel,
              icon: <FolderKanban className="size-3.5 opacity-70" />,
            },
          ]
        : [];

    const fetchedOptions = projects.map((project) => ({
      value: project.id,
      label: getProjectDisplayLabel(project),
      icon: <FolderKanban className="size-3.5 opacity-70" />,
    }));

    return mergeOptionsByValue(seedOptions, fetchedOptions);
  }, [projects, selectedLabel, value]);

  return (
    <ComboBox
      id={id}
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder="Select a project"
      listTitle="Select project"
      emptyMessage="No projects found. Create a project first."
      noMatchMessage="No matching projects found."
      mode="value"
      onOpenChange={handleOpenChange}
    />
  );
}
