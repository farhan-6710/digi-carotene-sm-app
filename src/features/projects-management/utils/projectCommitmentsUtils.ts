import type { ProjectListItem } from "@/features/projects-management/types/types";

export type ProjectCommitmentRow = {
  id: string;
  projectName: string;
  clientName: string | null;
  detailPath: string;
  committedSinglePosts: number;
  committedCarousels: number;
  committedReels: number;
  committedStories: number;
  committedVideos: number;
  total: number;
};

export function getProjectCommittedTotal(
  project: Pick<
    ProjectListItem,
    | "committed_single_posts"
    | "committed_carousels"
    | "committed_reels"
    | "committed_stories"
    | "committed_videos"
  >,
): number {
  return (
    (project.committed_single_posts ?? 0) +
    (project.committed_carousels ?? 0) +
    (project.committed_reels ?? 0) +
    (project.committed_stories ?? 0) +
    (project.committed_videos ?? 0)
  );
}

export function buildProjectCommitmentRows(
  projects: ProjectListItem[],
  buildDetailPath: (projectId: string) => string,
): ProjectCommitmentRow[] {
  return projects
    .map((project) => {
      const committedSinglePosts = project.committed_single_posts ?? 0;
      const committedCarousels = project.committed_carousels ?? 0;
      const committedReels = project.committed_reels ?? 0;
      const committedStories = project.committed_stories ?? 0;
      const committedVideos = project.committed_videos ?? 0;
      return {
        id: project.id,
        projectName: project.project_name,
        clientName: project.clients?.client_name ?? null,
        detailPath: buildDetailPath(project.id),
        committedSinglePosts,
        committedCarousels,
        committedReels,
        committedStories,
        committedVideos,
        total:
          committedSinglePosts +
          committedCarousels +
          committedReels +
          committedStories +
          committedVideos,
      };
    })
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return a.projectName.localeCompare(b.projectName);
    });
}
