import type { ShellNavItem } from "@/shared/types/components";
import { routePath } from "@/shared/utils/routePath";

function navItemMatches(activePath: string, itemPath: string): boolean {
  return activePath === itemPath || activePath.startsWith(`${itemPath}/`);
}

export function resolveActiveNavPath(
  activePath: string,
  navItems: ShellNavItem[],
): string | null {
  const matches = navItems.filter((item) =>
    navItemMatches(activePath, routePath(item.to)),
  );

  if (matches.length === 0) {
    return null;
  }

  const bestMatch = matches.reduce((longest, item) =>
    routePath(item.to).length >= routePath(longest.to).length ? item : longest,
  );

  return routePath(bestMatch.to);
}
