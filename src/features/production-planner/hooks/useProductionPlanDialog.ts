import { useCallback, useState } from "react";

import type { ProductionPlan } from "@/features/production-planner/types/types";
import {
  emptyProductionPlanFormValues,
  planToFormValues,
  validateProductionPlanForm,
  type ProductionPlanFormValues,
} from "@/features/production-planner/utils/productionPlanFormUtils";
import {
  createProductionPlan,
  deleteProductionPlan,
  updateProductionPlan,
} from "@/services/productionPlansService";
import { showToast } from "@/shared/utils/showToast";

type UseProductionPlanDialogOptions = {
  reload: () => Promise<void>;
  setError: (message: string | null) => void;
};

export function useProductionPlanDialog({
  reload,
  setError,
}: UseProductionPlanDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<ProductionPlanFormValues>(
    emptyProductionPlanFormValues
  );

  const resetForm = useCallback(() => {
    setValues(emptyProductionPlanFormValues());
    setEditingPlanId(null);
  }, []);

  const onFieldChange = useCallback(
    (field: keyof ProductionPlanFormValues, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));
    },
    []
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm]
  );

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((plan: ProductionPlan) => {
    setEditingPlanId(plan.id);
    setValues(planToFormValues(plan));
    setIsOpen(true);
  }, []);

  const savePlan = useCallback(async () => {
    if (isSaving) {
      return;
    }

    const validationError = validateProductionPlanForm(values);
    if (validationError) {
      setError(validationError);
      showToast("error", validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        clientId: values.clientId,
        planName: values.planName.trim(),
        planDescription: values.planDescription.trim() || null,
        startDate: values.startDate,
        reelsCount: parseInt(values.reelsCount, 10) || 0,
        imagesCount: parseInt(values.imagesCount, 10) || 0,
        carouselsCount: parseInt(values.carouselsCount, 10) || 0,
        managerApproval: values.managerApproval,
        shootInchargeApproval: values.shootInchargeApproval,
      };

      const planName = values.planName.trim();

      if (editingPlanId) {
        await updateProductionPlan(editingPlanId, payload);
        showToast("success", `Production plan "${planName}" updated successfully.`);
      } else {
        await createProductionPlan(payload);
        showToast("success", `Production plan "${planName}" added successfully.`);
      }

      await reload();
      handleOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save production plan.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingPlanId, handleOpenChange, isSaving, reload, setError, values]);

  const removePlan = useCallback(async () => {
    if (!editingPlanId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const planName = values.planName.trim();
      await deleteProductionPlan(editingPlanId);
      await reload();
      handleOpenChange(false);
      showToast("success", `Production plan "${planName}" deleted successfully.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete production plan.";
      setError(message);
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [editingPlanId, handleOpenChange, isSaving, reload, setError, values.planName]);

  return {
    openAddDialog,
    openEditDialog,
    dialog: {
      open: isOpen,
      onOpenChange: handleOpenChange,
      isEditing: editingPlanId !== null,
      isSaving,
      values,
      onFieldChange,
      onSave: savePlan,
      onDelete: editingPlanId ? removePlan : undefined,
    },
  };
}
