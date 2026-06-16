import { useCallback, useEffect, useState } from "react";

import type { Client } from "@/features/clients-management/types/types";
import { fetchClientById } from "@/features/clients-management/utils/clientsRepository";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchProjectsByClientId } from "@/features/projects-management/utils/projectsRepository";

export function useClientDetailQuery(clientId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!clientId) {
      setClient(null);
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [clientRow, projectRows] = await Promise.all([
        fetchClientById(clientId),
        fetchProjectsByClientId(clientId),
      ]);

      setClient(clientRow);
      setProjects(projectRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load client.");
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    client,
    projects,
    isLoading,
    error,
    setError,
    reload,
  };
}
