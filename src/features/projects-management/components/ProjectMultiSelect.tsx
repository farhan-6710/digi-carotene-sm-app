import { useCallback, useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ProjectMultiSelectProps } from "@/features/projects-management/types/components";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { encodeProjectKey } from "@/features/projects-management/utils/projectKindUtils";
import { fetchDevProjectsScoped } from "@/services/devProjectsService";
import { fetchOtherProjectsScoped } from "@/services/otherProjectsService";
import { fetchProjectsScoped } from "@/services/projectsService";
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
  const { teamRole, teamMemberId } = useAuth();

  const loadSm = useCallback(
    () => fetchProjectsScoped(teamRole, teamMemberId),
    [teamMemberId, teamRole],
  );
  const loadDev = useCallback(
    () => fetchDevProjectsScoped(teamRole, teamMemberId),
    [teamMemberId, teamRole],
  );
  const loadOther = useCallback(
    () => fetchOtherProjectsScoped(teamRole, teamMemberId),
    [teamMemberId, teamRole],
  );

  const {
    items: smProjects,
    isLoading: smLoading,
    handleOpenChange: onSmOpen,
  } = useLazyEntityList(loadSm, { preload });
  const {
    items: devProjects,
    isLoading: devLoading,
    handleOpenChange: onDevOpen,
  } = useLazyEntityList(loadDev, { preload });
  const {
    items: otherProjects,
    isLoading: otherLoading,
    handleOpenChange: onOtherOpen,
  } = useLazyEntityList(loadOther, { preload });

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

    const otherOptions = otherProjects
      .filter((project) => project.is_active)
      .map((project) => ({
        value: encodeProjectKey("other", project.id),
        label: `${project.project_name}${
          project.clients?.client_name
            ? ` (${project.clients.client_name})`
            : ""
        }`,
        group: "Other projects",
      }));

    return [...smOptions, ...devOptions, ...otherOptions];
  }, [devProjects, otherProjects, smProjects]);

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={smLoading || devLoading || otherLoading}
      disabled={disabled}
      placeholder={placeholder}
      emptyMessage="No projects left to assign."
      excludeValues={excludeProjectIds}
      onOpenChange={(nextOpen) => {
        onSmOpen(nextOpen);
        onDevOpen(nextOpen);
        onOtherOpen(nextOpen);
      }}
    />
  );
}
