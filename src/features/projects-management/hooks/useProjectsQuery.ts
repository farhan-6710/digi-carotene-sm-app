import { useCallback, useEffect, useState } from "react";

import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchProjects } from "@/features/projects-management/utils/projectsRepository";

export function useProjectsQuery() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setProjects([]);
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { projects, isLoading, error, setError, reload };
}
