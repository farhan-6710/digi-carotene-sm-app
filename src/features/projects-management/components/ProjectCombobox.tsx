import { FolderKanban } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { ProjectComboboxProps } from "@/features/projects-management/types/components";
import { fetchProjects } from "@/features/projects-management/utils/projectsRepository";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ProjectCombobox({
  value,
  onChange,
  disabled = false,
  activeProjectIds = [],
  placeholder = "Search projects...",
  preload = false,
}: ProjectComboboxProps) {
  const [projects, setProjects] = useState<
    Awaited<ReturnType<typeof fetchProjects>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadProjects = useCallback(() => {
    setIsLoading(true);
    fetchProjects()
      .then((data) => {
        setProjects(data);
        hasLoadedRef.current = true;
      })
      .catch(() => setProjects([]))
      .finally(() => setIsLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (!preload) {
      hasLoadedRef.current = false;
      return;
    }

    if (!hasLoadedRef.current) {
      loadProjects();
    }
  }, [loadProjects, preload]);

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
      onOpenChange={(open) => {
        if (open && !hasLoadedRef.current) {
          loadProjects();
        }
      }}
    />
  );
}
