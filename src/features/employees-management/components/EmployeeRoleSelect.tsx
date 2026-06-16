import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

import {
  EMPLOYEE_ROLE_LABELS,
  EMPLOYEE_ROLES,
} from "@/features/employees-management/constants/employeeRoles";
import type { EmployeeRoleSelectProps } from "@/features/employees-management/types/components";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";

export function EmployeeRoleSelect({
  value,
  onChange,
  disabled = false,
}: EmployeeRoleSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-muted-foreground">
        Role *
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-auto w-full justify-between gap-2 rounded-lg border border-ring/60 bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-muted/50 dark:border-input dark:bg-muted/40"
          >
            <span>{EMPLOYEE_ROLE_LABELS[value]}</span>
            <ChevronDown
              className={cn(
                "size-3.5 opacity-50 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] border-muted-foreground/10 p-1 shadow-xl"
          align="start"
        >
          <div className="flex flex-col gap-0.5">
            {EMPLOYEE_ROLES.map((role) => {
              const isSelected = role === value;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    onChange(role);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted/60",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-foreground",
                  )}
                >
                  <span>{EMPLOYEE_ROLE_LABELS[role]}</span>
                  {isSelected ? <Check className="size-4 text-primary" /> : null}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
