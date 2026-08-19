import { useCallback, useState } from "react";

import type { ProductionPlanContent } from "@/features/production-planner/types/types";

const DRAFT_PLAN_CONTENT_ID = "draft";

function buildDraftPlanContent(
  productionPlanId: string,
): ProductionPlanContent {
  return {
    id: DRAFT_PLAN_CONTENT_ID,
    production_plan_id: productionPlanId,
    item_name: "",
    item_notes: null,
    manager_approval: "pending",
    shoot_incharge_approval: "pending",
    created_at: "",
    updated_at: "",
  };
}

export function useDraftPlanContent(productionPlanId: string) {
  const [draftContent, setDraftContent] =
    useState<ProductionPlanContent | null>(null);
  const [draftFocusKey, setDraftFocusKey] = useState(0);

  const startDraft = useCallback(() => {
    setDraftContent(
      (current) => current ?? buildDraftPlanContent(productionPlanId),
    );
    setDraftFocusKey((key) => key + 1);
  }, [productionPlanId]);

  const discardDraft = useCallback(() => {
    setDraftContent(null);
  }, []);

  const isDraftId = useCallback(
    (id: string) => Boolean(draftContent && id === draftContent.id),
    [draftContent],
  );

  return {
    draftContent,
    draftFocusKey,
    startDraft,
    discardDraft,
    isDraftId,
  };
}
