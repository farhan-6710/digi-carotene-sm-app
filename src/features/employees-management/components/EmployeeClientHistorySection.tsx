import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { buildClientDetailPath } from "@/features/clients-management/constants/routes";
import type { EmployeeClientHistorySectionProps } from "@/features/employees-management/types/components";
import {
  formatAssignmentPeriod,
  getAssignmentClientName,
} from "@/features/employees-management/utils/employeeAssignmentUtils";
import { MonthSelector } from "@/shared/ui/MonthSelector";

export function EmployeeClientHistorySection({
  assignments,
  isLoading,
}: EmployeeClientHistorySectionProps) {
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
          <div className="text-sm font-semibold">Client history</div>
          <p className="mt-1 text-xs text-muted-foreground">
            All clients this person has worked on, including current assignments.
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
          No client assignments for the selected month.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
            >
              <Link
                to={buildClientDetailPath(assignment.client_id)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {getAssignmentClientName(assignment)}
              </Link>
              <div className="text-xs text-muted-foreground">
                {formatAssignmentPeriod(
                  assignment.started_at,
                  assignment.ended_at,
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
