import type { ReactNode } from "react";
import { Link } from "react-router";
import { Pencil } from "lucide-react";

import { buildEmployeeDetailPath } from "@/features/employees-management/constants/routes";
import { EMPLOYEE_ROLE_BADGE_CLASS, EMPLOYEE_ROLE_LABELS } from "@/features/employees-management/constants/employeeRoles";
import type { EmployeesTableRowProps } from "@/features/employees-management/types/components";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
      {children}
    </span>
  );
}

export function EmployeesTableRow({
  employee,
  onEditEmployee,
}: EmployeesTableRowProps) {
  return (
    <div className="grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.6fr] sm:gap-4">
      <div className="text-sm font-medium text-foreground">
        <MobileLabel>NAME</MobileLabel>
        <Link
          to={buildEmployeeDetailPath(employee.id)}
          className="text-primary hover:underline"
        >
          {employee.member_name}
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>EMAIL</MobileLabel>
        <a
          href={`mailto:${employee.email}`}
          className="text-primary hover:underline"
        >
          {employee.email}
        </a>
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>MOBILE NUMBER</MobileLabel>
        {employee.mobile_number || (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>ROLE</MobileLabel>
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
            EMPLOYEE_ROLE_BADGE_CLASS[employee.role],
          )}
        >
          {EMPLOYEE_ROLE_LABELS[employee.role]}
        </span>
      </div>

      <div className="flex justify-end gap-2 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => onEditEmployee(employee)}
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
      </div>
    </div>
  );
}
