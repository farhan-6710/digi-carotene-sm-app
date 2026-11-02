export function formatBulkDeleteMessage(
  count: number,
  singular: string,
  plural: string,
): string {
  const label = count === 1 ? singular : plural;
  return `All these ${count} ${label} will be deleted.`;
}
