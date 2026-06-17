import { HomePortalCard } from "@/features/public/components/home/HomePortalCard";
import { PublicSection } from "@/features/public/components/PublicSection";
import { PublicSectionHeader } from "@/features/public/components/PublicSectionHeader";
import { portalCards, portalsSectionContent } from "@/features/public/constants/portals";

export function HomePortalsSection() {
  return (
    <PublicSection id="portals" className="border-b border-border py-20 lg:py-32">
      <PublicSectionHeader
        badge={portalsSectionContent.badge}
        badgeVariant="accent"
        title={portalsSectionContent.title}
        description={portalsSectionContent.description}
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {portalCards.map((portal) => (
          <HomePortalCard key={portal.id} portal={portal} />
        ))}
      </div>
    </PublicSection>
  );
}
