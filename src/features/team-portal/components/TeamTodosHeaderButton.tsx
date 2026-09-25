import { useMemo, useState } from "react";
import { ListTodo } from "lucide-react";

import { CrmActivitiesSheetList } from "@/features/crm/components/CrmActivitiesSheetList";
import { TasksSheetList } from "@/features/tasks-management/components/TasksSheetList";
import { TeamTodosPanel } from "@/features/team-portal/components/TeamTodosPanel";
import { TeamWorkSheetTabBar } from "@/features/team-portal/components/TeamWorkSheetTabBar";
import {
  DEFAULT_TEAM_WORK_SHEET_TAB,
  TEAM_WORK_SHEET_TAB_DESCRIPTIONS,
  teamWorkSheetConfig,
  type TeamWorkSheetTabId,
} from "@/features/team-portal/constants/teamWorkSheet";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

/** Header icon — work sheet with to-dos, tasks, and admin CRM activities. */
export function TeamTodosHeaderButton() {
  const { can } = usePermissions();
  const canReadCrm = can("crm.read");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TeamWorkSheetTabId>(
    DEFAULT_TEAM_WORK_SHEET_TAB,
  );

  const tabs = useMemo<TeamWorkSheetTabId[]>(
    () =>
      canReadCrm ? ["todos", "tasks", "activities"] : ["todos", "tasks"],
    [canReadCrm],
  );
  const activeTab = tabs.includes(tab) ? tab : DEFAULT_TEAM_WORK_SHEET_TAB;

  const closeSheet = () => setOpen(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="relative size-9 rounded-xl border border-border p-0"
        aria-label={
          open
            ? teamWorkSheetConfig.triggerCloseLabel
            : teamWorkSheetConfig.triggerOpenLabel
        }
        aria-pressed={open}
        onClick={() => setOpen(true)}
      >
        <ListTodo className="size-4" aria-hidden="true" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b border-border pr-12">
            <SheetTitle>{teamWorkSheetConfig.title}</SheetTitle>
            <SheetDescription>
              {TEAM_WORK_SHEET_TAB_DESCRIPTIONS[activeTab]}
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-3">
            <TeamWorkSheetTabBar
              tabs={tabs}
              value={activeTab}
              onChange={setTab}
            />
            <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden">
              {activeTab === "todos" ? (
                <TeamTodosPanel
                  hideHeading
                  listClassName="max-h-[min(62vh,calc(100vh-16rem))]"
                />
              ) : null}
              {activeTab === "tasks" ? (
                <TasksSheetList onNavigate={closeSheet} />
              ) : null}
              {activeTab === "activities" && canReadCrm ? (
                <CrmActivitiesSheetList onNavigate={closeSheet} />
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
