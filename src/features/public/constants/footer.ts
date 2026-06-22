import type { SocialLinkItem } from "@/features/public/types/types";
import { AUTH_FORM_TYPES } from "@/features/auth/constants/auth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";

export const footerCompanyLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/#services" },
  { label: "Contact Us", to: "/#contact" },
] as const;

export const footerPortalLinks = [
  { label: "Dashboard", to: buildAuthUrl({ formType: AUTH_FORM_TYPES.login }) },
] as const;

export const socialLinks: SocialLinkItem[] = [
  { platform: "facebook", href: "https://facebook.com", label: "Facebook" },
  { platform: "instagram", href: "https://instagram.com", label: "Instagram" },
  { platform: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
  { platform: "youtube", href: "https://youtube.com", label: "YouTube" },
];

export const PUBLIC_INPUT_CLASS =
  "mt-2 h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground shadow-xs transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 dark:bg-muted/40 dark:border-input";

export const PUBLIC_TEXTAREA_CLASS =
  "mt-2 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 dark:bg-muted/40 dark:border-input resize-none";
