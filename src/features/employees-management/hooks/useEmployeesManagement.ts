import { useEmployeeDialog } from "@/features/employees-management/hooks/useEmployeeDialog";
import { useEmployeesQuery } from "@/features/employees-management/hooks/useEmployeesQuery";

export function useEmployeesManagement() {
  const { employees, isLoading, error, setError, reload } = useEmployeesQuery();
  const { openAddDialog, openEditDialog, dialog } = useEmployeeDialog({
    reload,
    setError,
  });

  return {
    employees,
    isLoading,
    error,
    openAddDialog,
    openEditDialog,
    dialog,
  };
}
