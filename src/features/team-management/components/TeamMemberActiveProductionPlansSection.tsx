import { Plus } from "lucide-react";
import { useState } from "react";

import { PRODUCTION_PLAN_ROLE_LABELS } from "@/features/team-management/constants/productionPlanRoles";
import type { TeamMemberActiveProductionPlansSectionProps } from "@/features/team-management/types/components";
import {
  formatAssignmentDate,
  getAssignmentPlanName,
  getPlanRoleAssignmentLabel,
} from "@/features/team-management/utils/teamMemberAssignmentUtils";
import {
  ActiveAssignmentTag,
  ActiveAssignmentTags,
} from "@/shared/components/ActiveAssignmentTag";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";

export function TeamMemberActiveProductionPlansSection({
  assignments,
  roleAssignments,
  isLoading,
  isSaving,
  canManage,
  onAssignClick,
  onEndAssignment,
}: TeamMemberActiveProductionPlansSectionProps) {
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
            <div className="text-sm font-semibold">Active production plans</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {canManage
                ? "Tap a plan assignment to end it. Manager and shoot incharge roles are edited from Production Planner."
                : "Production plans this team member is currently assigned to."}
            </p>
          </div>
          {canManage ? (
            <Button
              onClick={onAssignClick}
              className="rounded-full shadow-sm"
              disabled={isSaving}
            >
              <Plus className="mr-2 size-4" />
              Assign plans
            </Button>
          ) : null}
        </div>

        <ActiveAssignmentTags
          isLoading={isLoading}
          emptyMessage="No active production plans yet. Assign a plan to get started."
        >
          {roleAssignments.map((plan) => (
            <ActiveAssignmentTag
              key={`${plan.role}-${plan.id}`}
              label={getPlanRoleAssignmentLabel(plan)}
              meta={PRODUCTION_PLAN_ROLE_LABELS[plan.role]}
              disabled
              onSelect={() => undefined}
            />
          ))}
          {assignments.map((assignment) => (
            <ActiveAssignmentTag
              key={assignment.id}
              label={getAssignmentPlanName(assignment)}
              meta={`Since ${formatAssignmentDate(assignment.started_at)}`}
              disabled={isSaving || !canManage}
              onSelect={() =>
                canManage ? setEndingAssignmentId(assignment.id) : undefined
              }
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
        title="End plan assignment?"
        description={
          endingAssignment
            ? `Stop active work on "${getAssignmentPlanName(endingAssignment)}"? Assigned since ${formatAssignmentDate(endingAssignment.started_at)}.`
            : "Stop this plan assignment?"
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
