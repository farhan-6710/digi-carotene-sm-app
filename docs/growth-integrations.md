# Growth integrations (Meta + Google Ads)

Agency credentials once → client assets linked → connect in **Manage Accounts** with the same Digi Carotene secrets + that client’s Account / Customer ID.

Growth sync runs in the **browser (TypeScript)**. PHP on Hostinger is **email only** (digests + custom report). See [deploy.md](./deploy.md).

---

## How Digi Carotene uses Meta (terms)

| Term | Meaning |
|------|---------|
| **Facebook account** | Personal login |
| **Meta Business Suite** | Dashboard UI |
| **Business Portfolio** | Container for Pages, Instagram, ad accounts |
| **Page / Instagram / Ad account** | Brand assets inside a portfolio |

**Agency model:** Digi Carotene owns one portfolio, one Meta app, one **system user**, one long-lived token. Clients keep their own Meta login and grant **partner access**; Digi Carotene assigns those assets to the system user. Do **not** create a new app/token per client.

---

## Meta — agency setup (once)

1. **Business Portfolio** at [business.facebook.com](https://business.facebook.com) — Digi Carotene’s own Page / IG / ad account as needed.
2. **Meta App** at [developers.facebook.com](https://developers.facebook.com) with use cases: Marketing API (ads), Page management, Instagram messaging/content.
3. **System User** in the portfolio — connect the app; assign assets with **full control**.
4. Generate a **long-lived token** (Pages + Instagram + Ads scopes). Save token + account IDs securely.

| Asset | Token Digi Carotene stores |
|-------|----------------------------|
| Ad account / Instagram | System user long-lived token (as pasted) |
| Facebook Page | **Page access token** — app exchanges via `GET /{page-id}?fields=access_token` |

Page Insights reject the raw system-user token (`#190`); full Page control on the system user is still required so the exchange works.

---

## Meta — new client

1. Create the client in Digi Carotene ([Clients](https://digicarotene.in/team-portal/clients-management)).
2. Client shares Page / Instagram / Ad Account into Digi Carotene’s portfolio (**partner access**); accept in Business Manager.
3. Assign those shared assets to Digi Carotene’s **system user** (full control).
4. [Manage Accounts](https://digicarotene.in/team-portal/growth-and-analytics/manage-accounts): pick Client → Account ID + name → paste the **same** Digi Carotene long-lived token → connect organic and/or Meta ads.

**Flow:** Add client → partner access → assign to system user → connect with Digi Carotene token.

Meta `(#10) Application does not have permission` almost always means the asset is **not assigned** to the system user (or partner access was skipped). Regenerating the same token does not fix it. Confirm with Graph: `GET /{account-id}?fields=id,name` using that token.

---

## Google Ads — agency setup (once)

| Piece | Why |
|-------|-----|
| **MCC (Manager account)** | Manage many client accounts; required for a developer token |
| **Developer token** | `developer-token` header ([API Center](https://ads.google.com/aw/apicenter)) |
| **OAuth client ID + secret** | Google Cloud OAuth 2.0 |
| **Refresh token** | Scope `https://www.googleapis.com/auth/adwords` |
| **Manager ID** | MCC customer id (digits; stored as `manager_id`, sent as `login-customer-id`) |

1. Create / open Digi Carotene **Manager account** in [Google Ads](https://ads.google.com); note Manager Customer ID.
2. Apply for a **developer token** (test → Basic/Standard for production).
3. Google Cloud → OAuth client → refresh token with `adwords` scope.
4. Save developer token, client ID/secret, refresh token, Manager ID (agency equivalents of Meta’s system-user token).

Official: [auth](https://developers.google.com/google-ads/api/rest/auth) · [dev token](https://developers.google.com/google-ads/api/docs/get-started/dev-token) · [call structure](https://developers.google.com/google-ads/api/docs/concepts/call-structure).

---

## Google Ads — new client

1. Create the client in Digi Carotene.
2. Link the client’s Google Ads account under Digi Carotene’s MCC (invite / link request); confirm it appears with API-capable access.
3. Manage Accounts → **Connect Ad Account** → platform **Google**:
   - Client, ad account name, **Customer ID** (10-digit)
   - Digi Carotene **Manager ID**, developer token, OAuth client ID/secret, refresh token
   - Currency (default INR; API may return account currency)

On connect, Digi Carotene refreshes OAuth, calls Google with `developer-token` + `login-customer-id`, verifies the customer, then backfills.

**Flow:** Add client → MCC link → connect with Digi Carotene Google credentials + client Customer ID.

Some browsers block Google Ads REST (CORS). If connect/refetch fails in-browser, retry Chromium or fix credentials — there is **no** PHP Google sync.

---

## Data sync (Meta + Google)

Connect and **Refetch data** pull live metrics into Supabase in the browser. Dashboards read **cached** rows — not full history on every page load. There is **no** Growth midnight cron.

| Source | Window | Notes |
|--------|--------|--------|
| Instagram posts | **90** days through **today** | Lifetime post insights |
| Instagram followers | **30** days | Meta `follower_count` API cap |
| Meta / Google ads daily | **90** days through **today** | Chunked ≤28 days per Meta insights call |

**Refetch UX:** stale banner on Dashboard / Content Performance / Campaign Analytics (and campaign detail) → **Refetch data** → non-dismissible progress modal (Cancel only). `last_synced_at` stamps only after a **full** success; cancel/failure keeps the previous stamp.

| Platform | Backfill |
|----------|----------|
| Organic IG | `instagramBackfillService` |
| Meta ads | `adBackfillService` (`runAdBackfill`) |
| Google ads | `googleAdBackfillService` (`runGoogleAdBackfill`) |

Graph / Ads HTTP: `metaService.ts`, `googleAdsService.ts`. Connect orchestration: `growthAccountsService.ts`. Windows: `constants/shared/metaConfig.ts`.

Google maps **ad group → ad set** and **ad → ad** so Campaign Analytics stays shared. Reach/frequency are Meta-oriented; Google stores impressions as reach and `0` frequency until a Google-specific UI lands. Age/gender/placement breakdowns remain **Meta-only**.

Google sync follows the campaign-type matrix (`googleCampaignTypeMatrix.ts`): universal metrics, then type-specific follow-ups (Search IS, Video views, PMax asset groups, etc.). V1 browser backfill focuses on campaign / adset / ad daily metrics.

---

## Code map

| Area | Where |
|------|--------|
| Manage Accounts UI | `features/growth-and-analytics` (accounts hooks/components) |
| Organic / ads selection | URL `account` / `adAccount` + session storage |
| Schema | `growth_organic_*`, `growth_ad_*` — [database.md](./database.md) |
| Email PHP | `scripts/php/` — digests + `send_custom_report.php` only |
