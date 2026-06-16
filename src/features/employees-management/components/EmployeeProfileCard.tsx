import { format } from "date-fns";

import {
  EMPLOYEE_ROLE_BADGE_CLASS,
  EMPLOYEE_ROLE_LABELS,
} from "@/features/employees-management/constants/employeeRoles";
import type { EmployeeProfileCardProps } from "@/features/employees-management/types/components";
import { cn } from "@/shared/lib/utils";

export function EmployeeProfileCard({ employee }: EmployeeProfileCardProps) {
  const details = [
    { label: "Email", value: employee.email },
    {
      label: "Mobile",
      value: employee.mobile_number || "—",
    },
    {
      label: "Joined",
      value: format(new Date(employee.created_at), "MMM d, yyyy"),
    },
    {
      label: "Last updated",
      value: format(new Date(employee.updated_at), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Profile
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            {employee.member_name}
          </h2>
        </div>
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
            EMPLOYEE_ROLE_BADGE_CLASS[employee.role],
          )}
        >
          {EMPLOYEE_ROLE_LABELS[employee.role]}
        </span>
      </div>

      <div className="divide-y divide-border">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex flex-wrap items-center justify-between gap-2 px-6 py-3"
          >
            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {detail.label.toUpperCase()}
            </span>
            <span className="text-sm text-foreground">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
