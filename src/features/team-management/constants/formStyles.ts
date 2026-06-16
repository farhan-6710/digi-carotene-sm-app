import { cn } from "@/shared/lib/utils";

export const formFieldClassName = cn(
  "mt-2 w-full rounded-lg border border-ring/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors",
  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
  "dark:border-input dark:bg-muted/40",
);
