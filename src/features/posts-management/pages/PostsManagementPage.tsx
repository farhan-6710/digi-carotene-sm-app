import { Link, useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ClientProjectFilters } from "@/features/posts-management/components/ClientProjectFilters";
import { MonthSelector } from "@/shared/ui/MonthSelector";
import { PostDialog } from "@/features/posts-management/components/PostDialog";
import { PostsManagementStatusLegend } from "@/features/posts-management/components/PostsManagementStatusLegend";
import { PostsManagementWeeksTable } from "@/features/posts-management/components/PostsManagementWeeksTable";
import {
  buildAddPostsPath,
  buildPostsDayPath,
} from "@/features/posts-management/constants/routes";
import {
  statusColors,
  statusText,
} from "@/features/posts-management/constants/postsManagement";
import { usePostsCalendarSelection } from "@/features/posts-management/hooks/usePostsCalendarSelection";
import { usePostsManagement } from "@/features/posts-management/hooks/usePostsManagement";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageContent } from "@/shared/components/PageContent";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function PostsManagementPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const { selectedDate, calendarWeeks, year, month, selectDate } =
    usePostsCalendarSelection();

  const { isLoading, error, projects, getSlot, openEditDialog, dialog } =
    usePostsManagement(year, month, selectedClientId, selectedProjectId);

  const projectsById = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects],
  );

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);

    if (!clientId) {
      setSelectedProjectId("");
      return;
    }

    const selectedProject = selectedProjectId
      ? projectsById.get(selectedProjectId)
      : null;

    if (selectedProject && selectedProject.client_id !== clientId) {
      setSelectedProjectId("");
    }
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);

    if (!projectId) {
      return;
    }

    const project = projectsById.get(projectId);
    setSelectedClientId(project?.client_id ?? "");
  };

  const goToDay = (slotYear: number, slotMonth: number, date: number) => {
    const target = new Date(slotYear, slotMonth - 1, date);
    selectDate(target);
    navigate(buildPostsDayPath(target));
  };

  return (
    <PageContent>
      <PageHeader
        heading="Postings Calendar"
        description="Browse the content calendar by month. Open any day to review its posts, or add a new one."
        actions={
          can("posts.create") ? (
            <Button asChild className="gap-2 rounded-full px-5 shadow-sm">
              <Link to={buildAddPostsPath({ date: new Date() })}>
                <Plus className="size-4" />
                Add Post
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <PostsManagementStatusLegend />
          <MonthSelector
            year={year}
            month={month}
            onSelect={selectDate}
            className="w-full sm:w-auto"
          />
        </div>

        <ClientProjectFilters
          projects={projects}
          selectedClientId={selectedClientId}
          selectedProjectId={selectedProjectId}
          onClientChange={handleClientChange}
          onProjectChange={handleProjectChange}
        />
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-card">
          <LoadingSpinner />
        </div>
      ) : (
        <PostsManagementWeeksTable
          year={year}
          month={month}
          weeks={calendarWeeks}
          selectedDate={selectedDate}
          getSlot={getSlot}
          onOpenDay={goToDay}
          onEdit={openEditDialog}
          statusColors={statusColors}
          statusText={statusText}
        />
      )}

      <PostDialog {...dialog} />
    </PageContent>
  );
}
