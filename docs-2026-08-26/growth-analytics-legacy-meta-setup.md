# Growth & Analytics — Legacy Meta Setup (Pre-Refactor)

This document records **how Digi Carotene Growth & Analytics worked before the client-owned Business Portfolio refactor**. Use it as the baseline when planning code and ops changes.

For general Meta terminology (Facebook account, Business Suite, Portfolio, Page, etc.), see [meta-business-structure.md](./meta-business-structure.md).

For the **recommended future setup** (partner sharing, one agency app), see [ops.md](./ops.md).

---

## Summary

| Layer | What we did (legacy) |
|---|---|
| **Meta login** | One agency Facebook account → one **Meta Business Suite** |
| **Business Portfolios** | **Many** — one per client/brand, all created inside **our** agency Business Suite |
| **Meta app** | **Often one per portfolio** (not strictly required, but that is what we did in practice) |
| **System user** | **One per portfolio** — system users cannot cross portfolios without partner sharing |
| **Access token** | **One per portfolio** — pasted separately when connecting each client's assets |
| **Digi Carotene** | Token stored **per connected account** in Supabase; PHP crons use that stored token |

---

## Did we create an app for each Business Portfolio?

**In practice: yes, we usually did — but Meta does not require it.**

| Question | Answer |
|---|---|
| One app per portfolio required? | **No** — a single Meta app can be linked to system users in multiple portfolios |
| What we actually did | Created portfolios inside our agency Suite, then for each portfolio: system user → link app → generate token. Repeating that workflow naturally led to **one app per portfolio** |
| Why it felt necessary | Each portfolio is an isolated permission boundary. When setting up Portfolio B, the app from Portfolio A is not automatically available — you either **add the same app** to Portfolio B or **create a new app** there. We chose the latter |

---

## Why is a Meta app required at all?

Meta's **Graph API** does not accept a raw Facebook login for automated/server access. Every API call needs an **`access_token`**, and every token is issued in the context of a **Meta app**.

```text
Meta App  →  defines API permissions (scopes), rate limits, audit identity
System User  →  non-human actor inside a Business Portfolio
System User Token  →  long-lived credential generated for (App + System User + assigned assets)
Graph API  →  called as: GET graph.facebook.com/...?access_token=...
```

Without an app you cannot:

- Create a **system user token** for cron/backfill jobs
- Request insights scopes (`instagram_manage_insights`, `ads_read`, etc.)
- Run server-side sync (PHP crons) — user session cookies are not supported for this

The Digi Carotene app never embeds Meta app secrets in code. Admins paste the **system user token** in the portal; the app stores it per account and passes it on every Graph API request.

---

## Legacy Meta architecture (what we built manually)

All client Business Portfolios lived under **one agency Meta Business Suite login**. Each client did **not** own their portfolio — we created and managed everything centrally.

```text
Agency Facebook account
  └── Meta Business Suite  (business.facebook.com — OUR login)
        │
        ├── Client A Business Portfolio
        │     ├── Meta App A
        │     ├── System User A  ← linked to App A
        │     ├── Token A        ← generated from System User A + App A
        │     ├── Client A Facebook Page
        │     ├── @clientA Instagram
        │     └── Client A Ad Account
        │
        ├── Client B Business Portfolio
        │     ├── Meta App B
        │     ├── System User B
        │     ├── Token B
        │     └── …assets…
        │
        └── Client C Business Portfolio
              ├── Meta App C
              ├── System User C
              ├── Token C
              └── …assets…
```

### Per-portfolio Meta setup (repeated for each client)

1. Log in to **agency Meta Business Suite**
2. Switch to (or create) the client's **Business Portfolio**
3. Create a **Meta app** (Business type) — [developers.facebook.com](https://developers.facebook.com) — add Graph / Instagram / Marketing API products
4. Create a **System User** inside that portfolio (e.g. `analytics-sync`)
5. **Link the app** to the system user (assign app with control)
6. **Assign assets** to the system user: Page, Instagram account, ad account for that client
7. **Generate a long-lived system user token** against that app (organic + ads read scopes)
8. Copy **Token** — used only for that portfolio's assets

We did **not** use partner sharing (client portfolio → agency portfolio). Assets lived directly inside each client portfolio we created in our Suite.

---

## Digi Carotene app flow (unchanged by Meta model)

The portal treats Meta as an external API. It does not know about Business Portfolios — only **client record + Meta asset IDs + access token**.

### Team portal path

`/team-portal/growth-and-analytics/manage-accounts`

### Connect an organic account (Instagram / Facebook)

1. Admin selects **client** (from Clients Management)
2. Enters **platform**, **account name**, **Meta account ID**
3. Pastes that portfolio's **system user access token**
4. App calls `fetchMetaOrganicInfo()` → validates token via Graph API
5. Row inserted into `growth_organic_accounts` (`access_token`, `client_id`, `account_id`, …)
6. For Instagram: creates `growth_organic_profiles` row (token copied for cron use)
7. Runs **29-day organic backfill** (posts + followers)

### Connect an ad account

1. Admin selects **client**
2. Enters **ad account ID** (`act_…`), name, currency
3. Pastes that portfolio's **system user access token**
4. App calls `fetchMetaAdInfo()` → validates via Graph API
5. Row inserted into `growth_ads_accounts` (`access_token`, `client_id`, `ad_account_id`, …)
6. Runs **90-day ads backfill** (campaign / ad set / ad daily metrics)

**Key point:** Each connected account stores its **own** `access_token`. In the legacy model, Client A's organic + ad rows both use **Token A**; Client B's rows use **Token B**.

### Code references

| Concern | Location |
|---|---|
| Connect / update / delete accounts | `src/services/growthAccountsService.ts` |
| Graph API calls | `src/services/metaService.ts` |
| Organic backfill | `src/services/instagramBackfillService.ts` |
| Ads backfill | `src/services/adBackfillService.ts` |
| Manage Accounts UI | `src/features/growth-and-analytics/pages/GrowthManageAccountsPage.tsx` |
| Token field (ads) | `AdAccountDialog.tsx` — "Paste the system user access token" |
| Meta API config (versions, fields) | `src/features/growth-and-analytics/constants/metaConfig.ts` |

### Database tables

| Table | Stores |
|---|---|
| `growth_organic_accounts` | Organic connection + `access_token` + `client_id` |
| `growth_organic_profiles` | Instagram profile mirror + `access_token` (used by PHP cron) |
| `growth_organic_posts_metrics` | Cached post metrics |
| `growth_organic_daily_followers` | Daily follower counts |
| `growth_ads_accounts` | Ad account connection + `access_token` + `client_id` |
| `growth_ads_*` | Campaign / ad set / ad master + daily metric tables |

---

## Nightly sync (PHP crons)

Deployed as `public_html/php/` on Hostinger. No Node server — crons read tokens from Supabase and call Meta directly.

| Script | Schedule | What it does |
|---|---|---|
| `sync_yesterday_organic_acc.php` | ~12:05 AM IST | For each `growth_organic_profiles` row: fetch yesterday's IG posts + follower gain using stored `access_token` |
| `sync_yesterday_ads_acc.php` | ~12:10 AM IST | For each `growth_ads_accounts` row: fetch yesterday's campaign/adset/ad metrics |

Each account uses **its own stored token**. Legacy model = different tokens per client portfolio.

---

## End-to-end data flow

```text
[Meta — legacy setup]
  Agency Business Suite
    └── Client Portfolio
          App + System User + Token
          Page / IG / Ad Account

[Manual once per asset]
  Admin copies Token + asset IDs
    └── Growth → Manage Accounts → paste token, pick Digi Carotene client

[App — on connect]
  Validate token (Graph API)
    └── Store in Supabase (growth_* tables)
    └── Backfill history (29d organic / 90d ads)

[App — on view]
  Team / client portal dashboards read cached Supabase data
  Live demographic breakdowns → on-demand Graph API using stored token

[Nightly]
  PHP cron → Supabase token → Graph API → upsert yesterday's rows
```

---

## Client portal

Clients with a linked `client_id` see Growth dashboards filtered to their accounts:

- `/client-portal/growth-and-analytics`
- Read-only view of organic + ads data for their connected accounts

---

## Why this legacy model caused problems

| Issue | Detail |
|---|---|
| **Centralised risk** | All client portfolios under one agency Business Suite login — Meta policy violations or suspensions affect **every client** |
| **Operational overhead** | New client = new portfolio + app + system user + token setup |
| **Ownership** | Client assets lived in agency-controlled portfolios, not client-owned |
| **No partner sharing** | We never learned/used partner access; duplicated infra per portfolio instead |

This is why the refactor moves to **client-owned Business Portfolios** — each client logs into their own Meta Business Suite, owns their portfolio, and the agency receives access (partner access or client-generated tokens) without centralising all brands under one agency login.

---

## Planned direction (refactor — not implemented yet)

```text
Client Facebook account
  └── Client's Meta Business Suite
        └── Client-owned Business Portfolio
              Page + IG + Ad Account
              (agency gets partner access OR client provides token)

Agency Digi Carotene portal
  └── Manage Accounts: still one row per asset, token per connection
        (token may come from client's portfolio system user, not agency's)
```

Refactor phases should be split separately — this file documents **only the legacy baseline**.

---

## Quick comparison

| | Legacy (this doc) | Target (ops.md) |
|---|---|---|
| Where portfolios live | Agency Business Suite | Client-owned (+ partner access to agency) |
| Apps | Often one per portfolio | **One** agency app |
| System users | One per portfolio | **One** agency system user |
| Tokens in portal | Different per client | Same token if assets partner-shared to agency |
| Suspension blast radius | All clients | Isolated per client account |
