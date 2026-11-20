import { cn } from "@/shared/lib/utils";

import {
  CHANGE_IMPACT_LABEL,
  CHANGE_VERIFICATION_LABEL,
} from "../../constants/learning/campaignChanges";
import type {
  CampaignChangeImpact,
  CampaignChangeVerification,
} from "../../types/types";

const VERIFICATION_CLASS: Record<CampaignChangeVerification, string> = {
  needs_reason: "bg-destructive/15 text-destructive",
  verified: "bg-status-posted/15 text-status-posted",
  mismatch: "bg-status-scheduled/15 text-status-scheduled",
  not_applied: "bg-muted text-muted-foreground",
  pending: "bg-muted text-muted-foreground",
};

const IMPACT_CLASS: Record<CampaignChangeImpact, string> = {
  measuring: "bg-muted text-muted-foreground",
  improved: "bg-status-posted/15 text-status-posted",
  worsened: "bg-destructive/15 text-destructive",
  no_clear_effect: "bg-muted text-muted-foreground",
  inconclusive: "bg-muted text-muted-foreground",
  pending: "bg-muted text-muted-foreground",
};

function Chip({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function ChangeVerificationChip({
  value,
}: {
  value: CampaignChangeVerification;
}) {
  return (
    <Chip
      label={CHANGE_VERIFICATION_LABEL[value]}
      className={VERIFICATION_CLASS[value]}
    />
  );
}

export function ChangeImpactChip({
  value,
  detail,
}: {
  value: CampaignChangeImpact;
  detail: string | null;
}) {
  return (
    <Chip
      label={detail ?? CHANGE_IMPACT_LABEL[value]}
      className={IMPACT_CLASS[value]}
    />
  );
}
