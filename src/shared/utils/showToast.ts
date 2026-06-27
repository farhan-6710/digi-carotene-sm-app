import { createElement } from "react";
import { toast, type ExternalToast } from "sonner";

import {
  toastStyleByType,
  type ToastType,
} from "@/shared/constants/toastStyles";

export type { ToastType };

export function showToast(
  type: ToastType,
  message: string,
  options?: ExternalToast,
) {
  const style = toastStyleByType[type];
  const icon = createElement(style.icon, {
    className: `size-4 shrink-0 ${style.iconClassName}`,
  });

  const toastOptions: ExternalToast = {
    icon,
    classNames: {
      toast: style.toastClassName,
      title: "text-sm font-medium leading-snug",
      description: "text-sm text-muted-foreground",
    },
    ...options,
  };

  if (type === "error") {
    toast.error(message, toastOptions);
    return;
  }

  if (type === "success") {
    toast.success(message, toastOptions);
    return;
  }

  toast.info(message, toastOptions);
}
