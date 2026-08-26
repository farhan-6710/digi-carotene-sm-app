import type { MouseEvent } from "react";

/** Stop row navigation for edit buttons and nested links. */
export function stopDirectoryRowNav(event: MouseEvent) {
  event.stopPropagation();
}
