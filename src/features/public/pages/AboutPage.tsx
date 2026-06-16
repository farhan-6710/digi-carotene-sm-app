import { Link } from "react-router";
import { aboutContent, agencyStats } from "@/features/public/constants/public";
import { Button } from "@/shared/ui/button";
import {
  Sparkles,
  Award,
  ShieldCheck,
  Heart,
  ArrowRight,
  ArrowLeft,
  Users,
  Layers,
  Activity,
} from "lucide-react";

export function AboutPage() {
  // Map value titles to Lucide icons
  const getValueIcon = (title: string) => {
    if (title.includes("Client")) return Heart;
    if (title.includes("Data")) return Activity;
    return ShieldCheck;
  };

  // Map section titles to Lucide icons
  const getSectionIcon = (title: string) => {
    if (title.includes("approach")) return Sparkles;
    if (title.includes("Who")) return Users;
    return Layers;
  };

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative border-b border-border/40 py-20 lg:py-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
            <Award className="size-3.5" />
            Our Story
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-b from-foreground to-foreground/80">
            {aboutContent.title}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            {aboutContent.intro}
          </p>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="border-b border-border/40 py-12 bg-card/20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {agencyStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/30 bg-card p-6 text-center shadow-xs hover:border-primary/20 transition-colors"
              >
                <div className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sections (Approach, Who we help, Operations) */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-32 space-y-12">
        <div className="grid gap-8 md:grid-cols-3">
          {aboutContent.sections.map((section) => {
            const Icon = getSectionIcon(section.title);
            return (
              <div
                key={section.title}
                className="group relative rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-glow-bg-primary"
              >
                <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Values Section */}
      <section className="border-t border-b border-border/40 py-20 lg:py-32 bg-card/20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl text-left space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
              Our Values
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The principles that drive our work
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              We don&apos;t believe in guesswork. We believe in structured creativity, absolute transparency, and delivering real business outcomes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {aboutContent.values.map((value) => {
              const Icon = getValueIcon(value.title);
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm hover:border-accent/30 hover:bg-glow-bg-accent transition-all duration-300"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-accent/20 bg-accent/5 text-accent">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="relative py-20 lg:py-28 bg-card/50">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center gap-6 px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to experience the Digi Carotene difference?
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
            Get in touch with our team for custom services, or log in to your dedicated portal to manage campaign schedules and publishing performance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild variant="outline" className="rounded-full px-6 py-5 font-semibold hover:bg-muted/50 transition-colors">
              <Link to="/" className="flex items-center gap-1.5">
                <ArrowLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="rounded-full px-6 py-5 font-semibold shadow-md hover:shadow-primary/20 transition-all duration-300">
              <Link to="/auth" className="flex items-center gap-1.5">
                Open Portals
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
