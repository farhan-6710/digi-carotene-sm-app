import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { OtherProjectDialog } from "@/features/other-projects/components/OtherProjectDialog";
import { OtherProjectProfileCard } from "@/features/other-projects/components/OtherProjectProfileCard";
import { OTHER_PROJECTS_MANAGEMENT_PATH } from "@/features/other-projects/constants/routes";
import { useOtherProjectDetailQuery } from "@/features/other-projects/hooks/useOtherProjectDetailQuery";
import { useOtherProjectDialog } from "@/features/other-projects/hooks/useOtherProjectDialog";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

function OtherProjectBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={OTHER_PROJECTS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to other projects
      </Link>
    </Button>
  );
}

export function OtherProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { project, isLoading, error, setError, reload } =
    useOtherProjectDetailQuery(projectId);
  const { openEditDialog, dialog } = useOtherProjectDialog({
    reload,
    setError,
  });
  const canEdit = can("projects.update");

  if (isLoading && !project) {
    return <DetailPageLoading backButton={<OtherProjectBackButton />} />;
  }

  if (!project) {
    return (
      <section className="space-y-4">
        <PageHeader
          heading="Other project"
          description="Project details."
          backButton={<OtherProjectBackButton />}
        />
        <ErrorBanner message={error ?? "Project not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={project.project_name}
        description="Review other project details, start date, and ETA."
        backButton={<OtherProjectBackButton />}
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

      <OtherProjectProfileCard project={project} />

      {canEdit ? (
        <OtherProjectDialog
          {...dialog}
          onDelete={
            dialog.onDelete
              ? async () => {
                  await dialog.onDelete?.();
                  void navigate(OTHER_PROJECTS_MANAGEMENT_PATH);
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
