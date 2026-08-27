import { LeadActivitiesPanel } from "@/features/crm/components/LeadActivitiesPanel";
import type { LeadActivitiesSectionProps } from "@/features/crm/types/components";

export function LeadClosedActivitiesSection(props: LeadActivitiesSectionProps) {
  return (
    <LeadActivitiesPanel
      {...props}
      title="Closed Activities"
      description="Completed tasks, meetings, and calls."
      showAddNew={false}
    />
  );
}
