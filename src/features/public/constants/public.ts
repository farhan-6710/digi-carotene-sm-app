export const agencyMeta = {
  name: "Digi Carotene",
  tagline: "Digital Marketing Agency",
  description:
    "Strategic content, social campaigns, and brand growth — delivered with clarity, creativity, and measurable results.",
} as const;

export const heroContent = {
  eyebrow: "Digital Marketing & Content Strategy",
  title: "Grow your brand with Digi Carotene",
  description:
    "Full-service digital marketing for brands that want stronger social presence, smarter content calendars, and campaigns that convert.",
  primaryCta: { label: "Explore Services", to: "#services" },
  secondaryCta: { label: "About Our Agency", to: "/about" },
} as const;

export const servicesData = [
  {
    id: "social",
    title: "Social Media Management",
    description:
      "Consistent posting, community engagement, and platform-specific content that builds audience trust and drives organic reach.",
    icon: "Users",
    features: [
      "Platform-specific content creation",
      "Community management & engagement",
      "Hashtag & keyword optimization",
      "Monthly performance reporting",
    ],
    color: "primary",
  },
  {
    id: "content",
    title: "Content Strategy",
    description:
      "Editorial calendars, campaign planning, and creative direction aligned to your brand goals and target audience behavior.",
    icon: "Layers",
    features: [
      "Multi-channel content calendars",
      "Creative direction & copywriting",
      "SEO-focused blog & article writing",
      "Brand voice & tone development",
    ],
    color: "accent",
  },
  {
    id: "paid",
    title: "Paid Media Campaigns",
    description:
      "Targeted ad campaigns across social and search with ongoing optimization, precise audience targeting, and high ROI.",
    icon: "Activity",
    features: [
      "Meta, LinkedIn, and Google Ads",
      "A/B testing of creatives & copy",
      "Precise demographic targeting",
      "Conversion rate optimization",
    ],
    color: "primary",
  },
  {
    id: "brand",
    title: "Brand & Creative",
    description:
      "Visual identity, high-quality copy, and campaign assets that keep your messaging cohesive and stunning across all channels.",
    icon: "Flame",
    features: [
      "Logo & visual identity design",
      "Social media templates",
      "Ad creative & video assets",
      "Cohesive brand style guides",
    ],
    color: "accent",
  },
] as const;

export const agencyStats = [
  { label: "Posts delivered monthly", value: "180+" },
  { label: "Client retention rate", value: "96%" },
  { label: "Average campaign cycle", value: "6–8 wks" },
  { label: "Specialists on team", value: "12" },
] as const;

export const aboutContent = {
  title: "About Digi Carotene",
  intro:
    "Digi Carotene is a digital marketing agency built around one belief: growth should feel structured, creative, and measurable.",
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
      title: "Agency operations",
      body: "Our team portal keeps posts, client schedules, and campaign activity organised — so strategists can focus on creative work while operations run smoothly behind the scenes.",
    },
  ],
  values: [
    {
      title: "Client-First Strategy",
      description: "We align our goals directly with your business outcomes, ensuring every post and campaign has a clear purpose.",
    },
    {
      title: "Data-Informed Creativity",
      description: "We back our creative campaigns with rigorous data and performance analytics to ensure high-impact results.",
    },
    {
      title: "Transparent Reporting",
      description: "No vanity metrics. We provide clear, honest, and actionable performance reports that show actual business growth.",
    },
  ],
} as const;

export const publicNavLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/#services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/#contact" },
] as const;
