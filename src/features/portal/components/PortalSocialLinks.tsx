import type { ProjectListItem } from "@/features/projects-management/types/types";
import type { ProjectSocials } from "@/features/projects-management/types/types";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/features/clients-management/constants/socialIcons";
import { formatSocialUrl } from "@/shared/utils/formatSocialUrl";
import type { PortalSocialLinksProps } from "@/features/portal/types/components";

const socialEntries = [
  { key: "instagram" as const, label: "Instagram", Icon: InstagramIcon },
  { key: "facebook" as const, label: "Facebook", Icon: FacebookIcon },
  { key: "linkedin" as const, label: "LinkedIn", Icon: LinkedinIcon },
  { key: "youtube" as const, label: "YouTube", Icon: YoutubeIcon },
];

function mergeProjectSocials(projects: ProjectListItem[]): ProjectSocials {
  const merged: ProjectSocials = {};

  for (const project of projects) {
    for (const { key } of socialEntries) {
      const url = project.socials?.[key]?.trim();
      if (url && !merged[key]) {
        merged[key] = url;
      }
    }
  }

  return merged;
}

export function PortalSocialLinks({ projects }: PortalSocialLinksProps) {
  const socials = mergeProjectSocials(projects);
  const links = socialEntries
    .map(({ key, label, Icon }) => {
      const url = socials[key];
      if (!url?.trim()) return null;
      return { label, Icon, href: formatSocialUrl(url) };
    })
    .filter(Boolean) as {
    label: string;
    Icon: typeof InstagramIcon;
    href: string;
  }[];

  if (links.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No social profiles on file yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted/60"
        >
          <span className="flex size-7 items-center justify-center rounded-lg border border-border bg-card">
            <Icon className="size-4" />
          </span>
          {label}
        </a>
      ))}
    </div>
  );
}
