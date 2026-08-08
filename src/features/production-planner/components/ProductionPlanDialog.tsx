import { useEffect, useMemo, useState } from "react";

import { useClientsQuery } from "@/features/clients-management/hooks/useClientsQuery";
import type { ProductionPlanDialogProps } from "@/features/production-planner/types/components";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { DatePicker } from "@/shared/components/DatePicker";
import { ComboBox } from "@/shared/ui/ComboBox";
import { Button } from "@/shared/ui/button";
import { formFieldClassName } from "@/shared/constants/formStyles";
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

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsConfirmOpen(false);
    }
  }, [open]);

  const clientOptions = useMemo(() => {
    return clients.map((c) => ({
      value: c.id,
      label: c.client_name,
    }));
  }, [clients]);

  const canSave = values.clientId && values.planName.trim().length > 0 && values.startDate;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] max-w-lg flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {isEditing ? "Edit Production Plan" : "Add Production Plan"}
            </DialogTitle>
            <DialogDescription>
              Create or modify a scheduled client production plan, including deliverable targets and approval states.
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
                  onChange={(e) => onFieldChange("planDescription", e.target.value)}
                  placeholder="Describe the objective or shoot outline..."
                  className={formFieldClassName}
                  rows={2}
                  disabled={isSaving}
                />
              </label>

              <div className="sm:col-span-2">
                <DatePicker
                  label="Start Date *"
                  value={values.startDate}
                  onChange={(dateStr) => onFieldChange("startDate", dateStr)}
                  disabled={isSaving}
                />
              </div>

              <div className="sm:col-span-2 border-t border-border/60 pt-4 mt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Deliverables
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Reels
                    <input
                      type="number"
                      min="0"
                      value={values.reelsCount}
                      onChange={(e) => onFieldChange("reelsCount", e.target.value)}
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
                      onChange={(e) => onFieldChange("imagesCount", e.target.value)}
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
                      onChange={(e) => onFieldChange("carouselsCount", e.target.value)}
                      className={formFieldClassName}
                      disabled={isSaving}
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2 border-t border-border/60 pt-4 mt-2 grid grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-muted-foreground">
                  Manager Approval
                  <select
                    value={values.managerApproval}
                    onChange={(e) => onFieldChange("managerApproval", e.target.value)}
                    className={formFieldClassName}
                    disabled={isSaving}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-muted-foreground">
                  Shoot Incharge Approval
                  <select
                    value={values.shootInchargeApproval}
                    onChange={(e) => onFieldChange("shootInchargeApproval", e.target.value)}
                    className={formFieldClassName}
                    disabled={isSaving}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>
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
        description="This will permanently delete this production plan. This action cannot be undone."
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
