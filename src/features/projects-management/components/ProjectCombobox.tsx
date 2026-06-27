import { FolderKanban } from "lucide-react";
import { useMemo } from "react";

import type { ProjectComboboxProps } from "@/features/projects-management/types/components";
import { fetchProjects } from "@/services/projectsService";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ProjectCombobox({
  value,
  onChange,
  disabled = false,
  activeProjectIds = [],
  placeholder = "Search projects...",
  preload = false,
}: ProjectComboboxProps) {
  const { items: projects, isLoading, handleOpenChange } = useLazyEntityList(
    fetchProjects,
    { preload },
  );

  const options = useMemo(
    () =>
      projects
        .filter((project) => !activeProjectIds.includes(project.id))
        .map((project) => ({
          value: project.id,
          label: getProjectDisplayLabel(project),
          icon: <FolderKanban className="size-3.5 opacity-70" />,
        })),
    [activeProjectIds, projects],
  );

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder={placeholder}
      listTitle="Select project"
      emptyMessage="No projects left to assign."
      noMatchMessage="No matching projects found."
      mode="value"
      onOpenChange={handleOpenChange}
    />
  );
}
