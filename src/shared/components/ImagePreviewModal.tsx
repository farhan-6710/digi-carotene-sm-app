import type { ImagePreviewModalProps } from "@/shared/types/components";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";

export function ImagePreviewModal({
  open,
  onOpenChange,
  src,
  alt = "Image preview",
}: ImagePreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(100vw-2rem,48rem)]! gap-0 overflow-hidden border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(100vw-2rem,48rem)]!">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] w-full rounded-xl bg-card object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
