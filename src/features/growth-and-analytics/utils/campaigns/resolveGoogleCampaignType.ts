import {
  GOOGLE_CAMPAIGN_KPI_DEFS,
  GOOGLE_CAMPAIGN_TYPE_KPIS,
  GOOGLE_CHANNEL_TO_TYPE,
  type GoogleCampaignKpiDef,
  type GoogleCampaignKpiId,
  type GoogleCampaignTypeId,
} from "../constants/googleCampaignTypeMatrix";

/** Map GAQL `advertisingChannelType` (stored on campaign objective) → UI type. */
export function resolveGoogleCampaignType(
  channelType: string | null | undefined,
): GoogleCampaignTypeId {
  if (!channelType) return "unknown";
  const key = channelType.trim().toUpperCase().replace(/\s+/g, "_");
  return GOOGLE_CHANNEL_TO_TYPE[key] ?? "unknown";
}

/** KPIs that apply to this type per the spreadsheet matrix. */
export function googleCampaignTypeKpis(
  typeId: GoogleCampaignTypeId,
): GoogleCampaignKpiId[] {
  if (typeId === "unknown") {
    return GOOGLE_CAMPAIGN_TYPE_KPIS.search.filter(
      (id) => GOOGLE_CAMPAIGN_KPI_DEFS[id].phase === 1,
    );
  }
  return GOOGLE_CAMPAIGN_TYPE_KPIS[typeId];
}

/** Matrix fields we can actually paint with today's synced/computed metrics. */
export function googleCampaignRenderableKpis(
  typeId: GoogleCampaignTypeId,
): GoogleCampaignKpiDef[] {
  return googleCampaignTypeKpis(typeId)
    .map((id) => GOOGLE_CAMPAIGN_KPI_DEFS[id])
    .filter((def) => def.renderableToday);
}
