import { FolderKanban } from "lucide-react";

import {
  campaignPlaceholderCopy,
  type CampaignPlaceholderTabId,
} from "../../constants/learning/campaignDetailTabs";

type CampaignTabComingSoonProps = {
  tab: CampaignPlaceholderTabId;
};

export function CampaignTabComingSoon({ tab }: CampaignTabComingSoonProps) {
  const copy = campaignPlaceholderCopy(tab);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground">
        <FolderKanban className="size-5" aria-hidden="true" />
      </div>
      <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Coming soon
      </span>
      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {copy.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {copy.description}
        </p>
      </div>
    </div>
  );
}
