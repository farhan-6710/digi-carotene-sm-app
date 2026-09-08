import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ProductionPlanContentCard } from "@/features/production-planner/components/ProductionPlanContentCard";
import { useProductionPlanLightbox } from "@/features/production-planner/hooks/useProductionPlanLightbox";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";

function isFormFieldTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(
      "input, textarea, select, button, a, [role='checkbox'], [data-slot='checkbox'], [data-slot='switch'], [contenteditable='true']",
    ),
  );
}

export function ProductionPlanContentLightbox() {
  const { items, activeIndex, isOpen, close, actions } =
    useProductionPlanLightbox();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    watchDrag: (_api, event) => !isFormFieldTarget(event.target),
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!isOpen || activeIndex === null || !emblaApi) return;
    emblaApi.scrollTo(activeIndex, true);
  }, [activeIndex, emblaApi, isOpen]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isFormFieldTarget(event.target)) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, scrollNext, scrollPrev]);

  const handleDelete = useCallback(
    async (id: string) => {
      await actions.onDelete(id);
      // If this was the last item, provider closes via items effect.
      if (items.length <= 1) {
        close();
      }
    },
    [actions, close, items.length],
  );

  if (items.length === 0) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex h-[90vh] w-[90vw] max-w-none! flex-col gap-0 overflow-hidden border-0 bg-background p-0 shadow-none sm:max-w-none!",
        )}
      >
        <DialogTitle className="sr-only">Content preview</DialogTitle>
        <DialogDescription className="sr-only">
          Preview and edit production plan content. Use left and right arrows to
          navigate when not editing a field.
        </DialogDescription>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="mb-3 flex shrink-0 items-center justify-between gap-3 px-3 pt-3">
            <p className="text-xs font-medium text-muted-foreground">
              {selectedIndex + 1} / {items.length}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-8 rounded-full shadow-sm"
              onClick={close}
              aria-label="Close preview"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
              {items.map((content, index) => (
                <div
                  key={content.id}
                  className="min-h-0 min-w-0 shrink-0 grow-0 basis-full px-3 pb-3"
                >
                  <div className="h-full overflow-y-auto rounded-2xl bg-background">
                    <ProductionPlanContentCard
                      content={content}
                      index={index}
                      canEdit={actions.canEdit}
                      canEditManagerApproval={actions.canEditManagerApproval}
                      canEditShootInchargeApproval={
                        actions.canEditShootInchargeApproval
                      }
                      canEditClientApproval={actions.canEditClientApproval}
                      canEditShootCompleted={actions.canEditShootCompleted}
                      lockDetails={actions.lockDetails}
                      showMutations={actions.showMutations}
                      onSave={actions.onSave}
                      onDuplicate={actions.onDuplicate}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-1/2 left-0 z-10 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-md sm:left-2 sm:translate-x-0"
                onClick={scrollPrev}
                aria-label="Previous content"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-1/2 right-0 z-10 size-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-md sm:right-2 sm:translate-x-0"
                onClick={scrollNext}
                aria-label="Next content"
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
