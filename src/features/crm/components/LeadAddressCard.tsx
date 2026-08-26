import { useState } from "react";
import { Loader2, MapPin, Pencil } from "lucide-react";

import type { LeadAddressCardProps } from "@/features/crm/types/components";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function LeadAddressCard({
  address,
  canEdit,
  isSaving = false,
  onSave,
}: LeadAddressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const hasAddress = Boolean(address?.trim());

  const startEdit = () => {
    setDraft(address ?? "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(address ?? "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await onSave(draft);
      setIsEditing(false);
    } catch {
      // Toast/error handled by caller.
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Address
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Where this lead can be reached by mail or visit.
          </p>
        </div>
        {canEdit && !isEditing ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={startEdit}
          >
            {hasAddress ? (
              <>
                <Pencil className="mr-1.5 size-3.5" />
                Edit
              </>
            ) : (
              <>
                <MapPin className="mr-1.5 size-3.5" />
                Add address
              </>
            )}
          </Button>
        ) : null}
      </div>

      <div className="px-6 py-5">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={isSaving}
              placeholder="Street, city, state, postal code…"
              className={cn(formFieldClassName, "min-h-24 resize-none")}
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
                disabled={isSaving}
                onClick={() => void handleSave()}
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
            {hasAddress ? address : (
              <span className="text-muted-foreground">No address yet.</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
