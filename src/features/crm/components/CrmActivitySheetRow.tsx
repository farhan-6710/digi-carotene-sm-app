import { buildLeadDetailPath } from "@/features/crm/constants/routes";
import type { CrmActivitySheetRowProps } from "@/features/crm/types/components";
import { crmActivityKindLabel } from "@/features/crm/utils/crmActivitySheetUtils";
import { TransitionLink } from "@/shared/components/TransitionLink";

export function CrmActivitySheetRow({
  activity,
  onNavigate,
}: CrmActivitySheetRowProps) {
  return (
    <TransitionLink
      to={buildLeadDetailPath(activity.leadId)}
      onClick={onNavigate}
      className="block rounded-lg px-1 py-3 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-medium text-foreground">
          {activity.title}
        </p>
        <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          {crmActivityKindLabel(activity.kind)}
        </span>
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">
        {activity.leadName}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {activity.meta}
      </p>
    </TransitionLink>
  );
}
