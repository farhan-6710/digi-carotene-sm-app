import { useCallback, useState } from "react";

import type { Client } from "@/features/clients-management/types/types";
import type {
  ClientFormField,
  ClientFormValues,
} from "@/features/clients-management/utils/clientFormUtils";
import {
  clientToFormValues,
  emptyClientFormValues,
  formValuesToSocials,
} from "@/features/clients-management/utils/clientFormUtils";
import {
  createClient,
  deleteClient,
  updateClient,
} from "@/features/clients-management/utils/clientsRepository";
import { showToast } from "@/shared/utils/showToast";

type UseClientDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useClientDialog({ reload, setError }: UseClientDialogOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<ClientFormValues>(emptyClientFormValues);

  const resetForm = useCallback(() => {
    setValues(emptyClientFormValues());
    setEditingClientId(null);
  }, []);

  const onFieldChange = useCallback((field: ClientFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

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

  const openEditDialog = useCallback((client: Client) => {
    setEditingClientId(client.id);
    setValues(clientToFormValues(client));
    setIsDialogOpen(true);
  }, []);

  const saveClient = useCallback(async () => {
    if (isSaving || !values.clientName.trim()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        clientName: values.clientName.trim(),
        mobileNumber: values.mobileNumber.trim() || null,
        websiteName: values.websiteName.trim() || null,
        socials: formValuesToSocials(values),
      };

      const clientName = values.clientName.trim();

      if (editingClientId) {
        await updateClient(editingClientId, payload);
        showToast("success", `"${clientName}" updated successfully.`);
      } else {
        await createClient(payload);
        showToast("success", `"${clientName}" added successfully.`);
      }

      await reload();
      handleDialogOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save client.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingClientId, handleDialogOpenChange, isSaving, reload, setError, values]);

  const removeClient = useCallback(async () => {
    if (!editingClientId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const clientName = values.clientName.trim();
      await deleteClient(editingClientId);
      await reload();
      handleDialogOpenChange(false);
      showToast("success", `"${clientName}" removed successfully.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete client.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingClientId, handleDialogOpenChange, isSaving, reload, setError]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isDialogOpen,
      onOpenChange: handleDialogOpenChange,
      isEditing: editingClientId !== null,
      isSaving,
      values,
      onFieldChange,
      onSave: saveClient,
      onDelete: editingClientId ? removeClient : undefined,
    },
  };
}
