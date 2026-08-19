import { FolderKanban, User, X } from "lucide-react";
import { useMemo } from "react";

import type { ProjectListItem } from "@/features/projects-management/types/types";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { cn } from "@/shared/lib/utils";
import { ComboBox } from "@/shared/ui/ComboBox";

type ClientProjectFiltersProps = {
  projects: ProjectListItem[];
  selectedClientId: string;
  selectedProjectId: string;
  onClientChange: (clientId: string) => void;
  onProjectChange: (projectId: string) => void;
};

function SelectedFilterPill({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-7 items-center overflow-hidden rounded-full border text-[11px] font-medium",
        "border-primary bg-primary/10 text-primary",
      )}
    >
      <span className="inline-flex h-full items-center px-2.5">{label}</span>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-full cursor-pointer items-center border-l border-primary/20 px-2 transition hover:bg-primary/15"
        aria-label={`Clear ${label}`}
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

export function ClientProjectFilters({
  projects,
  selectedClientId,
  selectedProjectId,
  onClientChange,
  onProjectChange,
}: ClientProjectFiltersProps) {
  const projectsById = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects],
  );

  const selectedProject = selectedProjectId
    ? projectsById.get(selectedProjectId) ?? null
    : null;

  const allClients = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();

    for (const project of projects) {
      if (!project.clients) {
        continue;
      }

      map.set(project.client_id, {
        id: project.client_id,
        label: project.clients.client_name,
      });
    }

    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [projects]);

  const clientOptions = useMemo(() => {
    if (selectedProject?.clients) {
      return [
        {
          value: selectedProject.client_id,
          label: selectedProject.clients.client_name,
          icon: <User className="size-3.5 opacity-70" />,
        },
      ];
    }

    return allClients.map((client) => ({
      value: client.id,
      label: client.label,
      icon: <User className="size-3.5 opacity-70" />,
    }));
  }, [allClients, selectedProject]);

  const projectOptions = useMemo(() => {
    return projects
      .filter((project) =>
        selectedClientId ? project.client_id === selectedClientId : true,
      )
      .sort((a, b) => a.project_name.localeCompare(b.project_name))
      .map((project) => ({
        value: project.id,
        label: getProjectDisplayLabel(project),
        icon: <FolderKanban className="size-3.5 opacity-70" />,
      }));
  }, [projects, selectedClientId]);

  const selectedClientLabel =
    clientOptions.find((option) => option.value === selectedClientId)?.label ??
    allClients.find((client) => client.id === selectedClientId)?.label ??
    "";

  const selectedProjectLabel =
    projectOptions.find((option) => option.value === selectedProjectId)?.label ??
    (selectedProject ? getProjectDisplayLabel(selectedProject) : "");

  return (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="grid w-full gap-3 md:grid-cols-2 xl:max-w-3xl">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground">
            Client
          </label>
          <ComboBox
            value={selectedClientId}
            onChange={onClientChange}
            options={clientOptions}
            placeholder="Filter by client"
            listTitle="Select client"
            emptyMessage="No clients available."
            noMatchMessage="No matching clients found."
            mode="value"
          />
          {selectedClientId && selectedClientLabel ? (
            <SelectedFilterPill
              label={selectedClientLabel}
              onClear={() => onClientChange("")}
            />
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-muted-foreground">
            Project
          </label>
          <ComboBox
            value={selectedProjectId}
            onChange={onProjectChange}
            options={projectOptions}
            placeholder="Filter by project"
            listTitle="Select project"
            emptyMessage="No projects available."
            noMatchMessage="No matching projects found."
            mode="value"
          />
          {selectedProjectId && selectedProjectLabel ? (
            <SelectedFilterPill
              label={selectedProjectLabel}
              onClear={() => onProjectChange("")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
