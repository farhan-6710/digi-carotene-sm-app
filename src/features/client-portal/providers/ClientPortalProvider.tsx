import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Client } from "@/features/clients-management/types/types";
import type { DevProjectListItem } from "@/features/development-projects/types/types";
import { fetchClientById } from "@/services/clientsService";
import {
  ClientPortalContext,
  type ClientPortalContextValue,
} from "@/features/client-portal/providers/clientPortalContext";
import type { Post } from "@/features/posts-management/types/types";
import type { ProductionPlan } from "@/features/production-planner/types/types";
import { fetchPostsForClientId } from "@/services/postsService";
import { fetchProductionPlansByClientId } from "@/services/productionPlansService";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchDevProjectsByClientId } from "@/services/devProjectsService";
import { fetchProjectsByClientId } from "@/services/projectsService";

export function ClientPortalProvider({ children }: { children: ReactNode }) {
  const { clientId } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [devProjects, setDevProjects] = useState<DevProjectListItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!clientId) {
      setClient(null);
      setProjects([]);
      setDevProjects([]);
      setPosts([]);
      setProductionPlans([]);
      setLoading(false);
      setError("No client linked to your account.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clientRow = await fetchClientById(clientId);
      if (!clientRow) {
        setClient(null);
        setProjects([]);
        setDevProjects([]);
        setPosts([]);
        setProductionPlans([]);
        setError("Your client record could not be found.");
        return;
      }

      const [projectRows, devProjectRows, clientPosts, planRows] =
        await Promise.all([
          fetchProjectsByClientId(clientId),
          fetchDevProjectsByClientId(clientId),
          fetchPostsForClientId(clientId),
          fetchProductionPlansByClientId(clientId),
        ]);

      setClient(clientRow);
      setProjects(projectRows);
      setDevProjects(devProjectRows);
      setPosts(clientPosts);
      setProductionPlans(planRows);
    } catch (err) {
      setClient(null);
      setProjects([]);
      setDevProjects([]);
      setPosts([]);
      setProductionPlans([]);
      setError(
        err instanceof Error ? err.message : "Failed to load portal data.",
      );
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    // eslint-disable-next-line
    void refresh();
  }, [refresh]);

  const value = useMemo<ClientPortalContextValue>(
    () => ({
      client,
      projects,
      devProjects,
      posts,
      productionPlans,
      loading,
      error,
      refresh,
    }),
    [client, projects, devProjects, posts, productionPlans, loading, error, refresh],
  );

  return (
    <ClientPortalContext.Provider value={value}>
      {children}
    </ClientPortalContext.Provider>
  );
}
