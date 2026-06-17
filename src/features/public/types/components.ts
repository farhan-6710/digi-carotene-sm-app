import type { ReactNode } from "react";

import type { ContactFormData, PortalCardItem, ServiceItem } from "@/features/public/types/types";

export type PublicSectionHeaderProps = {
  badge: string;
  badgeVariant?: "primary" | "accent";
  title: string;
  description: string;
  align?: "left" | "center";
};

export type PublicSectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
};

export type PublicSectionBadgeProps = {
  label: string;
  variant?: "primary" | "accent";
  icon?: ReactNode;
};

export type HomeContactFormProps = {
  formData: ContactFormData;
  isSubmitting: boolean;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export type HeroChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { day: string };
  }>;
};

export type PublicHeaderNavProps = {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, to: string) => void;
};

export type PublicHeaderMobileMenuProps = {
  isOpen: boolean;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, to: string) => void;
};

export type HomeServiceCardProps = {
  service: ServiceItem;
  index: number;
};

export type HomePortalCardProps = {
  portal: PortalCardItem;
};
