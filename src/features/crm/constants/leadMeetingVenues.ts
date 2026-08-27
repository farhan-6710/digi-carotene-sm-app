import type { LeadMeetingVenue } from "@/features/crm/types/types";

export const LEAD_MEETING_VENUES: LeadMeetingVenue[] = [
  "client_location",
  "in_office",
  "online",
];

export const LEAD_MEETING_VENUE_LABELS: Record<LeadMeetingVenue, string> = {
  client_location: "Client location",
  in_office: "In office",
  online: "Online",
};
