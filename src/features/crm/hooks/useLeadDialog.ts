import { useCallback, useState } from "react";

import type { Lead } from "@/features/crm/types/types";
import type {
  LeadFormField,
  LeadFormValues,
} from "@/features/crm/utils/leadFormUtils";
import {
  emptyLeadFormValues,
  leadToFormValues,
  validateLeadForm,
} from "@/features/crm/utils/leadFormUtils";
import {
  createLead,
  deleteLead,
  updateLead,
} from "@/services/leadsService";
import { showToast } from "@/shared/utils/showToast";

type UseLeadDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useLeadDialog({ reload, setError }: UseLeadDialogOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<LeadFormValues>(emptyLeadFormValues);

  const resetForm = useCallback(() => {
    setValues(emptyLeadFormValues());
    setEditingLeadId(null);
  }, []);

  const onFieldChange = useCallback(
    <K extends LeadFormField>(field: K, value: LeadFormValues[K]) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm],
  );

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((lead: Lead) => {
    setEditingLeadId(lead.id);
    setValues(leadToFormValues(lead));
    setIsDialogOpen(true);
  }, []);

  const saveLead = useCallback(async () => {
    if (isSaving) {
      return;
    }

    const validationError = validateLeadForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        name: values.name.trim(),
        company: values.company.trim() || null,
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        industry: values.industry.trim() || null,
        leadScore: values.leadScore,
        status: values.status,
        leadSource: values.leadSource,
      };

      const leadName = values.name.trim();

      if (editingLeadId) {
        await updateLead(editingLeadId, payload);
        showToast("success", `"${leadName}" updated successfully.`);
      } else {
        await createLead(payload);
        showToast("success", `"${leadName}" added successfully.`);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save lead.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingLeadId, handleDialogOpenChange, isSaving, reload, setError, values]);

  const removeLead = useCallback(async () => {
    if (!editingLeadId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const leadName = values.name.trim();
      await deleteLead(editingLeadId);
      await reload();
      handleDialogOpenChange(false);
      showToast("success", `"${leadName}" removed successfully.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete lead.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingLeadId,
    handleDialogOpenChange,
    isSaving,
    reload,
    setError,
    values.name,
  ]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: editingLeadId !== null,
      isSaving,
      values,
      onFieldChange,
      onSave: saveLead,
      onDelete: editingLeadId ? removeLead : undefined,
    },
  };
}
