import type { PortalCardItem } from "@/features/public/types/types";
import { AUTH_FORM_TYPES } from "@/features/auth/constants/auth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";

export const portalsSectionContent = {
  badge: "Access Points",
  title: "Dedicated workspaces for everyone",
  description:
    "Whether you are a registered brand tracking your campaigns or a Digi Carotene specialist managing schedules, we have a tailored workspace for you.",
} as const;

export const portalCards: PortalCardItem[] = [
  {
    id: "client",
    title: "Client Portal",
    subtitle: "For registered brands",
    description:
      "Log in to view your social media calendar, review and approve draft posts, track real-time publishing performance, and download campaign reports.",
    features: [
      { icon: "Clock", label: "Real-time calendar & post scheduling" },
      { icon: "CheckCircle2", label: "One-click content approvals" },
      { icon: "Activity", label: "Analytics & performance metrics" },
    ],
    ctaLabel: "Dashboard",
    ctaTo: buildAuthUrl(AUTH_FORM_TYPES.login),
    variant: "primary",
  },
  {
    id: "team",
    title: "Team Portal",
    subtitle: "For agency specialists",
    description:
      "Log in to manage client accounts, schedule and publish content, assign team members to client workloads, and analyze campaign performance metrics.",
    features: [
      { icon: "Layers", label: "Multi-client campaign management" },
      { icon: "UserRound", label: "Team workload & assignment tracking" },
      { icon: "Flame", label: "Advanced publishing tools & analytics" },
    ],
    ctaLabel: "Dashboard",
    ctaTo: buildAuthUrl(AUTH_FORM_TYPES.login),
    variant: "accent",
  },
];
