import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";

import { ClientActiveEmployeesSection } from "@/features/clients-management/components/ClientActiveEmployeesSection";
import { ClientAssignEmployeeDialog } from "@/features/clients-management/components/ClientAssignEmployeeDialog";
import { ClientEmployeeHistorySection } from "@/features/clients-management/components/ClientEmployeeHistorySection";
import { ClientProfileCard } from "@/features/clients-management/components/ClientProfileCard";
import { CLIENTS_MANAGEMENT_PATH } from "@/features/clients-management/constants/routes";
import { useClientDetailQuery } from "@/features/clients-management/hooks/useClientDetailQuery";
import { useClientEmployeeActions } from "@/features/clients-management/hooks/useClientEmployeeActions";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";

function ClientDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={CLIENTS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to clients
      </Link>
    </Button>
  );
}

export function ClientDetailPage() {
  const { clientId = "" } = useParams();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const {
    client,
    assignments,
    activeAssignments,
    isLoading,
    error,
    setError,
    reload,
  } = useClientDetailQuery(clientId);

  const { isSaving, assignMember, endAssignment } = useClientEmployeeActions({
    clientId,
    reload,
    setError,
  });

  const activeMemberIds = activeAssignments.map(
    (assignment) => assignment.member_id,
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!client) {
    return (
      <section className="space-y-4">
        <PageHeader backButton={<ClientDetailBackButton />} />
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? "Client not found."}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <PageHeader backButton={<ClientDetailBackButton />} />

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <ClientProfileCard client={client} />

      <ClientActiveEmployeesSection
        assignments={activeAssignments}
        isLoading={isLoading}
        isSaving={isSaving}
        onAssignClick={() => setIsAssignDialogOpen(true)}
        onEndAssignment={endAssignment}
      />

      <ClientEmployeeHistorySection
        assignments={assignments}
        isLoading={isLoading}
      />

      <ClientAssignEmployeeDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        activeMemberIds={activeMemberIds}
        isSaving={isSaving}
        onAssign={assignMember}
      />
    </section>
  );
}
