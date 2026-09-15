import type { ReactNode } from "react";

import { GoogleCampaignTypeShell } from "./GoogleCampaignTypeShell";
import type { GoogleCampaignTypePageProps } from "../../types/components";
import { resolveGoogleCampaignType } from "../../utils/resolveGoogleCampaignType";

/**
 * Switch on Google Ads `advertisingChannelType` (stored as campaign objective)
 * and render a dedicated page body for that campaign type.
 *
 * Field sets come from `googleCampaignTypeMatrix` (xlsx Campaign Type Matrix).
 */
export function googleCampaignTypeSwitch(
  props: GoogleCampaignTypePageProps,
): ReactNode {
  const typeId = resolveGoogleCampaignType(props.view.objective);

  switch (typeId) {
    case "search":
      return <GoogleCampaignTypeShell typeId="search" {...props} />;
    case "performance_max":
      return <GoogleCampaignTypeShell typeId="performance_max" {...props} />;
    case "display":
      return <GoogleCampaignTypeShell typeId="display" {...props} />;
    case "demand_gen":
      return <GoogleCampaignTypeShell typeId="demand_gen" {...props} />;
    case "video":
      return <GoogleCampaignTypeShell typeId="video" {...props} />;
    case "shopping":
      return <GoogleCampaignTypeShell typeId="shopping" {...props} />;
    case "local_call":
      return <GoogleCampaignTypeShell typeId="local_call" {...props} />;
    case "app":
      return <GoogleCampaignTypeShell typeId="app" {...props} />;
    case "unknown":
    default:
      return <GoogleCampaignTypeShell typeId="unknown" {...props} />;
  }
}
