import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";

import { TeamMemberActiveProjectsSection } from "@/features/team-management/components/TeamMemberActiveProjectsSection";
import { TeamMemberAssignProjectDialog } from "@/features/team-management/components/TeamMemberAssignProjectDialog";
import { TeamMemberProjectHistorySection } from "@/features/team-management/components/TeamMemberProjectHistorySection";
import { TeamMemberProfileCard } from "@/features/team-management/components/TeamMemberProfileCard";
import { TEAM_MANAGEMENT_PATH } from "@/features/team-management/constants/routes";
import { useTeamMemberProjectActions } from "@/features/team-management/hooks/useTeamMemberProjectActions";
import { useTeamMemberDetailQuery } from "@/features/team-management/hooks/useTeamMemberDetailQuery";
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

  const activeProjectIds = [
    ...activeAssignments.map((assignment) => assignment.project_id),
    ...managedProjects.map((project) => project.id),
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<TeamMemberDetailBackButton />} />
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? "Not found."}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <PageHeader backButton={<TeamMemberDetailBackButton />} />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <TeamMemberProfileCard member={member} />

      <TeamMemberActiveProjectsSection
        assignments={activeAssignments}
        managedProjects={managedProjects}
        isLoading={isLoading}
        isSaving={isSaving}
        onAssignClick={() => setIsAssignDialogOpen(true)}
        onEndAssignment={endAssignment}
      />

      <TeamMemberProjectHistorySection
        assignments={assignments}
        isLoading={isLoading}
      />

      <TeamMemberAssignProjectDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        activeProjectIds={activeProjectIds}
        isSaving={isSaving}
        onAssign={assignProject}
      />
    </section>
  );
}
