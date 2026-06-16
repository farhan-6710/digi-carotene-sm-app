import { Plus } from "lucide-react";
import { useState } from "react";

import type { ClientActiveEmployeesSectionProps } from "@/features/clients-management/types/components";
import {
  formatClientAssignmentDate,
  getAssignmentMemberName,
} from "@/features/clients-management/utils/clientAssignmentUtils";
import {
  EMPLOYEE_ROLE_BADGE_CLASS,
  EMPLOYEE_ROLE_LABELS,
} from "@/features/employees-management/constants/employeeRoles";
import {
  ActiveAssignmentTag,
  ActiveAssignmentTags,
} from "@/shared/components/ActiveAssignmentTag";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ClientActiveEmployeesSection({
  assignments,
  isLoading,
  isSaving,
  onAssignClick,
  onEndAssignment,
}: ClientActiveEmployeesSectionProps) {
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
            <div className="text-sm font-semibold">Active assignments</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap a name to end their active assignment.
            </p>
          </div>
          <Button
            onClick={onAssignClick}
            className="rounded-full shadow-sm"
            disabled={isSaving}
          >
            <Plus className="mr-2 size-4" />
            Assign Team Member
          </Button>
        </div>

        <ActiveAssignmentTags
          isLoading={isLoading}
          emptyMessage="No one assigned yet. Assign a team member to get started."
        >
          {assignments.map((assignment) => {
            const role = assignment.team_members?.role;

            return (
              <ActiveAssignmentTag
                key={assignment.id}
                label={getAssignmentMemberName(assignment)}
                meta={`Since ${formatClientAssignmentDate(assignment.started_at)}`}
                disabled={isSaving}
                onSelect={() => setEndingAssignmentId(assignment.id)}
                badge={
                  role ? (
                    <span
                      className={cn(
                        "inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                        EMPLOYEE_ROLE_BADGE_CLASS[role],
                      )}
                    >
                      {EMPLOYEE_ROLE_LABELS[role]}
                    </span>
                  ) : undefined
                }
              />
            );
          })}
        </ActiveAssignmentTags>
      </div>

      <ConfirmationModal
        open={endingAssignmentId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEndingAssignmentId(null);
          }
        }}
        title="End assignment?"
        description={
          endingAssignment
            ? `Remove "${getAssignmentMemberName(endingAssignment)}" from this client? Assigned since ${formatClientAssignmentDate(endingAssignment.started_at)}. The assignment will remain in history.`
            : "End this assignment?"
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
