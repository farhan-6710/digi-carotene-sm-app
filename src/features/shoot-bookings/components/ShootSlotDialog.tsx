import { ShootTimeGrid } from "@/features/shoot-bookings/components/ShootTimeGrid";
import type { ShootSlotDialogProps } from "@/features/shoot-bookings/types/components";
import {
  formatClock,
  formatDuration,
  formatShootDate,
  getBookableRange,
  isDateBookable,
} from "@/features/shoot-bookings/utils/shootSlotUtils";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { ComboBox } from "@/shared/ui/ComboBox";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { parseUrlDateParam, serializeUrlDate } from "@/shared/utils/urlDateParams";

export function ShootSlotDialog({
  open,
  onOpenChange,
  values,
  onFieldChange,
  startOptions,
  endOptions,
  busy,
  planOptions,
  isLoadingSlots,
  slotsError,
  isSaving,
  onConfirm,
}: ShootSlotDialogProps) {
  const { first, last } = getBookableRange();
  const canConfirm = values.date && values.start && values.end && !isLoadingSlots;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-lg! flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Book a shoot slot</DialogTitle>
          <DialogDescription>
            Pick a date, then choose when the shoot starts and ends. Taken times are hidden.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-1 pr-1">
          <div className="flex justify-center rounded-xl border border-border/60">
            <Calendar
              mode="single"
              selected={parseUrlDateParam(values.date)}
              onSelect={(date) => date && onFieldChange("date", serializeUrlDate(date))}
              startMonth={parseUrlDateParam(first)}
              endMonth={parseUrlDateParam(last)}
              disabled={(date) => isSaving || !isDateBookable(serializeUrlDate(date), busy)}
            />
          </div>

          {slotsError ? (
            <p className="text-xs text-destructive">Slots could not load: {slotsError}</p>
          ) : null}

          {values.date ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">
                {formatShootDate(values.date)}
                {isLoadingSlots ? (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">Loading…</span>
                ) : null}
              </p>
              <ShootTimeGrid
                label="Start time *"
                times={startOptions}
                selected={values.start}
                onSelect={(time) => onFieldChange("start", time)}
                emptyMessage="No open start times on this date. Pick another date."
                disabled={isSaving}
              />
              {values.start ? (
                <ShootTimeGrid
                  label="End time *"
                  times={endOptions}
                  selected={values.end}
                  onSelect={(time) => onFieldChange("end", time)}
                  emptyMessage="No end time fits before the next booking."
                  disabled={isSaving}
                />
              ) : null}
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Select a highlighted date to see open times.
            </p>
          )}

          {planOptions.length > 0 ? (
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-muted-foreground">
                Production plan (optional)
              </span>
              <ComboBox
                value={values.planId}
                onChange={(val) => onFieldChange("planId", val)}
                options={planOptions}
                placeholder="Link this shoot to a plan..."
                listTitle="Production plans"
                emptyMessage="No production plans yet."
                disabled={isSaving}
              />
            </div>
          ) : null}

          <label className="block text-xs font-semibold text-muted-foreground">
            Notes for the team
            <textarea
              value={values.notes}
              onChange={(e) => onFieldChange("notes", e.target.value)}
              placeholder="Location, products to shoot, people involved..."
              className={formFieldClassName}
              rows={2}
              disabled={isSaving}
            />
          </label>
        </div>

        <DialogFooter className="shrink-0 border-t border-border/60 pt-4 sm:items-center">
          {values.date && values.start && values.end ? (
            <p className="mr-auto text-xs text-muted-foreground">
              {formatClock(values.start)} – {formatClock(values.end)} ·{" "}
              {formatDuration(values.start, values.end)}
            </p>
          ) : null}
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={!canConfirm || isSaving}>
            {isSaving ? "Booking..." : "Confirm slot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
