import { useMemo } from "react";

import type { ProjectMultiSelectProps } from "@/features/projects-management/types/components";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { encodeProjectKey } from "@/features/projects-management/utils/projectKindUtils";
import { fetchDevProjects } from "@/services/devProjectsService";
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
  const {
    items: smProjects,
    isLoading: smLoading,
    handleOpenChange: onSmOpen,
  } = useLazyEntityList(fetchProjects, { preload });
  const {
    items: devProjects,
    isLoading: devLoading,
    handleOpenChange: onDevOpen,
  } = useLazyEntityList(fetchDevProjects, { preload });

  const options = useMemo(() => {
    const smOptions = smProjects
      .filter((project) => project.is_active)
      .map((project) => ({
        value: encodeProjectKey("sm", project.id),
        label: getProjectDisplayLabel(project),
        group: "Social media projects",
      }));

    const devOptions = devProjects
      .filter((project) => project.is_active)
      .map((project) => ({
        value: encodeProjectKey("dev", project.id),
        label: `${project.project_name}${
          project.clients?.client_name
            ? ` (${project.clients.client_name})`
            : ""
        }`,
        group: "Development projects",
      }));

    return [...smOptions, ...devOptions];
  }, [devProjects, smProjects]);

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={smLoading || devLoading}
      disabled={disabled}
      placeholder={placeholder}
      emptyMessage="No projects left to assign."
      excludeValues={excludeProjectIds}
      onOpenChange={(nextOpen) => {
        onSmOpen(nextOpen);
        onDevOpen(nextOpen);
      }}
    />
  );
}
