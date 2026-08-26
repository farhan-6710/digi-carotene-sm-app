import { type KeyboardEvent } from "react";
import { useNavigate } from "react-router";

import type { DirectoryTableRowProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";

/**
 * Clickable directory listing row — whole row opens `to`, with hover + pointer.
 * Use `stopDirectoryRowNav` on action buttons and nested interactive links.
 */
export function DirectoryTableRow({
  to,
  className,
  children,
}: DirectoryTableRowProps) {
  const navigate = useNavigate();

  const go = () => navigate(to);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      go();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        className,
      )}
      onClick={go}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
