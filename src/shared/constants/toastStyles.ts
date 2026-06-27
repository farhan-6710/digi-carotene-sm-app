import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  type LucideIcon,
} from "lucide-react";

export type ToastType = "success" | "error" | "info";

type ToastStyleConfig = {
  icon: LucideIcon;
  toastClassName: string;
  iconClassName: string;
};

export const toastStyleByType: Record<ToastType, ToastStyleConfig> = {
  success: {
    icon: CircleCheckIcon,
    toastClassName:
      "border-status-posted/40 bg-card text-foreground shadow-md",
    iconClassName: "text-status-posted",
  },
  error: {
    icon: OctagonXIcon,
    toastClassName:
      "border-destructive/40 bg-card text-foreground shadow-md",
    iconClassName: "text-destructive",
  },
  info: {
    icon: InfoIcon,
    toastClassName:
      "border-primary/30 bg-card text-foreground shadow-md",
    iconClassName: "text-primary",
  },
};
