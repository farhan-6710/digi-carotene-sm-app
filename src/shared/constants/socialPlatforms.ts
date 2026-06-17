import type { ComponentType, SVGProps } from "react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/shared/constants/socialIcons";

export type SocialPlatformKey =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube";

export type SocialLinkMap = Partial<Record<SocialPlatformKey, string>>;

type SocialPlatformConfig = {
  key: SocialPlatformKey;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  activeClassName: string;
};

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    key: "facebook",
    label: "Facebook",
    Icon: FacebookIcon,
    activeClassName:
      "border-[#1877F2]/35 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20",
  },
  {
    key: "instagram",
    label: "Instagram",
    Icon: InstagramIcon,
    activeClassName:
      "border-[#E4405F]/35 bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    Icon: LinkedinIcon,
    activeClassName:
      "border-[#0A66C2]/35 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20",
  },
  {
    key: "youtube",
    label: "YouTube",
    Icon: YoutubeIcon,
    activeClassName:
      "border-[#FF0000]/35 bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000]/20",
  },
];

export const SOCIAL_PLATFORM_INACTIVE_CLASS =
  "border-border/60 bg-muted/40 text-muted-foreground/40";

export const SOCIAL_PLATFORM_BUTTON_BASE_CLASS =
  "inline-flex size-8 items-center justify-center rounded-md border transition-colors";
