import { useMemo } from "react";

import {
  LEAD_MEETING_VENUE_LABELS,
  LEAD_MEETING_VENUES,
} from "@/features/crm/constants/leadMeetingVenues";
import type { LeadMeetingVenue } from "@/features/crm/types/types";
import { ComboBox } from "@/shared/ui/ComboBox";

type LeadMeetingVenueSelectProps = {
  value: LeadMeetingVenue;
  onChange: (venue: LeadMeetingVenue) => void;
  disabled?: boolean;
};

export function LeadMeetingVenueSelect({
  value,
  onChange,
  disabled = false,
}: LeadMeetingVenueSelectProps) {
  const options = useMemo(
    () =>
      LEAD_MEETING_VENUES.map((venue) => ({
        value: venue,
        label: LEAD_MEETING_VENUE_LABELS[venue],
      })),
    [],
  );

  return (
    <ComboBox
      value={value}
      onChange={(next) => {
        if (next) onChange(next as LeadMeetingVenue);
      }}
      options={options}
      disabled={disabled}
      placeholder="Select venue"
      listTitle="Select venue"
      mode="value"
    />
  );
}
