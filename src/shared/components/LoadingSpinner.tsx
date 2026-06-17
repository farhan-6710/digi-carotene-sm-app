import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type {
  CenteredLoadingProps,
  LoadingSpinnerProps,
  TableLoadingStateProps,
} from "@/shared/types/components";

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function CenteredLoading({ className }: CenteredLoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-dvh items-center justify-center bg-background text-foreground",
        className,
      )}
    >
      <LoadingSpinner />
    </div>
  );
}

export function TableLoadingState({ minHeight = 240 }: TableLoadingStateProps) {
  return (
    <div
      className="flex items-center justify-center px-6 py-10"
      style={{ minHeight }}
    >
      <LoadingSpinner />
    </div>
  );
}
