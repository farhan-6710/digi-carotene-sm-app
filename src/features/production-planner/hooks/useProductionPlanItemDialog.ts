import { useCallback, useState } from "react";

import type { ProductionPlanItem } from "@/features/production-planner/types/types";
import {
  emptyProductionPlanItemFormValues,
  itemToFormValues,
  validateProductionPlanItemForm,
  type ProductionPlanItemFormValues,
} from "@/features/production-planner/utils/productionPlanItemFormUtils";
import {
  createProductionPlanItem,
  deleteProductionPlanItem,
  updateProductionPlanItem,
} from "@/services/productionPlanItemsService";
import { showToast } from "@/shared/utils/showToast";
import type { ProductionPlanApprovalStatus } from "@/features/production-planner/types/types";

type UseProductionPlanItemDialogOptions = {
  productionPlanId: string;
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useProductionPlanItemDialog({
  productionPlanId,
  reload,
  setError,
}: UseProductionPlanItemDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<ProductionPlanItemFormValues>(
    emptyProductionPlanItemFormValues,
  );

  const resetForm = useCallback(() => {
    setValues(emptyProductionPlanItemFormValues());
    setEditingItemId(null);
  }, []);

  const onFieldChange = useCallback(
    (field: keyof ProductionPlanItemFormValues, value: string) => {
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

  const openEditDialog = useCallback((item: ProductionPlanItem) => {
    setEditingItemId(item.id);
    setValues(itemToFormValues(item));
    setIsOpen(true);
  }, []);

  const saveItem = useCallback(async () => {
    if (isSaving || !productionPlanId) {
      return;
    }

    const validationError = validateProductionPlanItemForm(values);
    if (validationError) {
      setError(validationError);
      showToast("error", validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        itemName: values.itemName.trim(),
        itemNotes: values.itemNotes.trim() || null,
        managerApproval:
          values.managerApproval as ProductionPlanApprovalStatus,
        shootInchargeApproval:
          values.shootInchargeApproval as ProductionPlanApprovalStatus,
      };

      const itemName = values.itemName.trim();

      if (editingItemId) {
        await updateProductionPlanItem(editingItemId, payload);
        showToast("success", `"${itemName}" updated successfully.`);
      } else {
        await createProductionPlanItem({
          productionPlanId,
          ...payload,
        });
        showToast("success", `"${itemName}" added successfully.`);
      }

      await reload();
      handleOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save plan item.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingItemId,
    handleOpenChange,
    isSaving,
    productionPlanId,
    reload,
    setError,
    values,
  ]);

  const removeItem = useCallback(async () => {
    if (!editingItemId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const itemName = values.itemName.trim();
      await deleteProductionPlanItem(editingItemId);
      await reload();
      handleOpenChange(false);
      showToast("success", `"${itemName}" deleted successfully.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete plan item.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [
    editingItemId,
    handleOpenChange,
    isSaving,
    reload,
    setError,
    values.itemName,
  ]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isOpen,
      onOpenChange: handleOpenChange,
      isEditing: editingItemId !== null,
      isSaving,
      values,
      onFieldChange,
      onSave: saveItem,
      onDelete: editingItemId ? removeItem : undefined,
    },
  };
}
