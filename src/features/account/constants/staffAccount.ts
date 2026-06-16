import type { StaffAccount } from "@/features/account/types/types";

export const staffAccount: StaffAccount = {
  name: "Sai Rahman",
  role: "Lead Digital Strategist",
  department: "Content & Social Media",
  email: "sai@digicarotene.com",
  phone: "+1 (555) 014-8820",
  licenseNumber: "MKT-48291-NY",
  joinedDate: "March 2022",
  location: "Digi Carotene HQ",
  bio: "Specializes in social media strategy, content calendars, and multi-channel campaigns for growth-focused brands.",
  specializations: [
    "Social media strategy",
    "Content marketing",
    "Paid media",
    "Brand storytelling",
  ],
  stats: [
    { label: "Clients this month", value: "34" },
    { label: "Posts published", value: "186" },
    { label: "On-time delivery", value: "94%" },
    { label: "Client rating", value: "4.9" },
  ],
  credentials: [
    {
      title: "Google Ads Certified",
      issuer: "Google",
      year: "2021",
    },
    {
      title: "Meta Blueprint Certified",
      issuer: "Meta",
      year: "2022",
    },
    {
      title: "HubSpot Content Marketing",
      issuer: "HubSpot Academy",
      year: "2023",
    },
  ],
};
