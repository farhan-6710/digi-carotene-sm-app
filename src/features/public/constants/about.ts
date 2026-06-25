import { AUTH_FORM_TYPES } from "@/features/auth/constants/auth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";

export const aboutContent = {
  title: "About Digi Carotene",
  intro:
    "Digi Carotene is a digital marketing agency. We help brands grow through structured content, social campaigns, and measurable results — backed by a service management workspace our team uses every day.",
  sections: [
    {
      title: "Our approach",
      body: "Every client receives a clear content plan with defined milestones — from strategy and scheduling through publishing and performance review. We combine creative direction, channel expertise, and reporting in one collaborative workflow.",
    },
    {
      title: "Who we help",
      body: "From local brands building their first social presence to established companies scaling multi-channel campaigns, our team supports a wide range of marketing goals with the same level of attention and professionalism.",
    },
    {
      title: "How we work",
      body: "The Digi Carotene team portal keeps clients, projects, and posts organised — so strategists can focus on creative work while service delivery stays on track behind the scenes.",
    },
  ],
  values: [
    {
      title: "Client-First Strategy",
      description:
        "We align our goals directly with your business outcomes, ensuring every post and campaign has a clear purpose.",
    },
    {
      title: "Data-Informed Creativity",
      description:
        "We back our creative campaigns with rigorous data and performance analytics to ensure high-impact results.",
    },
    {
      title: "Transparent Reporting",
      description:
        "No vanity metrics. We provide clear, honest, and actionable performance reports that show actual business growth.",
    },
  ],
} as const;

export const aboutValuesSectionContent = {
  badge: "Our Values",
  title: "The principles that drive our work",
  description:
    "Structured creativity, absolute transparency, and delivering real business outcomes for every client we serve.",
} as const;

export const aboutCtaContent = {
  title: "Ready to work with Digi Carotene?",
  description:
    "Get in touch for agency services, or sign in to your client or team portal to manage content and campaigns.",
  homeCta: { label: "Back to Home", to: "/" },
  portalCta: {
    label: "Sign in",
    to: buildAuthUrl(AUTH_FORM_TYPES.login),
  },
} as const;

export const aboutHeroBadge = "Our Story";
