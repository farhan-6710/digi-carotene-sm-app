import { useMemo, useState } from "react";

import { CAMPAIGN_CHANGES_MOCK } from "../../constants/learning/campaignChangesMock";
import type { CampaignChangeRow } from "../../types/types";

function sortChanges(rows: CampaignChangeRow[]): CampaignChangeRow[] {
  return [...rows].sort((a, b) => {
    const aNeeds = a.verification === "needs_reason" ? 0 : 1;
    const bNeeds = b.verification === "needs_reason" ? 0 : 1;
    if (aNeeds !== bNeeds) return aNeeds - bNeeds;
    return (
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
  });
}

export function useCampaignChangesUi() {
  const [range, setRange] = useState("60");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [madeBy, setMadeBy] = useState("all");
  const [explainOpen, setExplainOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<CampaignChangeRow | null>(null);

  const rows = useMemo(() => {
    const filtered = CAMPAIGN_CHANGES_MOCK.filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (status !== "all" && row.verification !== status) return false;
      if (madeBy === "ravi" && !row.actorLabel.toLowerCase().includes("ravi")) {
        return false;
      }
      if (
        madeBy === "priya" &&
        !row.actorLabel.toLowerCase().includes("priya")
      ) {
        return false;
      }
      return true;
    });
    return sortChanges(filtered);
  }, [category, status, madeBy]);

  function openExplain(row: CampaignChangeRow) {
    setActiveRow(row);
    setExplainOpen(true);
  }

  return {
    range,
    setRange,
    category,
    setCategory,
    status,
    setStatus,
    madeBy,
    setMadeBy,
    rows,
    explainOpen,
    setExplainOpen,
    logOpen,
    setLogOpen,
    activeRow,
    openExplain,
  };
}
