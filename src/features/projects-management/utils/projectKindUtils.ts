export type ProjectKind = "sm" | "dev";

const SM_PREFIX = "sm:";
const DEV_PREFIX = "dev:";

export function encodeProjectKey(kind: ProjectKind, id: string): string {
  return `${kind === "sm" ? SM_PREFIX : DEV_PREFIX}${id}`;
}

export function parseProjectKey(
  value: string,
): { kind: ProjectKind; id: string } | null {
  if (value.startsWith(SM_PREFIX)) {
    const id = value.slice(SM_PREFIX.length);
    return id ? { kind: "sm", id } : null;
  }
  if (value.startsWith(DEV_PREFIX)) {
    const id = value.slice(DEV_PREFIX.length);
    return id ? { kind: "dev", id } : null;
  }
  return null;
}

export function projectKindLabel(kind: ProjectKind): string {
  return kind === "sm" ? "Social media" : "Development";
}
