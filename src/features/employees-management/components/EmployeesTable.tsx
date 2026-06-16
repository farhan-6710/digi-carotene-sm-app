import { Loader2 } from "lucide-react";

import { EmployeesTableRow } from "@/features/employees-management/components/EmployeesTableRow";
import type { EmployeesTableProps } from "@/features/employees-management/types/components";

export function EmployeesTable({
  employees,
  isLoading,
  onEditEmployee,
}: EmployeesTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
        <div>
          <div className="text-sm font-semibold">Team Directory</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Contact details and access role for your team.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="grid grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.6fr] gap-4 bg-muted px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden">
          <div>NAME</div>
          <div>EMAIL</div>
          <div>MOBILE NUMBER</div>
          <div>ROLE</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center px-6 py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : employees.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No one on the team yet. Click &quot;Add Team Member&quot; to get started.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {employees.map((employee) => (
              <EmployeesTableRow
                key={employee.id}
                employee={employee}
                onEditEmployee={onEditEmployee}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
