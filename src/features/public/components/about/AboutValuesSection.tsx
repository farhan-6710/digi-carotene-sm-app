import { PublicSection } from "@/features/public/components/PublicSection";
import { PublicSectionHeader } from "@/features/public/components/PublicSectionHeader";
import { aboutContent, aboutValuesSectionContent } from "@/features/public/constants/about";
import { getValueIcon } from "@/features/public/utils/publicIcons";

export function AboutValuesSection() {
  return (
    <PublicSection className="border-t border-b border-border/40 bg-card/20 py-20 lg:py-32">
      <PublicSectionHeader
        badge={aboutValuesSectionContent.badge}
        badgeVariant="accent"
        title={aboutValuesSectionContent.title}
        description={aboutValuesSectionContent.description}
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {aboutContent.values.map((value) => {
          const Icon = getValueIcon(value.title);

          return (
            <div
              key={value.title}
              className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:border-accent/30 hover:bg-glow-bg-accent"
            >
              <div className="flex size-10 items-center justify-center rounded-lg border border-accent/20 bg-accent/5 text-accent">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </PublicSection>
  );
}
