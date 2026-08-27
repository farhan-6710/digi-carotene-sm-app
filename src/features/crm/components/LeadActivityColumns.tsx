import type { ReactNode } from "react";
import { CalendarDays, CheckSquare, Phone } from "lucide-react";

import { LeadActivityList } from "@/features/crm/components/LeadActivityList";
import type {
  LeadCall,
  LeadMeeting,
  LeadTask,
} from "@/features/crm/types/types";

type LeadActivityColumnsProps = {
  tasks: LeadTask[];
  meetings: LeadMeeting[];
  calls: LeadCall[];
  canEdit: boolean;
  onEditTask: (task: LeadTask) => void;
  onEditMeeting: (meeting: LeadMeeting) => void;
  onEditCall: (call: LeadCall) => void;
};

function ColumnShell({
  icon,
  title,
  count,
  children,
}: {
  icon: ReactNode;
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-muted/20">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span className="text-muted-foreground">{icon}</span>
        <p className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
          {title}
        </p>
        <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      <div className="px-3 py-2">{children}</div>
    </div>
  );
}

export function LeadActivityColumns({
  tasks,
  meetings,
  calls,
  canEdit,
  onEditTask,
  onEditMeeting,
  onEditCall,
}: LeadActivityColumnsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <ColumnShell
        icon={<CheckSquare className="size-3.5" aria-hidden="true" />}
        title="Tasks"
        count={tasks.length}
      >
        <LeadActivityList
          kind="task"
          items={tasks}
          canEdit={canEdit}
          onEdit={onEditTask}
        />
      </ColumnShell>
      <ColumnShell
        icon={<CalendarDays className="size-3.5" aria-hidden="true" />}
        title="Meetings"
        count={meetings.length}
      >
        <LeadActivityList
          kind="meeting"
          items={meetings}
          canEdit={canEdit}
          onEdit={onEditMeeting}
        />
      </ColumnShell>
      <ColumnShell
        icon={<Phone className="size-3.5" aria-hidden="true" />}
        title="Calls"
        count={calls.length}
      >
        <LeadActivityList
          kind="call"
          items={calls}
          canEdit={canEdit}
          onEdit={onEditCall}
        />
      </ColumnShell>
    </div>
  );
}
