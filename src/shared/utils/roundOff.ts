function countDigits(value: number): number {
  const abs = Math.abs(value);
  if (abs < 1) return 1;
  return Math.floor(Math.log10(abs)) + 1;
}

/** Full number up to 4 digits; compact notation (e.g. 2.3M) beyond that. */
export function roundOff(value: number): string {
  if (!Number.isFinite(value)) return "0";

  if (countDigits(value) <= 4) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
