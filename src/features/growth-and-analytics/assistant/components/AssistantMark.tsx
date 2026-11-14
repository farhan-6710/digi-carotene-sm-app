import { cn } from "@/shared/lib/utils";

import type { AssistantMarkProps } from "../types/components";

/** Pulse mark: dial ring with a running arc and a wave across the middle. */
export function AssistantMark({ className, active = false }: AssistantMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1.4"
      />
      <g className={cn(active && "animate-orbit")}>
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="22" cy="12" r="1.5" fill="currentColor" />
      </g>
      <path
        d="M6 13.4c1.3 0 1.8-3.4 3.4-3.4s2.1 5 3.8 5 2.1-3.4 3.4-3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
