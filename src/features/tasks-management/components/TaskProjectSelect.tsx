import { FolderKanban } from "lucide-react";
import { useMemo } from "react";

import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import {
  encodeProjectKey,
  parseProjectKey,
} from "@/features/projects-management/utils/projectKindUtils";
import { fetchDevProjects } from "@/services/devProjectsService";
import { fetchProjects } from "@/services/projectsService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { ComboBox } from "@/shared/ui/ComboBox";

type TaskProjectSelectProps = {
  /** Encoded `sm:<id>` or `dev:<id>` key. */
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

    return [...smOptions, ...devOptions];
  }, [devProjects, smProjects]);

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

        const project = devProjects.find((row) => row.id === parsed.id);
        onChange({
          projectKey,
          clientId: project?.client_id ?? project?.clients?.id ?? null,
        });
      }}
      options={options}
      isLoading={smLoading || devLoading}
      disabled={disabled}
      placeholder="Select project"
      listTitle="Select project"
      emptyMessage="No active projects found."
      noMatchMessage="No matching projects."
      mode="value"
      onOpenChange={(nextOpen) => {
        onSmOpen(nextOpen);
        onDevOpen(nextOpen);
      }}
    />
  );
}
