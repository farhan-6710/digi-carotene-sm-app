import { FolderKanban } from "lucide-react";
import { useCallback, useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import {
  encodeProjectKey,
  parseProjectKey,
} from "@/features/projects-management/utils/projectKindUtils";
import { fetchDevProjectsScoped } from "@/services/devProjectsService";
import { fetchOtherProjectsScoped } from "@/services/otherProjectsService";
import { fetchProjectsScoped } from "@/services/projectsService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { ComboBox } from "@/shared/ui/ComboBox";

type TaskProjectSelectProps = {
  /** Encoded `sm:<id>`, `dev:<id>`, or `other:<id>` key. */
  value: string;
  onChange: (next: {
    projectKey: string;
    clientId: string | null;
  }) => void;
  disabled?: boolean;
  preload?: boolean;
};

export function TaskProjectSelect({
  value,
  onChange,
  disabled = false,
  preload = false,
}: TaskProjectSelectProps) {
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
        icon: <FolderKanban className="size-3.5 opacity-70" />,
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
        icon: <FolderKanban className="size-3.5 opacity-70" />,
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
        icon: <FolderKanban className="size-3.5 opacity-70" />,
      }));

    return [...smOptions, ...devOptions, ...otherOptions];
  }, [devProjects, otherProjects, smProjects]);

  return (
    <ComboBox
      value={value}
      onChange={(projectKey) => {
        const parsed = parseProjectKey(projectKey);
        if (!parsed) {
          onChange({ projectKey: "", clientId: null });
          return;
        }

        if (parsed.kind === "sm") {
          const project = smProjects.find((row) => row.id === parsed.id);
          onChange({
            projectKey,
            clientId: project?.client_id ?? project?.clients?.id ?? null,
          });
          return;
        }

        if (parsed.kind === "dev") {
          const project = devProjects.find((row) => row.id === parsed.id);
          onChange({
            projectKey,
            clientId: project?.client_id ?? project?.clients?.id ?? null,
          });
          return;
        }

        const project = otherProjects.find((row) => row.id === parsed.id);
        onChange({
          projectKey,
          clientId: project?.client_id ?? project?.clients?.id ?? null,
        });
      }}
      options={options}
      isLoading={smLoading || devLoading || otherLoading}
      disabled={disabled}
      placeholder="Select a project"
      listTitle="Select a project"
      emptyMessage="No active projects found."
      noMatchMessage="No matching projects."
      mode="value"
      onOpenChange={(nextOpen) => {
        onSmOpen(nextOpen);
        onDevOpen(nextOpen);
        onOtherOpen(nextOpen);
      }}
    />
  );
}
