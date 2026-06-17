import type { ProjectSocials } from "@/features/projects-management/types/types";
import { SocialPlatformButtons } from "@/shared/components/SocialPlatformButtons";

type ProjectTableSocialIconsProps = {
  socials: ProjectSocials | null;
};

export function ProjectTableSocialIcons({ socials }: ProjectTableSocialIconsProps) {
  return <SocialPlatformButtons socials={socials} />;
}
