import { useMemo } from "react";

import type { ProjectListItem } from "@/features/projects-management/types/types";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { MultiSelect } from "@/shared/ui/MultiSelect";

type ClientProjectFiltersProps = {
  projects: ProjectListItem[];
  selectedClientIds: string[];
  selectedProjectIds: string[];
  onClientChange: (clientIds: string[]) => void;
  onProjectChange: (projectIds: string[]) => void;
};

export function ClientProjectFilters({
  projects,
  selectedClientIds,
  selectedProjectIds,
  onClientChange,
  onProjectChange,
}: ClientProjectFiltersProps) {
  const clientOptions = useMemo(() => {
    const map = new Map<string, string>();

    for (const project of projects) {
      if (project.clients) {
        map.set(project.client_id, project.clients.client_name);
      }
    }

    return [...map.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ value: id, label: name }));
  }, [projects]);

  const projectOptions = useMemo(() => {
    const filtered =
      selectedClientIds.length > 0
        ? projects.filter((p) => selectedClientIds.includes(p.client_id))
        : projects;

    return filtered
      .sort((a, b) => a.project_name.localeCompare(b.project_name))
      .map((project) => ({
        value: project.id,
        label: getProjectDisplayLabel(project),
      }));
  }, [projects, selectedClientIds]);

  return (
    <div className="grid w-full gap-3 md:grid-cols-2 xl:max-w-3xl">
      <MultiSelect
        value={selectedClientIds}
        onChange={onClientChange}
        options={clientOptions}
        label="Client"
        placeholder="All clients"
        emptyMessage="No clients available."
      />
      <MultiSelect
        value={selectedProjectIds}
        onChange={onProjectChange}
        options={projectOptions}
        label="Project"
        placeholder="All projects"
        emptyMessage="No projects available."
      />
    </div>
  );
}
