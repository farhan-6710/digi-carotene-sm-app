import { Plus } from "lucide-react";
import { useState } from "react";

import type { TeamMemberActiveProjectsSectionProps } from "@/features/team-management/types/components";
import {
  formatAssignmentDate,
  getAssignmentProjectName,
  getManagedProjectLabel,
} from "@/features/team-management/utils/teamMemberAssignmentUtils";
import {
  ActiveAssignmentTag,
  ActiveAssignmentTags,
} from "@/shared/components/ActiveAssignmentTag";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";

export function TeamMemberActiveProjectsSection({
  assignments,
  managedProjects,
  isLoading,
  isSaving,
  onAssignClick,
  onEndAssignment,
}: TeamMemberActiveProjectsSectionProps) {
  const [endingAssignmentId, setEndingAssignmentId] = useState<string | null>(
    null,
  );

  const endingAssignment = assignments.find(
    (assignment) => assignment.id === endingAssignmentId,
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <div className="text-sm font-semibold">Active projects</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap a project assignment to end it. Managed projects are edited from Projects.
            </p>
          </div>
          <Button
            onClick={onAssignClick}
            className="rounded-full shadow-sm"
            disabled={isSaving}
          >
            <Plus className="mr-2 size-4" />
            Assign project
          </Button>
        </div>

        <ActiveAssignmentTags
          isLoading={isLoading}
          emptyMessage="No active projects yet. Assign a project to get started."
        >
          {managedProjects.map((project) => (
            <ActiveAssignmentTag
              key={`manager-${project.id}`}
              label={getManagedProjectLabel(project)}
              meta="Project manager"
              disabled
              onSelect={() => undefined}
            />
          ))}
          {assignments.map((assignment) => (
            <ActiveAssignmentTag
              key={assignment.id}
              label={getAssignmentProjectName(assignment)}
              meta={`Since ${formatAssignmentDate(assignment.started_at)}`}
              disabled={isSaving}
              onSelect={() => setEndingAssignmentId(assignment.id)}
            />
          ))}
        </ActiveAssignmentTags>
      </div>

      <ConfirmationModal
        open={endingAssignmentId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEndingAssignmentId(null);
          }
        }}
        title="End project assignment?"
        description={
          endingAssignment
            ? `Stop active work on "${getAssignmentProjectName(endingAssignment)}"? Assigned since ${formatAssignmentDate(endingAssignment.started_at)}. The project will remain in history.`
            : "Stop this project assignment?"
        }
        confirmLabel="End assignment"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          if (!endingAssignmentId) {
            return;
          }
          await onEndAssignment(endingAssignmentId);
          setEndingAssignmentId(null);
        }}
      />
    </>
  );
}
