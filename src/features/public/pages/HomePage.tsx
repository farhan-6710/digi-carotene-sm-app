import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Users,
  Layers,
  Activity,
  Flame,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  TrendingUp,
  Clock,
  Lock,
  UserRound,
} from "lucide-react";
import {
  heroContent,
  servicesData,
} from "@/features/public/constants/public";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/utils/showToast";
import { Line, LineChart, ResponsiveContainer } from "recharts";

// Mock data for the hero preview chart
const heroChartData = [
  { day: "Day 1", current: 4, previous: 3 },
  { day: "Day 5", current: 6, previous: 5 },
  { day: "Day 10", current: 3, previous: 4 },
  { day: "Day 15", current: 8, previous: 6 },
  { day: "Day 20", current: 12, previous: 7 },
  { day: "Day 25", current: 10, previous: 9 },
  { day: "Day 30", current: 16, previous: 11 },
];

export function HomePage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle hash scrolling on load or route change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      showToast("success", "Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
      setIsSubmitting(false);
    }, 1200);
  };

  // Map icon strings to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return Users;
      case "Layers":
        return Layers;
      case "Activity":
        return Activity;
      case "Flame":
        return Flame;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative border-b border-border/40 py-20 lg:py-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/10 -z-10 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 -z-10 size-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          {/* Left Column: Content */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
              <Sparkles className="size-3.5" />
              {heroContent.eyebrow}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-b from-foreground to-foreground/80">
              {heroContent.title}
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              {heroContent.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300">
                <a href={heroContent.primaryCta.to} onClick={(e) => {
                  const element = document.getElementById("services");
                  if (element) {
                    e.preventDefault();
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}>
                  {heroContent.primaryCta.label}
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 py-6 text-base font-semibold hover:bg-muted/50 transition-all duration-300">
                <Link to={heroContent.secondaryCta.to}>
                  {heroContent.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Mock Dashboard Widget */}
          <div className="relative lg:ml-4">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-30 blur-lg" />
            <div className="relative rounded-2xl border border-border/40 bg-card p-6 shadow-2xl transition-all duration-500 hover:border-primary/30">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Live Operations
                  </div>
                  <div className="mt-1 text-lg font-bold tracking-tight">
                    Digi Carotene Hub
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Active
                </div>
              </div>

              {/* Mock Stats Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/30 bg-muted/20 p-3.5 hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[10px] font-bold tracking-wider uppercase">Team Members</span>
                    <UserRound className="size-4 text-primary" />
                  </div>
                  <div className="mt-1.5 text-2xl font-bold">12</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">Active specialists</div>
                </div>
                <div className="rounded-xl border border-border/30 bg-muted/20 p-3.5 hover:border-accent/20 transition-colors">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[10px] font-bold tracking-wider uppercase">Total Clients</span>
                    <Users className="size-4 text-accent" />
                  </div>
                  <div className="mt-1.5 text-2xl font-bold">24</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">Registered brands</div>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="mt-4 rounded-xl border border-border/30 bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Publishing Performance
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                    <TrendingUp className="size-3" />
                    +18.5%
                  </div>
                </div>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heroChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <Line
                        type="linear"
                        dataKey="current"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                      <Line
                        type="linear"
                        dataKey="previous"
                        stroke="var(--accent)"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Section */}
      <section id="services" className="relative border-b border-border/40 py-20 lg:py-32 bg-card/20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl text-left space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
              What We Do
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Marketing services built for impact
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Campaigns and content programmes designed to meet your brand where
              it is and take it further. We deliver structured, creative, and measurable results.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {servicesData.map((service) => {
              const Icon = getIcon(service.icon);
              const isPrimary = service.color === "primary";
              return (
                <div
                  key={service.id}
                  className={`group relative rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    isPrimary ? "hover:border-primary/40 hover:bg-glow-bg-primary" : "hover:border-accent/40 hover:bg-glow-bg-accent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                      isPrimary
                        ? "border-primary/20 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        : "border-accent/20 bg-accent/5 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                    }`}>
                      <Icon className="size-6" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className={`size-4 shrink-0 ${isPrimary ? "text-primary" : "text-accent"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Portals Section */}
      <section id="portals" className="border-b border-border/40 py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl text-left space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold tracking-wider text-accent uppercase">
              Access Points
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dedicated workspaces for everyone
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Whether you are a registered brand tracking your campaigns or a Digi Carotene specialist managing schedules, we have a tailored workspace for you.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Client Portal Card */}
            <div className="group relative rounded-2xl border border-border/40 bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:bg-glow-bg-primary">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                  <Users className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Client Portal</h3>
                  <p className="text-xs text-muted-foreground">For registered brands</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Log in to view your social media calendar, review and approve draft posts, track real-time publishing performance, and download campaign reports.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Real-time calendar & post scheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  One-click content approvals
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="size-4 text-primary" />
                  Analytics & performance metrics
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild className="w-full rounded-full py-6 font-semibold shadow-md hover:shadow-primary/20">
                  <Link to="/auth" className="flex items-center justify-center gap-2">
                    Access Client Portal
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Team Portal Card */}
            <div className="group relative rounded-2xl border border-border/40 bg-card p-8 shadow-sm transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:bg-glow-bg-accent">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/5 text-accent">
                  <Lock className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Team Portal</h3>
                  <p className="text-xs text-muted-foreground">For agency specialists</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Log in to manage client accounts, schedule and publish content, assign team members to client workloads, and analyze campaign performance metrics.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Layers className="size-4 text-accent" />
                  Multi-client campaign management
                </li>
                <li className="flex items-center gap-2">
                  <UserRound className="size-4 text-accent" />
                  Team workload & assignment tracking
                </li>
                <li className="flex items-center gap-2">
                  <Flame className="size-4 text-accent" />
                  Advanced publishing tools & analytics
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild variant="outline" className="w-full rounded-full py-6 font-semibold hover:bg-muted/50 transition-colors">
                  <Link to="/auth" className="flex items-center justify-center gap-2">
                    Access Team Portal
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact Us Section */}
      <section id="contact" className="relative py-20 lg:py-32 bg-card/20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left Column: Info */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
                Get In Touch
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Let&apos;s build something great together
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Ready to take your social presence and brand growth to the next level? Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/40 bg-card text-primary">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Email Us</div>
                    <a href="mailto:hello@digicarotene.com" className="text-sm font-semibold hover:underline">
                      hello@digicarotene.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/40 bg-card text-primary">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Call Us</div>
                    <a href="tel:+15550199" className="text-sm font-semibold hover:underline">
                      +1 (555) 0199
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/40 bg-card text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Our Office</div>
                    <div className="text-sm font-semibold text-foreground">
                      100 Creative Way, Suite 400, San Francisco, CA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-30 blur-lg" />
              <div className="relative rounded-2xl border border-border/40 bg-card p-6 sm:p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Your Name *
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Jane Cooper"
                        className="mt-2 h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground shadow-xs transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 dark:bg-muted/40 dark:border-input"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Your Email *
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. jane@company.com"
                        className="mt-2 h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground shadow-xs transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 dark:bg-muted/40 dark:border-input"
                      />
                    </label>
                  </div>

                  <label className="block text-xs font-semibold text-muted-foreground">
                    Subject
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="mt-2 h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground shadow-xs transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 dark:bg-muted/40 dark:border-input"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Services Inquiry">Services Inquiry</option>
                      <option value="Client Portal Access">Client Portal Access</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </label>

                  <label className="block text-xs font-semibold text-muted-foreground">
                    Message *
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your brand and marketing goals..."
                      className="mt-2 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 dark:bg-muted/40 dark:border-input resize-none"
                    />
                  </label>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full py-6 font-semibold shadow-md hover:shadow-primary/20"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Message
                        <Send className="size-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
