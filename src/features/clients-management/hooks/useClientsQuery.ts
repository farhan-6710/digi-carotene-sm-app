import { useCallback, useEffect, useState } from "react";

import type { Client } from "@/features/clients-management/types/types";
import { fetchClients } from "@/services/clientsService";

export function useClientsQuery() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setClients(await fetchClients());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { clients, isLoading, error, setError, reload };
}
