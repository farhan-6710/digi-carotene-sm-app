import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import type { Client } from "@/features/clients-management/types/types";
import { fetchClientById } from "@/features/clients-management/utils/clientsRepository";
import type { Post } from "@/features/posts-management/types/types";
import { fetchPostsForClientId } from "@/features/posts-management/utils/postsRepository";
import type { ProjectListItem } from "@/features/projects-management/types/types";
import { fetchProjectsByClientId } from "@/features/projects-management/utils/projectsRepository";

type PortalClientContextValue = {
  client: Client | null;
  projects: ProjectListItem[];
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const PortalClientContext = createContext<PortalClientContextValue | null>(
  null,
);

export function PortalClientProvider({ children }: { children: ReactNode }) {
  const { clientId } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!clientId) {
      setClient(null);
      setProjects([]);
      setPosts([]);
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
        setPosts([]);
        setError("Your client record could not be found.");
        return;
      }

      const [projectRows, clientPosts] = await Promise.all([
        fetchProjectsByClientId(clientId),
        fetchPostsForClientId(clientId),
      ]);

      setClient(clientRow);
      setProjects(projectRows);
      setPosts(clientPosts);
    } catch (err) {
      setClient(null);
      setProjects([]);
      setPosts([]);
      setError(
        err instanceof Error ? err.message : "Failed to load portal data.",
      );
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ client, projects, posts, loading, error, refresh }),
    [client, projects, posts, loading, error, refresh],
  );

  return (
    <PortalClientContext.Provider value={value}>
      {children}
    </PortalClientContext.Provider>
  );
}

export function usePortalClient() {
  const context = useContext(PortalClientContext);
  if (!context) {
    throw new Error("usePortalClient must be used within PortalClientProvider");
  }
  return context;
}
