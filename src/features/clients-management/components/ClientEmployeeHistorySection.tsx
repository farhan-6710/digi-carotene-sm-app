import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import type { ClientEmployeeHistorySectionProps } from "@/features/clients-management/types/components";
import {
  formatClientAssignmentPeriod,
  getAssignmentMemberName,
} from "@/features/clients-management/utils/clientAssignmentUtils";
import { buildEmployeeDetailPath } from "@/features/employees-management/constants/routes";
import {
  EMPLOYEE_ROLE_BADGE_CLASS,
  EMPLOYEE_ROLE_LABELS,
} from "@/features/employees-management/constants/employeeRoles";
import { cn } from "@/shared/lib/utils";
import { MonthSelector } from "@/shared/ui/MonthSelector";

export function ClientEmployeeHistorySection({
  assignments,
  isLoading,
}: ClientEmployeeHistorySectionProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const filteredAssignments = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    return assignments.filter((assignment) => {
      const startedAt = new Date(assignment.started_at);
      const endedAt = assignment.ended_at ? new Date(assignment.ended_at) : null;

      return (
        startedAt <= endOfMonth &&
        (endedAt === null || endedAt >= startOfMonth)
      );
    });
  }, [assignments, selectedDate]);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <div className="text-sm font-semibold">Assignment history</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Everyone assigned to this client, including current assignments.
          </p>
        </div>
        <MonthSelector
          year={selectedDate.getFullYear()}
          month={selectedDate.getMonth() + 1}
          onSelect={setSelectedDate}
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-[180px] items-center justify-center px-6 py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          No assignments for the selected month.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredAssignments.map((assignment) => {
            const role = assignment.team_members?.role;

            return (
              <div
                key={assignment.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {assignment.team_members ? (
                    <Link
                      to={buildEmployeeDetailPath(assignment.member_id)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {getAssignmentMemberName(assignment)}
                    </Link>
                  ) : (
                    <div className="text-sm font-medium text-foreground">
                      {getAssignmentMemberName(assignment)}
                    </div>
                  )}
                  {role ? (
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        EMPLOYEE_ROLE_BADGE_CLASS[role],
                      )}
                    >
                      {EMPLOYEE_ROLE_LABELS[role]}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatClientAssignmentPeriod(
                    assignment.started_at,
                    assignment.ended_at,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
