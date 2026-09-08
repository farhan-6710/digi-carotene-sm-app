export type ProjectKind = "sm" | "dev" | "other";

const SM_PREFIX = "sm:";
const DEV_PREFIX = "dev:";
const OTHER_PREFIX = "other:";

export function encodeProjectKey(kind: ProjectKind, id: string): string {
  if (kind === "sm") return `${SM_PREFIX}${id}`;
  if (kind === "dev") return `${DEV_PREFIX}${id}`;
  return `${OTHER_PREFIX}${id}`;
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
  if (value.startsWith(OTHER_PREFIX)) {
    const id = value.slice(OTHER_PREFIX.length);
    return id ? { kind: "other", id } : null;
  }
  return null;
}

export function projectKindLabel(kind: ProjectKind): string {
  if (kind === "sm") return "Social media";
  if (kind === "dev") return "Development";
  return "Other";
}
