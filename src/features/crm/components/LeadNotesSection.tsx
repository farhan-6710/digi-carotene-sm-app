import { useState } from "react";
import { format } from "date-fns";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import type { LeadNotesSectionProps } from "@/features/crm/types/components";
import type { LeadNote } from "@/features/crm/types/types";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function LeadNotesSection({
  notes,
  canEdit,
  isSaving = false,
  onAdd,
  onSave,
  onDelete,
}: LeadNotesSectionProps) {
  const [draft, setDraft] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const startEdit = (note: LeadNote) => {
    setEditingNoteId(note.id);
    setEditDraft(note.body);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditDraft("");
  };

  const handleAdd = async () => {
    if (!draft.trim()) return;
    try {
      await onAdd(draft);
      setDraft("");
    } catch {
      // Caller toasts.
    }
  };

  const handleSaveEdit = async () => {
    const note = notes.find((row) => row.id === editingNoteId);
    if (!note || !editDraft.trim()) return;
    try {
      await onSave(note, editDraft);
      cancelEdit();
    } catch {
      // Caller toasts.
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Notes
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Keep follow-up context on this lead.
        </p>
      </div>

      <div className="space-y-4 px-6 py-5">
        {canEdit ? (
          <div className="space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={isSaving}
              placeholder="Write a note…"
              className={cn(formFieldClassName, "min-h-20 resize-none")}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                disabled={isSaving || !draft.trim()}
                onClick={() => void handleAdd()}
              >
                {isSaving && !editingNoteId ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Add note
              </Button>
            </div>
          </div>
        ) : null}

        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => {
              const isEditing = editingNoteId === note.id;
              return (
                <li
                  key={note.id}
                  className="rounded-xl border border-border bg-muted/20 px-4 py-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      {format(new Date(note.updated_at), "MMM d, yyyy · h:mm a")}
                    </span>
                    {canEdit && !isEditing ? (
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={isSaving}
                          onClick={() => startEdit(note)}
                          aria-label="Edit note"
                        >
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={isSaving}
                          onClick={() => setPendingDeleteId(note.id)}
                          aria-label="Delete note"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editDraft}
                        onChange={(event) => setEditDraft(event.target.value)}
                        disabled={isSaving}
                        className={cn(formFieldClassName, "min-h-20 resize-none")}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSaving}
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          disabled={isSaving || !editDraft.trim()}
                          onClick={() => void handleSaveEdit()}
                        >
                          {isSaving ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : null}
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-foreground">
                      {note.body}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmationModal
        open={Boolean(pendingDeleteId)}
        onOpenChange={(open) => {
          if (!open && !isSaving) setPendingDeleteId(null);
        }}
        title="Delete note?"
        description="This removes the note from this lead. This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={isSaving}
        onConfirm={async () => {
          if (!pendingDeleteId) return;
          await onDelete(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </div>
  );
}
