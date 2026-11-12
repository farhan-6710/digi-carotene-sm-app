/** Evenly spaced axis labels so every data point stays hoverable via the tooltip. */
export function pickChartAxisTicks(labels: string[], maxTicks: number): string[] {
  if (labels.length === 0) return [];
  if (labels.length <= maxTicks) return labels;

  const lastIndex = labels.length - 1;
  const step = lastIndex / (maxTicks - 1);
  const picked = new Set<number>();

  for (let i = 0; i < maxTicks; i += 1) {
    picked.add(Math.round(i * step));
  }
  picked.add(0);
  picked.add(lastIndex);

  return [...picked]
    .sort((a, b) => a - b)
    .map((index) => labels[index]!);
}
