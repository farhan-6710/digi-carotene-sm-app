import { FolderKanban } from "lucide-react";
import { useMemo } from "react";

import { getProjectDisplayLabel } from "@/features/projects-management/utils/projectFormUtils";
import { fetchProjects } from "@/services/projectsService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { ComboBox } from "@/shared/ui/ComboBox";

type TaskProjectSelectProps = {
  value: string;
  onChange: (projectId: string) => void;
  disabled?: boolean;
  preload?: boolean;
};

export function TaskProjectSelect({
  value,
  onChange,
  disabled = false,
  preload = false,
}: TaskProjectSelectProps) {
  const { items: projects, isLoading, handleOpenChange } = useLazyEntityList(
    fetchProjects,
    { preload },
  );

  const options = useMemo(
    () =>
      projects
        .filter((project) => project.is_active)
        .map((project) => ({
          value: project.id,
          label: getProjectDisplayLabel(project),
          icon: <FolderKanban className="size-3.5 opacity-70" />,
        })),
    [projects],
  );

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder="Select project"
      listTitle="Select project"
      emptyMessage="No active projects found."
      noMatchMessage="No matching projects."
      mode="value"
      onOpenChange={handleOpenChange}
    />
  );
}
