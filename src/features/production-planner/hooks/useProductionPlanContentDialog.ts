import { useCallback, useState } from "react";

import type { ProductionPlanContent } from "@/features/production-planner/types/types";
import {
  emptyProductionPlanContentFormValues,
  contentToFormValues,
  validateProductionPlanContentForm,
  type ProductionPlanContentFormValues,
} from "@/features/production-planner/utils/productionPlanContentFormUtils";
import {
  createProductionPlanItem,
  deleteProductionPlanItem,
  updateProductionPlanItem,
} from "@/services/productionPlanItemsService";
import { showToast } from "@/shared/utils/showToast";
import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";

type UseProductionPlanContentDialogOptions = {
  productionPlanId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useProductionPlanContentDialog({
  productionPlanId,
  reload,
  setError,
}: UseProductionPlanContentDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<ProductionPlanContentFormValues>(
    emptyProductionPlanContentFormValues,
  );

  const resetForm = useCallback(() => {
    setValues(emptyProductionPlanContentFormValues());
    setEditingContentId(null);
  }, []);

  const onFieldChange = useCallback(
    (field: keyof ProductionPlanContentFormValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm],
  );

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((content: ProductionPlanContent) => {
    setEditingContentId(content.id);
    setValues(contentToFormValues(content));
    setIsOpen(true);
  }, []);

  const saveContent = useCallback(async () => {
    if (isSaving || !productionPlanId) {
      return;
    }

    const validationError = validateProductionPlanContentForm(values);
    if (validationError) {
      setError(validationError);
      showToast("error", validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        itemName: values.contentName.trim(),
        itemNotes: values.contentNotes.trim() || null,
        managerApproval:
          values.managerApproval as ProductionPlanApprovalStatus,
        shootInchargeApproval:
          values.shootInchargeApproval as ProductionPlanApprovalStatus,
      };

      const contentName = values.contentName.trim();

      if (editingContentId) {
        await updateProductionPlanItem(editingContentId, payload);
        showToast("success", `"${contentName}" updated successfully.`);
      } else {
        await createProductionPlanItem({
          productionPlanId,
          ...payload,
        });
        showToast("success", `"${contentName}" added successfully.`);
      }

      await reload();
      handleOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save plan content.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingContentId,
    handleOpenChange,
    isSaving,
    productionPlanId,
    reload,
    setError,
    values,
  ]);

  const removeContent = useCallback(async () => {
    if (!editingContentId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const contentName = values.contentName.trim();
      await deleteProductionPlanItem(editingContentId);
      await reload();
      handleOpenChange(false);
      showToast("success", `"${contentName}" deleted successfully.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete plan content.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingContentId,
    handleOpenChange,
    isSaving,
    reload,
    setError,
    values.contentName,
  ]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isOpen,
      onOpenChange: handleOpenChange,
      isEditing: editingContentId !== null,
      isSaving,
      values,
      onFieldChange,
      onSave: saveContent,
      onDelete: editingContentId ? removeContent : undefined,
    },
  };
}
