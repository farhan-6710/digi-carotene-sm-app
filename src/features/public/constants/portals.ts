import type { PortalCardItem } from "@/features/public/types/types";
import { AUTH_FORM_TYPES } from "@/features/auth/constants/auth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { agencyMeta } from "@/features/public/constants/agency";

export const portalsSectionContent = {
  badge: "Portals",
  title: "Dedicated workspaces for everyone",
  description:
    "Registered brands use the client portal to follow their content schedule. Digi Carotene team use the team portal to manage clients, projects, and posts.",
} as const;

export const portalCards: PortalCardItem[] = [
  {
    id: "client",
    title: agencyMeta.clientPortalLabel,
    subtitle: "For registered brands",
    description:
      "View your content calendar, track post status, and review account details for your brand.",
    features: [
      { icon: "Clock", label: "Scheduled posts and publishing status" },
      { icon: "CheckCircle2", label: "Read-only campaign overview" },
      { icon: "Activity", label: "Account and performance snapshot" },
    ],
    ctaLabel: "Sign in",
    ctaTo: buildAuthUrl(AUTH_FORM_TYPES.login),
    variant: "primary",
  },
  {
    id: "team",
    title: agencyMeta.teamPortalLabel,
    subtitle: "For Digi Carotene team",
    description:
      "Manage clients and projects, schedule posts, assign team members, and run analytics and reports across the agency.",
    features: [
      { icon: "Layers", label: "Clients, projects, and post calendar" },
      { icon: "UserRound", label: "Team roles and project assignments" },
      { icon: "Flame", label: "Analytics, reports, and publishing tools" },
    ],
    ctaLabel: "Sign in",
    ctaTo: buildAuthUrl(AUTH_FORM_TYPES.login),
    variant: "accent",
  },
];
