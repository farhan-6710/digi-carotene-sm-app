import type { ReactNode } from "react";

export type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export type PageHeaderProps = {
  heading?: string;
  description?: string;
  backButton?: ReactNode;
  actions?: ReactNode;
};

export type StatsCardsProps = {
  cards: import("@/shared/types/statsCards").StatCardItem[];
  isLoading?: boolean;
};
