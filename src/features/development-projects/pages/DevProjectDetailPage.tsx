import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { DevProjectDialog } from "@/features/development-projects/components/DevProjectDialog";
import { DevProjectProfileCard } from "@/features/development-projects/components/DevProjectProfileCard";
import { DEV_PROJECTS_MANAGEMENT_PATH } from "@/features/development-projects/constants/routes";
import { useDevProjectDetailQuery } from "@/features/development-projects/hooks/useDevProjectDetailQuery";
import { useDevProjectDialog } from "@/features/development-projects/hooks/useDevProjectDialog";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

function DevProjectBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={DEV_PROJECTS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to development projects
      </Link>
    </Button>
  );
}

export function DevProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { project, isLoading, error, setError, reload } =
    useDevProjectDetailQuery(projectId);
  const { openEditDialog, dialog } = useDevProjectDialog({
    reload,
    setError,
  });
  const canEdit = can("projects.update");

  if (isLoading && !project) {
    return <DetailPageLoading backButton={<DevProjectBackButton />} />;
  }

  if (!project) {
    return (
      <section className="space-y-4">
        <PageHeader
          heading="Development project"
          description="Project details."
          backButton={<DevProjectBackButton />}
        />
        <ErrorBanner message={error ?? "Project not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={project.project_name}
        description="Review development project details and environment links."
        backButton={<DevProjectBackButton />}
        actions={
          canEdit ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => openEditDialog(project)}
            >
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          ) : null
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <DevProjectProfileCard project={project} />

      {canEdit ? (
        <DevProjectDialog
          {...dialog}
          onDelete={
            dialog.onDelete
              ? async () => {
                  await dialog.onDelete?.();
                  void navigate(DEV_PROJECTS_MANAGEMENT_PATH);
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
