import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Copy, Pencil, Trash2 } from "lucide-react";
import type { KeyboardEvent, MouseEvent } from "react";

import { ApprovalStatusBadge } from "@/features/production-planner/components/ApprovalStatusBadge";
import { ApprovalStatusSelect } from "@/features/production-planner/components/ApprovalStatusSelect";
import {
  CONTENT_CONTEXT_PREVIEW_LINES,
  CONTENT_PILLAR_MAX_LENGTH,
  CONTENT_SCRIPT_PREVIEW_LINES,
} from "@/features/production-planner/constants/productionPlannerDirectory";
import type { ProductionPlanContentCardProps } from "@/features/production-planner/types/components";
import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";
import {
  areAllContentApprovalsApproved,
  formatContentIndex,
  getOverallApprovalStatus,
} from "@/features/production-planner/utils/contentApprovalUtils";
import { PostTypeSelect } from "@/features/posts-management/components/PostTypeSelect";
import { SocialsSelect } from "@/features/posts-management/components/SocialsSelect";
import {
  DEFAULT_POST_TYPE,
  postTypeLabels,
  type SocialPlatform,
} from "@/features/posts-management/constants/postsManagement";
import type { PostType } from "@/features/posts-management/types/types";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { DatePicker } from "@/shared/components/DatePicker";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Switch } from "@/shared/ui/switch";
import { parseUrlDateParam } from "@/shared/utils/urlDateParams";

export function ProductionPlanContentCard({
  content,
  index,
  canEdit,
  canEditManagerApproval,
  canEditShootInchargeApproval,
  canEditClientApproval,
  canEditShootCompleted = false,
  lockDetails = false,
  showMutations = true,
  expandDetails = false,
  isDraft = false,
  selectable = false,
  selected = false,
  onToggleSelected,
  onOpenLightbox,
  onSave,
  onDuplicate,
  onDelete,
  onDiscard,
}: ProductionPlanContentCardProps) {
  const [isEditing, setIsEditing] = useState(isDraft);
  const [itemName, setItemName] = useState(content.item_name);
  const [shootDate, setShootDate] = useState(content.shoot_date || "");
  const [contextDescription, setContextDescription] = useState(
    content.context_description || "",
  );
  const [contentPillar, setContentPillar] = useState(
    content.content_pillar || "",
  );
  const [script, setScript] = useState(content.script || "");
  const [referenceLink, setReferenceLink] = useState(
    content.reference_link || "",
  );
  const [postType, setPostType] = useState<PostType>(
    content.post_type || DEFAULT_POST_TYPE,
  );
  const [socials, setSocials] = useState<SocialPlatform[]>(
    (content.socials ?? []) as SocialPlatform[],
  );
  const [managerApproval, setManagerApproval] =
    useState<ProductionPlanApprovalStatus>(content.manager_approval);
  const [shootInchargeApproval, setShootInchargeApproval] =
    useState<ProductionPlanApprovalStatus>(content.shoot_incharge_approval);
  const [clientApproval, setClientApproval] =
    useState<ProductionPlanApprovalStatus>(content.client_approval);
  const [shootCompleted, setShootCompleted] = useState(content.shoot_completed);
  const [shootNotes, setShootNotes] = useState(content.shoot_notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [shootConfirmOpen, setShootConfirmOpen] = useState(false);
  const [pendingShootCompleted, setPendingShootCompleted] = useState(false);

  useEffect(() => {
    if (isEditing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItemName(content.item_name);
    setShootDate(content.shoot_date || "");
    setContextDescription(content.context_description || "");
    setContentPillar(content.content_pillar || "");
    setScript(content.script || "");
    setReferenceLink(content.reference_link || "");
    setPostType(content.post_type || DEFAULT_POST_TYPE);
    setSocials((content.socials ?? []) as SocialPlatform[]);
    setManagerApproval(content.manager_approval);
    setShootInchargeApproval(content.shoot_incharge_approval);
    setClientApproval(content.client_approval);
    setShootCompleted(content.shoot_completed);
    setShootNotes(content.shoot_notes || "");
  }, [content, isEditing]);

  const overallStatus = getOverallApprovalStatus(
    managerApproval,
    shootInchargeApproval,
    clientApproval,
  );

  const allApprovalsDone = areAllContentApprovalsApproved(
    managerApproval,
    shootInchargeApproval,
    clientApproval,
  );
  const canToggleShootCompleted =
    canEditShootCompleted &&
    allApprovalsDone &&
    !isDraft &&
    !content.moved_to_post_id;

  const resetForm = () => {
    setItemName(content.item_name);
    setShootDate(content.shoot_date || "");
    setContextDescription(content.context_description || "");
    setContentPillar(content.content_pillar || "");
    setScript(content.script || "");
    setReferenceLink(content.reference_link || "");
    setPostType(content.post_type || DEFAULT_POST_TYPE);
    setSocials((content.socials ?? []) as SocialPlatform[]);
    setManagerApproval(content.manager_approval);
    setShootInchargeApproval(content.shoot_incharge_approval);
    setClientApproval(content.client_approval);
    setShootCompleted(content.shoot_completed);
    setShootNotes(content.shoot_notes || "");
  };

  const buildPayload = (overrides?: {
    managerApproval?: ProductionPlanApprovalStatus;
    shootInchargeApproval?: ProductionPlanApprovalStatus;
    clientApproval?: ProductionPlanApprovalStatus;
    shootCompleted?: boolean;
    shootNotes?: string | null;
  }) => ({
    itemName: lockDetails || !isEditing ? content.item_name : itemName.trim(),
    shootDate:
      lockDetails || !isEditing
        ? content.shoot_date
        : shootDate.trim() || null,
    contextDescription:
      lockDetails || !isEditing
        ? content.context_description
        : contextDescription.trim() || null,
    contentPillar:
      lockDetails || !isEditing
        ? content.content_pillar
        : contentPillar.trim() || null,
    script: lockDetails || !isEditing ? content.script : script.trim() || null,
    referenceLink:
      lockDetails || !isEditing
        ? content.reference_link
        : referenceLink.trim() || null,
    postType:
      lockDetails || !isEditing
        ? content.post_type || DEFAULT_POST_TYPE
        : postType,
    socials:
      lockDetails || !isEditing
        ? content.socials
        : socials.length > 0
          ? socials
          : null,
    managerApproval: overrides?.managerApproval ?? managerApproval,
    shootInchargeApproval:
      overrides?.shootInchargeApproval ?? shootInchargeApproval,
    clientApproval: overrides?.clientApproval ?? clientApproval,
    shootCompleted: canEditShootCompleted
      ? (overrides?.shootCompleted ?? shootCompleted)
      : content.shoot_completed,
    shootNotes:
      lockDetails || !isEditing
        ? overrides?.shootNotes !== undefined
          ? overrides.shootNotes
          : content.shoot_notes
        : shootNotes.trim() || null,
  });

  const handleCancel = () => {
    if (isDraft) {
      onDiscard?.();
      return;
    }
    resetForm();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!lockDetails && !itemName.trim()) return;
    setIsSaving(true);
    try {
      await onSave(content.id, buildPayload());
      setIsEditing(false);
    } catch {
      if (!isDraft) {
        resetForm();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprovalChange = async (
    field: "manager" | "shootIncharge" | "client",
    status: ProductionPlanApprovalStatus,
  ) => {
    const nextManager =
      field === "manager" ? status : managerApproval;
    const nextShootIncharge =
      field === "shootIncharge" ? status : shootInchargeApproval;
    const nextClient = field === "client" ? status : clientApproval;

    if (field === "manager") setManagerApproval(status);
    else if (field === "shootIncharge") setShootInchargeApproval(status);
    else setClientApproval(status);

    if (isEditing || isDraft) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave(
        content.id,
        buildPayload({
          managerApproval: nextManager,
          shootInchargeApproval: nextShootIncharge,
          clientApproval: nextClient,
        }),
      );
    } catch {
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleShootCompletedChange = (checked: boolean) => {
    if (!canToggleShootCompleted || isSaving) return;
    setPendingShootCompleted(checked);
    setShootConfirmOpen(true);
  };

  const confirmShootCompletedChange = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isEditing) {
        setShootCompleted(pendingShootCompleted);
        setShootConfirmOpen(false);
        return;
      }
      await onSave(
        content.id,
        buildPayload({
          shootCompleted: pendingShootCompleted,
        }),
      );
      setShootCompleted(pendingShootCompleted);
      setShootConfirmOpen(false);
    } catch {
      setShootCompleted(content.shoot_completed);
    } finally {
      setIsSaving(false);
    }
  };

  const shootDateLabel = (() => {
    const date = parseUrlDateParam(content.shoot_date);
    return date ? format(date, "MMMM d, yyyy") : null;
  })();

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if (!onOpenLightbox || isEditing || isDraft) return;
    const target = event.target as HTMLElement | null;
    if (
      target?.closest(
        "button, a, input, textarea, label, [role='checkbox'], [data-slot='checkbox'], [data-slot='switch']",
      )
    ) {
      return;
    }
    onOpenLightbox();
  };

  return (
    <>
      <article
        role={onOpenLightbox && !isEditing && !isDraft ? "button" : undefined}
        tabIndex={onOpenLightbox && !isEditing && !isDraft ? 0 : undefined}
        onClick={handleCardClick}
        onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
          if (!onOpenLightbox || isEditing || isDraft) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenLightbox();
          }
        }}
        className={cn(
          "rounded-xl border border-border/80 bg-card shadow-sm",
          isEditing && "ring-1 ring-primary/20",
          onOpenLightbox &&
            !isEditing &&
            !isDraft &&
            "cursor-pointer transition hover:border-ring/40 hover:bg-muted/20",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {selectable ? (
              <Checkbox
                checked={selected}
                onCheckedChange={() => onToggleSelected?.()}
                aria-label={`Select ${content.item_name || "content"}`}
                className="mt-0.5"
              />
            ) : null}
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
              {formatContentIndex(index)}
            </span>
            {isEditing && !lockDetails ? (
              <p className="text-xs font-medium text-muted-foreground">
                {isDraft ? "New content" : "Editing content"}
              </p>
            ) : (
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {content.item_name}
                </h3>
                {content.moved_to_post_id ? (
                  <p className="mt-0.5 text-[11px] font-medium text-primary">
                    Moved to postings calendar
                  </p>
                ) : null}
              </div>
            )}
          </div>
          {!isEditing ? <ApprovalStatusBadge status={overallStatus} /> : null}
        </header>

        <div className="space-y-4 px-4 py-4 sm:px-5">
          {isEditing && !lockDetails ? (
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
              Content pillar
            </p>
            {isEditing && !lockDetails ? (
              <input
                value={contentPillar}
                onChange={(e) => setContentPillar(e.target.value)}
                className={cn(formFieldClassName, "mt-0")}
                placeholder="2–4 words"
                maxLength={CONTENT_PILLAR_MAX_LENGTH}
                disabled={isSaving}
              />
            ) : content.content_pillar ? (
              <p className="text-sm text-foreground">{content.content_pillar}</p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No content pillar yet.
              </p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Shoot date
            </p>
            {isEditing && !lockDetails ? (
              <DatePicker
                value={shootDate}
                onChange={setShootDate}
                placeholder="Select shoot date"
                clearable
                onClear={() => setShootDate("")}
                disabled={isSaving}
              />
            ) : shootDateLabel ? (
              <p className="text-sm text-foreground">{shootDateLabel}</p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No shoot date yet.
              </p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Context description
            </p>
            {isEditing && !lockDetails ? (
              <textarea
                value={contextDescription}
                onChange={(e) => setContextDescription(e.target.value)}
                rows={CONTENT_CONTEXT_PREVIEW_LINES}
                className={cn(formFieldClassName, "mt-0 resize-y")}
                placeholder="Add context for this content..."
                disabled={isSaving}
              />
            ) : content.context_description ? (
              <p
                className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap"
                style={
                  expandDetails
                    ? undefined
                    : {
                        display: "-webkit-box",
                        WebkitLineClamp: CONTENT_CONTEXT_PREVIEW_LINES,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }
                }
              >
                {content.context_description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No context yet.
              </p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Script
            </p>
            {isEditing && !lockDetails ? (
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
                style={
                  expandDetails
                    ? undefined
                    : {
                        display: "-webkit-box",
                        WebkitLineClamp: CONTENT_SCRIPT_PREVIEW_LINES,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }
                }
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
            {isEditing && !lockDetails ? (
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Post type
              </p>
              {isEditing && !lockDetails ? (
                <PostTypeSelect
                  value={postType}
                  onChange={setPostType}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm text-foreground">
                  {postTypeLabels[content.post_type || DEFAULT_POST_TYPE]}
                </p>
              )}
            </div>
            <div>
              {isEditing && !lockDetails ? (
                <SocialsSelect
                  value={socials}
                  onChange={setSocials}
                  disabled={isSaving}
                />
              ) : (
                <>
                  <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Social platforms
                  </p>
                  {(content.socials ?? []).length > 0 ? (
                    <p className="text-sm text-foreground">
                      {(content.socials ?? []).join(", ")}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/60 italic">
                      None selected
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Shoot notes
            </p>
            {isEditing && !lockDetails ? (
              <textarea
                value={shootNotes}
                onChange={(e) => setShootNotes(e.target.value)}
                rows={3}
                className={cn(formFieldClassName, "mt-0 resize-y")}
                placeholder="Notes for this shoot (before or after)..."
                disabled={isSaving}
              />
            ) : content.shoot_notes ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {content.shoot_notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic">
                No shoot notes yet.
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ApprovalField
              label="Manager/Admin"
              status={managerApproval}
              canChange={canEditManagerApproval}
              disabled={isSaving}
              onChange={(status) => {
                void handleApprovalChange("manager", status);
              }}
            />
            <ApprovalField
              label="Shoot Incharge"
              status={shootInchargeApproval}
              canChange={canEditShootInchargeApproval}
              disabled={isSaving}
              onChange={(status) => {
                void handleApprovalChange("shootIncharge", status);
              }}
            />
            <ApprovalField
              label="Client"
              status={clientApproval}
              canChange={canEditClientApproval}
              disabled={isSaving}
              onChange={(status) => {
                void handleApprovalChange("client", status);
              }}
            />
          </div>

          {canEditShootCompleted ? (
            <div
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5",
                !canToggleShootCompleted && !content.shoot_completed && "opacity-60",
              )}
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Shoot completed
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {allApprovalsDone
                    ? "Confirm after the shoot is done."
                    : "Available once all three approvals are approved."}
                </p>
              </div>
              <Switch
                checked={isEditing ? shootCompleted : content.shoot_completed}
                onCheckedChange={handleShootCompletedChange}
                disabled={isSaving || !canToggleShootCompleted}
                aria-label="Shoot completed"
              />
            </div>
          ) : content.shoot_completed ? (
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Shoot completed
              </p>
              <p className="mt-1 text-sm text-foreground">Yes</p>
            </div>
          ) : null}
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
                  disabled={isSaving || (!lockDetails && !itemName.trim())}
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
                {showMutations ? (
                  <>
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
                ) : null}
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

      <ConfirmationModal
        open={shootConfirmOpen}
        onOpenChange={setShootConfirmOpen}
        title={
          pendingShootCompleted
            ? "Mark shoot completed?"
            : "Clear shoot completed?"
        }
        description={
          pendingShootCompleted
            ? `Confirm that the shoot for "${content.item_name}" is done.`
            : `Mark "${content.item_name}" as not completed? Shoot notes are kept.`
        }
        confirmLabel={pendingShootCompleted ? "Mark completed" : "Clear"}
        confirmVariant={pendingShootCompleted ? "default" : "destructive"}
        loading={isSaving}
        onConfirm={() => void confirmShootCompletedChange()}
      />
    </>
  );
}

type ApprovalFieldProps = {
  label: string;
  status: ProductionPlanApprovalStatus;
  canChange: boolean;
  disabled: boolean;
  onChange: (status: ProductionPlanApprovalStatus) => void;
};

function ApprovalField({
  label,
  status,
  canChange,
  disabled,
  onChange,
}: ApprovalFieldProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5",
        canChange && disabled && "opacity-60",
      )}
    >
      <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      {canChange ? (
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
