import type { Location, NavigateFunction } from "react-router";

/**
 * After deleting a detail entity, go one history step back when the user
 * arrived via in-app navigation. Otherwise replace with a safe fallback
 * (e.g. deep-linked or refreshed detail page has no prior SPA entry).
 */
export function navigateBackOrFallback(
  navigate: NavigateFunction,
  location: Location,
  fallbackPath: string,
): void {
  if (location.key !== "default") {
    navigate(-1);
    return;
  }
  navigate(fallbackPath, { replace: true });
}
