import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/features/admin-shell/providers/ThemeProvider";
import { Switch } from "@/shared/ui/switch";

export function PublicThemeToggle() {
  const { isDarkMode, setDarkMode } = useTheme();

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Sun className="size-4" aria-hidden="true" />
      <Switch
        checked={isDarkMode}
        onCheckedChange={setDarkMode}
        aria-label="Toggle dark mode"
        className="cursor-pointer"
      />
      <Moon className="size-4" aria-hidden="true" />
    </div>
  );
}
