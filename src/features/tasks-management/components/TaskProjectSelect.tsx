import { FolderKanban } from "lucide-react";
import { useMemo } from "react";

import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import {
  encodeProjectKey,
  parseProjectKey,
} from "@/features/projects-management/utils/projectKindUtils";
import { fetchDevProjects } from "@/services/devProjectsService";
import { fetchOtherProjects } from "@/services/otherProjectsService";
import { fetchProjects } from "@/services/projectsService";
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
  const {
    items: otherProjects,
    isLoading: otherLoading,
    handleOpenChange: onOtherOpen,
  } = useLazyEntityList(fetchOtherProjects, { preload });

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
