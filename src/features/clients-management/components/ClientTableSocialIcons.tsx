import type { ClientSocials } from "@/features/clients-management/types/types";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/features/clients-management/constants/socialIcons";
import { formatSocialUrl } from "@/shared/utils/formatSocialUrl";

type SocialLinkConfig = {
  key: keyof ClientSocials;
  label: string;
  Icon: typeof FacebookIcon;
  activeClassName: string;
};

const socialLinks: SocialLinkConfig[] = [
  {
    key: "facebook",
    label: "Facebook",
    Icon: FacebookIcon,
    activeClassName:
      "border-[#1877F2]/20 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white",
  },
  {
    key: "instagram",
    label: "Instagram",
    Icon: InstagramIcon,
    activeClassName:
      "border-[#E4405F]/20 bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    Icon: LinkedinIcon,
    activeClassName:
      "border-[#0A66C2]/20 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white",
  },
  {
    key: "youtube",
    label: "YouTube",
    Icon: YoutubeIcon,
    activeClassName:
      "border-[#FF0000]/20 bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white",
  },
];

type ClientTableSocialIconsProps = {
  socials: ClientSocials | null;
};

export function ClientTableSocialIcons({ socials }: ClientTableSocialIconsProps) {
  return (
    <div className="flex items-center gap-2">
      {socialLinks.map(({ key, label, Icon, activeClassName }) => {
        const url = socials?.[key];

        if (url) {
          return (
            <a
              key={key}
              href={formatSocialUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center rounded-lg border p-1.5 shadow-xs transition-all ${activeClassName}`}
              title={label}
            >
              <Icon className="size-3.5" />
            </a>
          );
        }

        return (
          <span
            key={key}
            className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-border bg-muted/40 p-1.5 text-muted-foreground/30"
          >
            <Icon className="size-3.5" />
          </span>
        );
      })}
    </div>
  );
}
