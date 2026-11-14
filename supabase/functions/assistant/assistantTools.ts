/**
 * Tool declarations sent to Gemini. The browser runs them
 * (src/features/growth-and-analytics/assistant/utils/assistantTools.ts) with the
 * signed-in user's own Supabase session, so RLS still applies. Keep names in sync.
 */
const DATE = { type: "string", description: "Date as YYYY-MM-DD." };
const AD_ACCOUNT = {
  type: "string",
  description: "Growth ad account UUID (adAccount query param when set).",
};

export const ASSISTANT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "list_campaigns",
        description:
          "Lists paid campaigns for an ad account with recent spend, clicks, conversions. Empty query lists all.",
        parameters: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            query: {
              type: "string",
              description: "Words to match in the campaign name.",
            },
            from: DATE,
            to: DATE,
          },
          required: ["ad_account_id"],
        },
      },
      {
        name: "get_campaign_performance",
        description:
          "Daily + totals for one campaign: spend, impressions, reach, clicks, conversions, CTR, CPC, CPA. Use for verdicts and cost cutting.",
        parameters: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            campaign_id: {
              type: "string",
              description: "Campaign id from the URL or list_campaigns.",
            },
            from: DATE,
            to: DATE,
          },
          required: ["ad_account_id", "campaign_id"],
        },
      },
      {
        name: "list_adsets",
        description:
          "Lists ad sets / ad groups under a campaign, with names and status.",
        parameters: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            campaign_id: { type: "string" },
          },
          required: ["ad_account_id", "campaign_id"],
        },
      },
      {
        name: "get_adset_performance",
        description:
          "Daily + totals for one ad set / ad group. Compare underperformers to the campaign.",
        parameters: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            adset_id: { type: "string" },
            from: DATE,
            to: DATE,
          },
          required: ["ad_account_id", "adset_id"],
        },
      },
      {
        name: "list_ads",
        description: "Lists ads under an ad set / ad group.",
        parameters: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            adset_id: { type: "string" },
          },
          required: ["ad_account_id", "adset_id"],
        },
      },
      {
        name: "get_ad_performance",
        description:
          "Daily + totals for one ad / creative. Spot fatigue and waste.",
        parameters: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            ad_id: { type: "string" },
            from: DATE,
            to: DATE,
          },
          required: ["ad_account_id", "ad_id"],
        },
      },
      {
        name: "get_campaign_benchmark",
        description:
          "Active Learning-tab benchmark and KPI config for a campaign (targets, mode, best periods).",
        parameters: {
          type: "object",
          properties: {
            ad_account_id: AD_ACCOUNT,
            campaign_id: { type: "string" },
          },
          required: ["ad_account_id", "campaign_id"],
        },
      },
    ],
  },
];
