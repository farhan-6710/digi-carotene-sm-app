import type { BackfillProgress } from "../types/types";

export type BackfillProgressOptions = {
  onProgress?: (progress: BackfillProgress) => void;
  signal?: AbortSignal;
};

export function assertBackfillNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("Refetch cancelled.", "AbortError");
  }
}

export function reportBackfillProgress(
  options: BackfillProgressOptions | undefined,
  progress: BackfillProgress,
): void {
  options?.onProgress?.(progress);
}
