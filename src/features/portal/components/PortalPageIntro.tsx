/** Standard heading for portal pages (dashboard uses PortalPageHeader instead). */
import type { PortalPageIntroProps } from "@/features/portal/types/components";
export function PortalPageIntro({ title, description }: PortalPageIntroProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
