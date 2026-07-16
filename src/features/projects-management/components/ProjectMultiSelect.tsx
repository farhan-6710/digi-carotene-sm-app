import { FolderKanban } from "lucide-react";
import { useMemo } from "react";

import type { ProjectMultiSelectProps } from "@/features/projects-management/types/components";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { fetchProjects } from "@/services/projectsService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { MultiSelect } from "@/shared/ui/MultiSelect";

export function ProjectMultiSelect({
  value,
  onChange,
  disabled = false,
  excludeProjectIds = [],
  placeholder = "Select projects",
  preload = false,
}: ProjectMultiSelectProps) {
  const { items: projects, isLoading, handleOpenChange } = useLazyEntityList(
    fetchProjects,
    { preload },
  );

  const options = useMemo(
    () =>
      projects.map((project) => ({
        value: project.id,
        label: getProjectDisplayLabel(project),
        icon: <FolderKanban className="size-3.5 opacity-70" />,
      })),
    [projects],
  );

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder={placeholder}
      emptyMessage="No projects left to assign."
      excludeValues={excludeProjectIds}
      onOpenChange={handleOpenChange}
    />
  );
}
