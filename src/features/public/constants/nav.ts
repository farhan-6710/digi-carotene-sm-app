import { AUTH_FORM_TYPES } from "@/features/auth/constants/auth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";

export const publicNavLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/#services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/#contact" },
] as const;

export const AUTH_DASHBOARD_LINK = {
  label: "Dashboard",
  to: buildAuthUrl({ formType: AUTH_FORM_TYPES.login }),
} as const;

export const HEADER_SCROLL_THRESHOLD_PX = 20;
