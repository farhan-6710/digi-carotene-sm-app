import {
  SOCIAL_PLATFORM_BUTTON_BASE_CLASS,
  SOCIAL_PLATFORM_INACTIVE_CLASS,
  SOCIAL_PLATFORMS,
  type SocialLinkMap,
} from "@/shared/constants/socialPlatforms";
import type { SocialPlatformButtonsProps } from "@/shared/types/components";
import { cn } from "@/shared/lib/utils";
import { formatSocialUrl } from "@/shared/utils/formatSocialUrl";

export function SocialPlatformButtons({
  socials,
  className,
}: SocialPlatformButtonsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {SOCIAL_PLATFORMS.map(({ key, label, Icon, activeClassName }) => {
        const url = socials?.[key]?.trim();
        const isLinked = Boolean(url);

        const buttonClassName = cn(
          SOCIAL_PLATFORM_BUTTON_BASE_CLASS,
          isLinked ? activeClassName : SOCIAL_PLATFORM_INACTIVE_CLASS,
        );

        const icon = <Icon className="size-4" aria-hidden="true" />;

        if (isLinked && url) {
          return (
            <a
              key={key}
              href={formatSocialUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName}
              aria-label={`Open ${label} profile`}
              title={label}
            >
              {icon}
            </a>
          );
        }

        return (
          <span
            key={key}
            className={buttonClassName}
            aria-label={`${label} — not linked`}
            title={`${label} — not linked`}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}

export type { SocialLinkMap };
