import { FolderKanban } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { fetchProjects } from "@/features/projects-management/utils/projectsRepository";
import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import type { ProjectSelectProps } from "@/features/posts-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ProjectSelect({
  id,
  value,
  onChange,
  disabled = false,
}: ProjectSelectProps) {
  const [projects, setProjects] = useState<
    Awaited<ReturnType<typeof fetchProjects>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = useCallback(() => {
    setIsLoading(true);
    fetchProjects()
      .then(setProjects)
      .catch((err) => {
        console.error("Failed to load projects in select:", err);
        setProjects([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

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
    <ComboBox
      id={id}
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder="Select a project"
      listTitle="Select project"
      emptyMessage="No projects found. Create a project first."
      noMatchMessage="No matching projects found."
      mode="value"
      onOpenChange={(open) => {
        if (open) {
          loadProjects();
        }
      }}
    />
  );
}
