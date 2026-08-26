import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";

import { LeadAddressCard } from "@/features/crm/components/LeadAddressCard";
import { LeadDialog } from "@/features/crm/components/LeadDialog";
import { LeadNotesSection } from "@/features/crm/components/LeadNotesSection";
import { LeadProfileCard } from "@/features/crm/components/LeadProfileCard";
import {
  LEADS_MANAGEMENT_PATH,
} from "@/features/crm/constants/routes";
import { useLeadDetailActions } from "@/features/crm/hooks/useLeadDetailActions";
import { useLeadDetailQuery } from "@/features/crm/hooks/useLeadDetailQuery";
import { useLeadDialog } from "@/features/crm/hooks/useLeadDialog";
import { DetailPageLoading } from "@/shared/components/DetailPageLoading";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

function LeadDetailBackButton() {
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link to={LEADS_MANAGEMENT_PATH}>
        <ArrowLeft className="mr-2 size-4" />
        Back to leads
      </Link>
    </Button>
  );
}

export function LeadDetailPage() {
  const { leadId = "" } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const canUpdate = can("leads.update");
  const { lead, notes, isLoading, error, setError, reload } =
    useLeadDetailQuery(leadId);
  const { openEditDialog, dialog } = useLeadDialog({
    reload,
    setError,
  });
  const {
    isSavingAddress,
    isSavingNote,
    saveAddress,
    addNote,
    saveNote,
    removeNote,
  } = useLeadDetailActions({
    leadId,
    reload,
    setError,
  });

  if (isLoading && !lead) {
    return <DetailPageLoading backButton={<LeadDetailBackButton />} />;
  }

  if (!lead) {
    return (
      <section className="space-y-4">
        <PageHeader
          heading="Lead"
          description="Lead details."
          backButton={<LeadDetailBackButton />}
        />
        <ErrorBanner message={error ?? "Lead not found."} />
      </section>
    );
  }

  return (
    <PageContent>
      <PageHeader
        heading={lead.name}
        description="Review lead details, address, and notes."
        backButton={<LeadDetailBackButton />}
        actions={
          canUpdate ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => openEditDialog(lead)}
            >
              <Pencil className="mr-2 size-4" />
              Edit
            </Button>
          ) : null
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <LeadProfileCard lead={lead} />
        <LeadAddressCard
          address={lead.address}
          canEdit={canUpdate}
          isSaving={isSavingAddress}
          onSave={saveAddress}
        />
      </div>

      <LeadNotesSection
        notes={notes}
        canEdit={canUpdate}
        isSaving={isSavingNote}
        onAdd={addNote}
        onSave={saveNote}
        onDelete={removeNote}
      />

      {canUpdate ? (
        <LeadDialog
          {...dialog}
          onDelete={
            dialog.onDelete
              ? async () => {
                  await dialog.onDelete?.();
                  void navigate(LEADS_MANAGEMENT_PATH);
                }
              : undefined
          }
        />
      ) : null}
    </PageContent>
  );
}
