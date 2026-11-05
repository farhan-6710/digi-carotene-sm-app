/** Build a compact page list with ellipsis markers (`"ellipsis"`). */
export function buildPaginationItems(
  page: number,
  pageCount: number,
): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];

  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) items.push("ellipsis");
  for (let value = start; value <= end; value += 1) {
    items.push(value);
  }
  if (end < pageCount - 1) items.push("ellipsis");

  items.push(pageCount);
  return items;
}
