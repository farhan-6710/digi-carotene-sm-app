import { toast } from "sonner";

export type ToastType = "success" | "error" | "info";

export function showToast(type: ToastType, message: string) {
  if (type === "error") {
    toast.error(message);
    return;
  }

  if (type === "success") {
    toast.success(message);
    return;
  }

  toast.info(message);
}
