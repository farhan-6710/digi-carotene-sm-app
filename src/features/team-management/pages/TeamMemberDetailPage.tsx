import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { TeamMemberActiveProjectsSection } from "@/features/team-management/components/TeamMemberActiveProjectsSection";
import { TeamMemberAssignProjectDialog } from "@/features/team-management/components/TeamMemberAssignProjectDialog";
import { TeamMemberDialog } from "@/features/team-management/components/TeamMemberDialog";
import { TeamMemberProjectHistorySection } from "@/features/team-management/components/TeamMemberProjectHistorySection";
import { TeamMemberProfileCard } from "@/features/team-management/components/TeamMemberProfileCard";
import { TEAM_MANAGEMENT_PATH } from "@/features/team-management/constants/routes";
import { useTeamMemberDialog } from "@/features/team-management/hooks/useTeamMemberDialog";
import { useTeamMemberProjectActions } from "@/features/team-management/hooks/useTeamMemberProjectActions";
import { useTeamMemberDetailQuery } from "@/features/team-management/hooks/useTeamMemberDetailQuery";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PageContent } from "@/shared/components/PageContent";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function TeamMemberDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={TEAM_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to team
      </Link>
    </Button>
  );
}

export function TeamMemberDetailPage() {
  const { memberId = "" } = useParams();
  const { can } = usePermissions();
  const canManageTeam = can("team.update");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const {
    member,
    assignments,
    activeAssignments,
    managedProjects,
    isLoading,
    error,
    setError,
    reload,
  } = useTeamMemberDetailQuery(memberId);

  const { isSaving, assignProject, endAssignment } = useTeamMemberProjectActions({
    memberId,
    reload,
    setError,
  });

  const { openEditDialog, dialog } = useTeamMemberDialog({ reload, setError });

  const activeProjectIds = [
    ...activeAssignments.map((assignment) => assignment.project_id),
    ...managedProjects.map((project) => project.id),
  ];

  if (isLoading) {
    return <DetailPageLoading backButton={<TeamMemberDetailBackButton />} />;
  }

  if (!member) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<TeamMemberDetailBackButton />} />
        <ErrorBanner message={error ?? "Not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        actions={
          <div className="flex w-full items-center justify-between gap-4">
            <TeamMemberDetailBackButton />
            {canManageTeam ? (
              <Button
                onClick={() => openEditDialog(member)}
                className="rounded-full shadow-sm"
              >
                <Pencil className="mr-2 size-4" />
                Edit Profile
              </Button>
            ) : null}
          </div>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <TeamMemberProfileCard member={member} />

      <TeamMemberActiveProjectsSection
        assignments={activeAssignments}
        managedProjects={managedProjects}
        isLoading={isLoading}
        isSaving={isSaving}
        canManage={canManageTeam}
        onAssignClick={() => setIsAssignDialogOpen(true)}
        onEndAssignment={endAssignment}
      />

      <TeamMemberProjectHistorySection
        assignments={assignments}
        isLoading={isLoading}
      />

      {canManageTeam ? (
        <>
          <TeamMemberAssignProjectDialog
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
            activeProjectIds={activeProjectIds}
            isSaving={isSaving}
            onAssign={assignProject}
          />
          <TeamMemberDialog {...dialog} />
        </>
      ) : null}
    </PageContent>
  );
}
