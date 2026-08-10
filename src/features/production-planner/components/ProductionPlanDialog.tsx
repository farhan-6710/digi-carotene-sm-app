import { useCallback, useEffect, useMemo, useState } from "react";

import { useClientsQuery } from "@/features/clients-management/hooks/useClientsQuery";
import type { ProductionPlanDialogProps } from "@/features/production-planner/types/components";
import type { TeamMember } from "@/features/team-management/types/types";
import { fetchTeamMembers } from "@/services/teamMembersService";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { DatePicker } from "@/shared/components/DatePicker";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { useFetch } from "@/shared/hooks/useFetch";
import { ComboBox } from "@/shared/ui/ComboBox";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

export function ProductionPlanDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  onFieldChange,
  onSave,
  onDelete,
}: ProductionPlanDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { clients, isLoading: isClientsLoading } = useClientsQuery();
  const loadTeamMembers = useCallback(() => fetchTeamMembers(), []);
  const { data: teamMembers, isLoading: isTeamLoading } = useFetch<TeamMember[]>(
    loadTeamMembers,
    [],
  );

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const clientOptions = useMemo(
    () =>
      clients.map((c) => ({
        value: c.id,
        label: c.client_name,
      })),
    [clients],
  );

  const teamMemberOptions = useMemo(
    () =>
      teamMembers.map((member) => ({
        value: member.id,
        label: member.member_name,
      })),
    [teamMembers],
  );

  const canSave =
    values.clientId &&
    values.planName.trim().length > 0 &&
    values.shootDate &&
    values.managerId &&
    values.shootInchargeId;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {isEditing ? "Edit Production Plan" : "Add Production Plan"}
            </DialogTitle>
            <DialogDescription>
              Set the client, assignees, schedule, and deliverable targets.
              Add individual content from the plan page.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Select a client *
                </span>
                <ComboBox
                  value={values.clientId}
                  onChange={(val) => onFieldChange("clientId", val)}
                  options={clientOptions}
                  isLoading={isClientsLoading}
                  placeholder="Search and select client..."
                  listTitle="Clients"
                  emptyMessage="No clients found."
                  disabled={isSaving}
                />
              </div>

              <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
                Plan Name *
                <input
                  value={values.planName}
                  onChange={(e) => onFieldChange("planName", e.target.value)}
                  placeholder="e.g. August Reel Campaign"
                  className={formFieldClassName}
                  required
                  disabled={isSaving}
                />
              </label>

              <label className="block text-xs font-semibold text-muted-foreground sm:col-span-2">
                Plan Description
                <textarea
                  value={values.planDescription}
                  onChange={(e) =>
                    onFieldChange("planDescription", e.target.value)
                  }
                  placeholder="Describe the objective or shoot outline..."
                  className={formFieldClassName}
                  rows={2}
                  disabled={isSaving}
                />
              </label>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Manager *
                </span>
                <ComboBox
                  value={values.managerId}
                  onChange={(val) => onFieldChange("managerId", val)}
                  options={teamMemberOptions}
                  isLoading={isTeamLoading}
                  placeholder="Select manager..."
                  listTitle="Team members"
                  emptyMessage="No team members found."
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Shoot Incharge *
                </span>
                <ComboBox
                  value={values.shootInchargeId}
                  onChange={(val) => onFieldChange("shootInchargeId", val)}
                  options={teamMemberOptions}
                  isLoading={isTeamLoading}
                  placeholder="Select shoot incharge..."
                  listTitle="Team members"
                  emptyMessage="No team members found."
                  disabled={isSaving}
                />
              </div>

              <div className="sm:col-span-2">
                <DatePicker
                  label="Shoot Date *"
                  value={values.shootDate}
                  onChange={(dateStr) => onFieldChange("shootDate", dateStr)}
                  disabled={isSaving}
                />
              </div>

              <div className="mt-2 border-t border-border/60 pt-4 sm:col-span-2">
                <h4 className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Deliverables
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Reels
                    <input
                      type="number"
                      min="0"
                      value={values.reelsCount}
                      onChange={(e) =>
                        onFieldChange("reelsCount", e.target.value)
                      }
                      className={formFieldClassName}
                      disabled={isSaving}
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Images
                    <input
                      type="number"
                      min="0"
                      value={values.imagesCount}
                      onChange={(e) =>
                        onFieldChange("imagesCount", e.target.value)
                      }
                      className={formFieldClassName}
                      disabled={isSaving}
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Carousels
                    <input
                      type="number"
                      min="0"
                      value={values.carouselsCount}
                      onChange={(e) =>
                        onFieldChange("carouselsCount", e.target.value)
                      }
                      className={formFieldClassName}
                      disabled={isSaving}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-border/60 pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive-outline"
                onClick={() => setIsConfirmOpen(true)}
                className="mr-auto"
                disabled={isSaving}
              >
                Delete Plan
              </Button>
            ) : null}
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={onSave} disabled={!canSave || isSaving}>
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Add Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete production plan?"
        description="This permanently deletes the plan and all of its contents."
        confirmLabel="Delete plan"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          await onDelete?.();
          setIsConfirmOpen(false);
        }}
      />
    </>
  );
}
