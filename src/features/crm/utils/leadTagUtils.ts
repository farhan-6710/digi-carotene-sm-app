export function formatLeadTags(tags: string[]): string {
  if (tags.length === 0) {
    return "—";
  }

  return tags.join(", ");
}
