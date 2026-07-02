import { roundOff } from "@/shared/utils/roundOff";

export function formatCompact(value: number): string {
  return roundOff(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCurrency(value: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

// `yyyy-MM-dd` → "Jan" (parsed as local time to avoid timezone drift).
export function monthLabel(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleString("en-US", {
    month: "short",
  });
}

// `yyyy-MM-dd` → "Jan 5".
export function dayLabel(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatCampaignObjective(objective: string | null): string {
  if (!objective) return "—";
  return objective
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
