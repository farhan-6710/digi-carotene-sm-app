import { HomeServiceCard } from "@/features/public/components/home/HomeServiceCard";
import { PublicSection } from "@/features/public/components/PublicSection";
import { PublicSectionHeader } from "@/features/public/components/PublicSectionHeader";
import { servicesData, servicesSectionContent } from "@/features/public/constants/services";

export function HomeServicesSection() {
  return (
    <PublicSection
      id="services"
      className="relative border-b border-border bg-card/20 py-20 lg:py-32"
    >
      <PublicSectionHeader
        badge={servicesSectionContent.badge}
        title={servicesSectionContent.title}
        description={servicesSectionContent.description}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {servicesData.map((service, index) => (
          <HomeServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>
    </PublicSection>
  );
}
