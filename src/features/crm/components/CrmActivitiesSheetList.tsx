import { useState } from "react";
import { Loader2, Search } from "lucide-react";

import { CrmActivitySheetGroup } from "@/features/crm/components/CrmActivitySheetGroup";
import { crmActivitySheetConfig } from "@/features/crm/constants/crmActivitySheet";
import { LEADS_MANAGEMENT_PATH } from "@/features/crm/constants/routes";
import { useCrmActivitiesSheet } from "@/features/crm/hooks/useCrmActivitiesSheet";
import type { CrmActivitiesSheetListProps } from "@/features/crm/types/components";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { TransitionLink } from "@/shared/components/TransitionLink";
import { Input } from "@/shared/ui/input";

export function CrmActivitiesSheetList({
  onNavigate,
}: CrmActivitiesSheetListProps) {
  const {
    openActivities,
    closedActivities,
    isEmpty,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
  } = useCrmActivitiesSheet();
  const [openExpanded, setOpenExpanded] = useState(true);
  const [closedExpanded, setClosedExpanded] = useState(false);
  const showClosed =
    closedExpanded ||
    (openActivities.length === 0 &&
      closedActivities.length > 0 &&
      Boolean(searchQuery.trim()));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search activities"
          disabled={isLoading}
          className="h-9 pl-8"
          aria-label="Search CRM activities"
        />
      </div>

      {error ? (
        <div className="mt-3">
          <ErrorBanner message={error} />
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-8 flex justify-center py-6">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isEmpty ? (
        <p className="mt-4 py-6 text-center text-sm text-muted-foreground">
          {searchQuery.trim()
            ? crmActivitySheetConfig.searchEmptyMessage
            : crmActivitySheetConfig.emptyMessage}
        </p>
      ) : (
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
          <CrmActivitySheetGroup
            label={crmActivitySheetConfig.openLabel}
            count={openActivities.length}
            expanded={openExpanded}
            onToggle={() => setOpenExpanded((open) => !open)}
            items={openActivities}
            emptyMessage={crmActivitySheetConfig.openEmptyMessage}
            onNavigate={onNavigate}
          />
          {closedActivities.length > 0 ? (
            <div className="mt-1 border-t border-border pt-1">
              <CrmActivitySheetGroup
                label={crmActivitySheetConfig.closedLabel}
                count={closedActivities.length}
                expanded={showClosed}
                onToggle={() => setClosedExpanded((open) => !open)}
                items={closedActivities}
                emptyMessage=""
                onNavigate={onNavigate}
              />
            </div>
          ) : null}
        </div>
      )}

      <TransitionLink
        to={LEADS_MANAGEMENT_PATH}
        onClick={onNavigate}
        className="mt-3 text-center text-xs font-medium text-primary hover:underline"
      >
        Open Leads Management
      </TransitionLink>
    </div>
  );
}
