export function formatBulkDeleteMessage(
  count: number,
  singular: string,
  plural: string,
): string {
  if (count === 1) {
    return `This ${singular} will be deleted.`;
  }
  return `All these ${count} ${plural} will be deleted.`;
}
