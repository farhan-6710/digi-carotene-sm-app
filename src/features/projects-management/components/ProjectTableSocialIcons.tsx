import type { ProjectSocials } from "@/features/projects-management/types/types";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/features/clients-management/constants/socialIcons";

type ProjectTableSocialIconsProps = {
  socials: ProjectSocials | null;
};

const iconMap = [
  { key: "facebook" as const, Icon: FacebookIcon },
  { key: "instagram" as const, Icon: InstagramIcon },
  { key: "linkedin" as const, Icon: LinkedinIcon },
  { key: "youtube" as const, Icon: YoutubeIcon },
];

export function ProjectTableSocialIcons({ socials }: ProjectTableSocialIconsProps) {
  const activeIcons = iconMap.filter(({ key }) => socials?.[key]?.trim());

  if (activeIcons.length === 0) {
    return <span className="text-muted-foreground/50">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {activeIcons.map(({ key, Icon }) => (
        <Icon key={key} className="size-4 text-muted-foreground" />
      ))}
    </div>
  );
}
