import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Progress } from "@/shared/ui/progress";

import type { GrowthRefetchModalProps } from "../types/components";

export function GrowthRefetchModal({
  open,
  percent,
  label,
  onCancel,
  footnote,
}: GrowthRefetchModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Refreshing account data</DialogTitle>
          <DialogDescription>
            Pulling the last 90 days and updating this account. This can take a
            few minutes — please keep this tab open.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <Loader2
            className="size-8 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-center text-sm text-muted-foreground">{label}</p>
          <div className="w-full space-y-2">
            <Progress value={percent} />
            <p className="text-center text-sm font-medium tabular-nums">
              {percent}%
            </p>
          </div>
          {footnote ? (
            <p className="text-center text-xs text-muted-foreground">{footnote}</p>
          ) : null}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel refetch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
