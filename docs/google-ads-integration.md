# Google Ads Account Setup Flow

Use this process for **Digi Carotene’s own** Google Ads API setup (manager account, developer token, and OAuth). Do this once for the agency.

Same agency use case as Meta: Digi Carotene holds MCC + API credentials; each client Google Ads account is linked under the MCC and connected in Manage Accounts with the shared Digi Carotene credentials plus that client’s Customer ID.

## Prerequisites

| Piece | Why |
| --- | --- |
| **Google Ads Manager Account (MCC)** | Required to apply for a developer token and to manage many client accounts |
| **Developer token** | Sent as `developer-token` on every Google Ads API call ([API Center](https://ads.google.com/aw/apicenter)) |
| **Google Cloud OAuth client** | Client ID + secret for OAuth 2.0 |
| **OAuth refresh token** | Scope `https://www.googleapis.com/auth/adwords` — Digi Carotene exchanges this for short-lived access tokens |
| **Manager ID** | Digi Carotene MCC id (digits only, no hyphens) — stored as `manager_id`; sent to Google as the `login-customer-id` header |

Official refs:

- [Authorization & headers](https://developers.google.com/google-ads/api/rest/auth)
- [Developer token](https://developers.google.com/google-ads/api/docs/get-started/dev-token)
- [Call structure](https://developers.google.com/google-ads/api/docs/concepts/call-structure)

## 1. Create / use Digi Carotene Manager Account

- Sign in to [Google Ads](https://ads.google.com) with Digi Carotene’s agency Google account.
- Create a **Manager account** if you do not already have one.
- Note the **Manager Customer ID** (10 digits; hyphens are fine in the UI — Digi Carotene strips them).

## 2. Apply for a developer token

- In the Manager account open **Tools → API Center** (or [API Center](https://ads.google.com/aw/apicenter)).
- Complete the API Access form and accept the Terms.
- New tokens start as **test** (test accounts only) until Google approves **Basic / Standard** for production client accounts.

## 3. Create Google Cloud OAuth credentials

- In [Google Cloud Console](https://console.cloud.google.com/) create (or reuse) a project.
- Enable any APIs required by your OAuth consent flow; for Ads API access the important part is the OAuth client.
- Create an **OAuth 2.0 Client ID** (Desktop or Web) and save:
  - Client ID
  - Client secret
- Generate a **refresh token** with scope:

  `https://www.googleapis.com/auth/adwords`

  (OAuth Playground or a small desktop/web consent flow is fine for V1.)

## 4. Store Digi Carotene secrets

Copy and securely save:

- Developer token
- OAuth client ID + secret
- OAuth refresh token
- Manager ID (MCC)

These are the agency equivalents of Meta’s long-lived system user token.

## Final agency flow

**Manager account → Developer token → Google Cloud OAuth → Refresh token (adwords scope) → Ready to connect clients**

---

# New Client Google Ads Account Setup Flow

Clients keep their own Google Ads login. Digi Carotene gets **manager link** access, then pastes the client Customer ID in Digi Carotene (same pattern as Meta partner access + Account ID).

## 1. Add the client in Digi Carotene

Go to Clients Management and create the client record first.

## 2. Link the client Google Ads account under Digi Carotene MCC

- Ask the client to accept a manager invitation from Digi Carotene’s MCC, **or**
- Have Digi Carotene send a link request to the client’s Customer ID from the Manager account.
- Confirm the client account appears under Digi Carotene’s manager hierarchy with API-capable access.

## 3. Connect in Digi Carotene

Go to Growth → Manage Accounts → Connect Ad Account:

1. Pill toggle: choose **Google** (Meta stays the default).
2. Select **Client**.
3. Enter **Ad account name**.
4. Enter **Customer ID** (client’s 10-digit Google Ads id).
5. Enter Digi Carotene **Manager ID** (MCC).
6. Paste Digi Carotene **Developer token**, **OAuth client ID**, **client secret**, and **refresh token** (same agency values for every client, like Meta’s system user token).
7. Currency (defaults to INR; API may return the account currency).

On connect, Digi Carotene exchanges the refresh token, calls Google Ads with `developer-token` + `login-customer-id` (from our `manager_id`), and verifies the customer before saving.

**Browser note:** Google Ads API responses are often blocked by CORS in the browser (Meta Graph is not). Digi Carotene still verifies when possible; after saving the account it calls Hostinger `sync_google_ad_acc_backfill.php` (same 90-day window as Meta) using `VITE_GROWTH_PHP_BASE_URL` + `VITE_GROWTH_PHP_CRON_SECRET`. Midnight cron (`sync_last_7_days_ad_acc.php`) re-syncs the last **7** completed days (through yesterday).

Local connect testing: put those two vars in a root `.env` (same `cron_secret` as Hostinger `php/config.php`) and restart `bun run dev`.

## Final client flow

**Add Client → Link under Digi Carotene MCC → Connect in Manage Accounts with Digi Carotene Google credentials + client Customer ID**

---

## Midnight cron data sync

After an account is connected, Digi Carotene stores credentials and runs an initial **90-day** backfill (Meta in-browser; Google via Hostinger PHP). Hostinger PHP crons then run a **rolling re-sync** every night (around midnight IST).

| Cron | What it syncs |
| --- | --- |
| `sync_last_60_days_org_acc.php` | Instagram posts (last **60** days) + follower gains (last **30** days; Meta API cap) |
| `sync_last_7_days_ad_acc.php` | **Meta** + **Google** ads: campaign / ad set (ad group) / ad daily metrics for the last **7** completed days |

`sync_last_7_days_ad_acc.php` reads `growth_ad_accounts.platform`:

- `meta_ads` — Meta Marketing API (system user access token), same as before
- `google_ads` — Google Ads API with OAuth refresh token + developer token + `manager_id` (sent as Google’s `login-customer-id` header)

Google maps **ad group → ad set** and **ad → ad** so Campaign Analytics tables stay shared. Reach/frequency are Meta concepts; Google rows store impressions as reach and `0` frequency until a Google-specific UI lands.

### Campaign-type matrix sync (Phase 1–4)

Sync follows the same Campaign Type Matrix as the UI (`googleCampaignTypeMatrix.ts` / `google_ads_matrix.php`):

1. **Universal Phase 1** GAQL for every campaign: impressions, clicks, cost, conversions, conversion value, CPM, `advertisingChannelType`.
2. **Type-specific follow-up queries** (Google cannot mix incompatible metrics in one SELECT):
   - Search / Shopping → impression share (+ Search lost IS budget/rank)
   - Display → viewability + CPM
   - Demand Gen / Video → CPM; Video also views, CPV, quartile rates
3. **Separate resources:** Performance Max → `asset_group` (+ network split); Local/Call → `call_view` (upserted; UI KPIs for calls not wired yet).

Nullable type-specific columns live on `growth_ad_campaign_daily_metrics` (migration **078**). Asset-group and call rows use `growth_ad_asset_group_daily_metrics` / `growth_ad_call_metrics`.

**Historical backfill** for Google runs on connect via `sync_google_ad_acc_backfill.php`. Manual:

```bash
php sync_google_ad_acc_backfill.php 90
# optional: php sync_google_ad_acc_backfill.php 90 <growth_ad_accounts.id>
```

HTTP: `.../sync_google_ad_acc_backfill.php?secret=YOUR_CRON_SECRET&days=90`

Not in V1 yet: keyword Quality Score table, App installs as filtered conversions, direction requests, dedicated asset-group / call UI tables.

---

## Campaign Analytics note

Meta and Google Ads share the same Campaign Analytics shell (stats → spend chart → campaign table → drill-down). Google maps **ad group → ad set** in the DB; the UI labels them as ad groups. Campaign detail KPIs are **channel-type aware** (Search vs Video vs PMax, etc.).

Age / gender / placement demographic breakdowns remain **Meta-only** (Marketing API). Google rows still sync reach as impressions and frequency as `0` until a Google-specific breakdown lands.
