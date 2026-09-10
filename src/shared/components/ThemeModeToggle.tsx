import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/providers/ThemeProvider";
import type { ThemeModeToggleProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ThemeModeToggle({ className }: ThemeModeToggleProps) {
  const { isDarkMode, setDarkMode } = useTheme();

  return (
    <div
      className={cn(
        "inline-flex gap-1 rounded-full border border-border bg-muted/30 p-1",
        className,
      )}
      role="group"
      aria-label="Color mode"
    >
      <Button
        type="button"
        size="sm"
        variant={isDarkMode ? "ghost" : "default"}
        className={cn(
          "h-8 gap-1.5 rounded-full px-3 text-xs",
          isDarkMode && "text-muted-foreground",
        )}
        aria-pressed={!isDarkMode}
        aria-label="Light mode"
        onClick={() => setDarkMode(false)}
      >
        <Sun className="size-3.5" aria-hidden />
        Light
      </Button>
      <Button
        type="button"
        size="sm"
        variant={isDarkMode ? "default" : "ghost"}
        className={cn(
          "h-8 gap-1.5 rounded-full px-3 text-xs",
          !isDarkMode && "text-muted-foreground",
        )}
        aria-pressed={isDarkMode}
        aria-label="Dark mode"
        onClick={() => setDarkMode(true)}
      >
        <Moon className="size-3.5" aria-hidden />
        Dark
      </Button>
    </div>
  );
}
