import { Plus } from "lucide-react";
import { useState } from "react";

import type { EmployeeActiveClientsSectionProps } from "@/features/employees-management/types/components";
import {
  formatAssignmentDate,
  getAssignmentClientName,
} from "@/features/employees-management/utils/employeeAssignmentUtils";
import {
  ActiveAssignmentTag,
  ActiveAssignmentTags,
} from "@/shared/components/ActiveAssignmentTag";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";

export function EmployeeActiveClientsSection({
  assignments,
  isLoading,
  isSaving,
  onAssignClick,
  onEndAssignment,
}: EmployeeActiveClientsSectionProps) {
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
            <div className="text-sm font-semibold">Active clients</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap a client to end their active assignment.
            </p>
          </div>
          <Button
            onClick={onAssignClick}
            className="rounded-full shadow-sm"
            disabled={isSaving}
          >
            <Plus className="mr-2 size-4" />
            Assign client
          </Button>
        </div>

        <ActiveAssignmentTags
          isLoading={isLoading}
          emptyMessage="No active clients yet. Assign a client to get started."
        >
          {assignments.map((assignment) => (
            <ActiveAssignmentTag
              key={assignment.id}
              label={getAssignmentClientName(assignment)}
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
        title="End client assignment?"
        description={
          endingAssignment
            ? `Stop active work for "${getAssignmentClientName(endingAssignment)}"? Assigned since ${formatAssignmentDate(endingAssignment.started_at)}. The client will remain in history.`
            : "Stop this client assignment?"
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
