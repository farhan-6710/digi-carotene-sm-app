/** Trims and collapses whitespace for a user-entered tag. */
export function normalizeTagInput(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function isDuplicateTag(tags: string[], candidate: string): boolean {
  const normalized = candidate.toLowerCase();
  return tags.some((tag) => tag.toLowerCase() === normalized);
}
