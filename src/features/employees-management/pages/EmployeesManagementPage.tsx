import { Plus } from "lucide-react";

import { EmployeeDialog } from "@/features/employees-management/components/EmployeeDialog";
import { EmployeesTable } from "@/features/employees-management/components/EmployeesTable";
import { useEmployeesManagement } from "@/features/employees-management/hooks/useEmployeesManagement";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

export function EmployeesManagementPage() {
  const { employees, isLoading, error, openAddDialog, openEditDialog, dialog } =
    useEmployeesManagement();

  return (
    <section className="space-y-8">
      <PageHeader
        heading="Team Management"
        description="Manage your agency team. Add executives, managers, and admins with their contact details."
        actions={
          <Button onClick={openAddDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            Add Team Member
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <EmployeesTable
        employees={employees}
        isLoading={isLoading}
        onEditEmployee={openEditDialog}
      />

      <EmployeeDialog {...dialog} />
    </section>
  );
}
