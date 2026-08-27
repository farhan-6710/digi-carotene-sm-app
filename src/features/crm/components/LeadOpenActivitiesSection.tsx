import { LeadActivitiesPanel } from "@/features/crm/components/LeadActivitiesPanel";
import type { LeadActivitiesSectionProps } from "@/features/crm/types/components";

export function LeadOpenActivitiesSection(props: LeadActivitiesSectionProps) {
  return (
    <LeadActivitiesPanel
      {...props}
      title="Open Activities"
      description="Tasks, meetings, and calls still in progress."
      showAddNew
    />
  );
}
