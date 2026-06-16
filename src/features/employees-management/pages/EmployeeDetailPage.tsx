import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";

import { EmployeeActiveClientsSection } from "@/features/employees-management/components/EmployeeActiveClientsSection";
import { EmployeeAssignClientDialog } from "@/features/employees-management/components/EmployeeAssignClientDialog";
import { EmployeeClientHistorySection } from "@/features/employees-management/components/EmployeeClientHistorySection";
import { EmployeeProfileCard } from "@/features/employees-management/components/EmployeeProfileCard";
import { EMPLOYEES_MANAGEMENT_PATH } from "@/features/employees-management/constants/routes";
import { useEmployeeClientActions } from "@/features/employees-management/hooks/useEmployeeClientActions";
import { useEmployeeDetailQuery } from "@/features/employees-management/hooks/useEmployeeDetailQuery";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function EmployeeDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={EMPLOYEES_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to team
      </Link>
    </Button>
  );
}

export function EmployeeDetailPage() {
  const { employeeId = "" } = useParams();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const {
    member,
    assignments,
    activeAssignments,
    isLoading,
    error,
    setError,
    reload,
  } = useEmployeeDetailQuery(employeeId);

  const { isSaving, assignClient, endAssignment } = useEmployeeClientActions({
    memberId: employeeId,
    reload,
    setError,
  });

  const activeClientIds = activeAssignments.map(
    (assignment) => assignment.client_id,
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<EmployeeDetailBackButton />} />
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? "Not found."}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <PageHeader backButton={<EmployeeDetailBackButton />} />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <EmployeeProfileCard employee={member} />

      <EmployeeActiveClientsSection
        assignments={activeAssignments}
        isLoading={isLoading}
        isSaving={isSaving}
        onAssignClick={() => setIsAssignDialogOpen(true)}
        onEndAssignment={endAssignment}
      />

      <EmployeeClientHistorySection
        assignments={assignments}
        isLoading={isLoading}
      />

      <EmployeeAssignClientDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        activeClientIds={activeClientIds}
        isSaving={isSaving}
        onAssign={assignClient}
      />
    </section>
  );
}
