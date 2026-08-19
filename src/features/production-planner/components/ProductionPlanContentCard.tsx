import { useEffect, useState } from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";

import { ApprovalStatusBadge } from "@/features/production-planner/components/ApprovalStatusBadge";
import { ApprovalStatusSelect } from "@/features/production-planner/components/ApprovalStatusSelect";
import { CONTENT_SCRIPT_PREVIEW_LINES } from "@/features/production-planner/constants/productionPlannerDirectory";
import type { ProductionPlanContentCardProps } from "@/features/production-planner/types/components";
import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";
import {
  formatContentIndex,
  getOverallApprovalStatus,
} from "@/features/production-planner/utils/contentApprovalUtils";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ProductionPlanContentCard({
  content,
  index,
  canEdit,
  canEditManagerApproval,
  canEditShootInchargeApproval,
  canEditClientApproval,
  isDraft = false,
  onSave,
  onDuplicate,
  onDelete,
  onDiscard,
}: ProductionPlanContentCardProps) {
  const [isEditing, setIsEditing] = useState(isDraft);
  const [itemName, setItemName] = useState(content.item_name);
  const [script, setScript] = useState(content.script || "");
  const [referenceLink, setReferenceLink] = useState(
    content.reference_link || "",
  );
  const [managerApproval, setManagerApproval] =
    useState<ProductionPlanApprovalStatus>(content.manager_approval);
  const [shootInchargeApproval, setShootInchargeApproval] =
    useState<ProductionPlanApprovalStatus>(content.shoot_incharge_approval);
  const [clientApproval, setClientApproval] =
    useState<ProductionPlanApprovalStatus>(content.client_approval);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isEditing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItemName(content.item_name);
    setScript(content.script || "");
    setReferenceLink(content.reference_link || "");
    setManagerApproval(content.manager_approval);
    setShootInchargeApproval(content.shoot_incharge_approval);
    setClientApproval(content.client_approval);
  }, [content, isEditing]);

  const overallStatus = getOverallApprovalStatus(
    content.manager_approval,
    content.shoot_incharge_approval,
    content.client_approval,
  );

  const resetForm = () => {
    setItemName(content.item_name);
    setScript(content.script || "");
    setReferenceLink(content.reference_link || "");
    setManagerApproval(content.manager_approval);
    setShootInchargeApproval(content.shoot_incharge_approval);
    setClientApproval(content.client_approval);
  };

  const handleCancel = () => {
    if (isDraft) {
      onDiscard?.();
      return;
    }
    resetForm();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!itemName.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(content.id, {
        itemName: itemName.trim(),
        script: script.trim() || null,
        referenceLink: referenceLink.trim() || null,
        managerApproval,
        shootInchargeApproval,
        clientApproval,
      });
      setIsEditing(false);
    } catch {
      if (!isDraft) {
        resetForm();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <article
        className={cn(
          "rounded-xl border border-border/80 bg-card shadow-sm",
          isEditing && "ring-1 ring-primary/20",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
              {formatContentIndex(index)}
            </span>
            {isEditing ? (
              <p className="text-xs font-medium text-muted-foreground">
                {isDraft ? "New content" : "Editing content"}
              </p>
            ) : (
              <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">
                {content.item_name}
              </h3>
            )}
          </div>
          {!isEditing ? <ApprovalStatusBadge status={overallStatus} /> : null}
        </header>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          {isEditing ? (
            <div>
              <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Title
              </p>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className={cn(formFieldClassName, "mt-0")}
                placeholder="Content title *"
                disabled={isSaving}
                autoFocus
              />
            </div>
          ) : null}

          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Script
            </p>
            {isEditing ? (
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={CONTENT_SCRIPT_PREVIEW_LINES}
                className={cn(formFieldClassName, "mt-0 resize-y")}
                placeholder="Add script for this content..."
                disabled={isSaving}
              />
            ) : content.script ? (
              <p
                className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: CONTENT_SCRIPT_PREVIEW_LINES,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {content.script}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No script yet.
              </p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Reference link
            </p>
            {isEditing ? (
              <input
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                className={cn(formFieldClassName, "mt-0")}
                placeholder="https://..."
                disabled={isSaving}
              />
            ) : content.reference_link ? (
              <a
                href={content.reference_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary break-all hover:underline"
              >
                {content.reference_link}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No reference link yet.
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ApprovalField
              label="Manager/Admin"
              status={isEditing ? managerApproval : content.manager_approval}
              isEditing={isEditing}
              disabled={isSaving || !canEditManagerApproval}
              onChange={setManagerApproval}
            />
            <ApprovalField
              label="Shoot Incharge"
              status={
                isEditing
                  ? shootInchargeApproval
                  : content.shoot_incharge_approval
              }
              isEditing={isEditing}
              disabled={isSaving || !canEditShootInchargeApproval}
              onChange={setShootInchargeApproval}
            />
            <ApprovalField
              label="Client"
              status={isEditing ? clientApproval : content.client_approval}
              isEditing={isEditing}
              disabled={isSaving || !canEditClientApproval}
              onChange={setClientApproval}
            />
          </div>
        </div>

        {canEdit ? (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 px-4 py-3 sm:px-5">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || !itemName.trim()}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="mr-1.5 size-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      await onDuplicate(content);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                >
                  <Copy className="mr-1.5 size-3.5" />
                  Duplicate
                </Button>
                <Button
                  variant="destructive-outline"
                  size="sm"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isSaving}
                >
                  <Trash2 className="mr-1.5 size-3.5" />
                  Delete
                </Button>
              </>
            )}
          </footer>
        ) : null}
      </article>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete content?"
        description={`Are you sure you want to delete "${content.item_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          setIsSaving(true);
          try {
            await onDelete(content.id);
            setIsConfirmOpen(false);
          } finally {
            setIsSaving(false);
          }
        }}
      />
    </>
  );
}

type ApprovalFieldProps = {
  label: string;
  status: ProductionPlanApprovalStatus;
  isEditing: boolean;
  disabled: boolean;
  onChange: (status: ProductionPlanApprovalStatus) => void;
};

function ApprovalField({
  label,
  status,
  isEditing,
  disabled,
  onChange,
}: ApprovalFieldProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5",
        isEditing && disabled && "opacity-60",
      )}
    >
      <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      {isEditing ? (
        <ApprovalStatusSelect
          value={status}
          onChange={onChange}
          disabled={disabled}
          placeholder="Select status"
          listTitle={`Select ${label.toLowerCase()} approval`}
        />
      ) : (
        <ApprovalStatusBadge status={status} />
      )}
    </div>
  );
}
