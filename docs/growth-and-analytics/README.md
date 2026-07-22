# Growth & Analytics

Instagram organic insights + Meta ads campaign analytics. Team connects accounts; client portal is read-only.

**Code:** `src/features/growth-and-analytics/` · **Services:** `src/services/` (Meta + backfill)  
**Cron:** [scripts/growth-and-analytics/php/README.md](../../scripts/growth-and-analytics/php/README.md)  
**Schema:** [database.md](../database.md)

**Routes**

| Portal | Base path |
|--------|-----------|
| Team | `/team-portal/growth-and-analytics` |
| Client | `/client-portal/growth-and-analytics` |

Manage Accounts (team only): `…/manage-accounts`

---

## Meta setup — System User token

To avoid Meta’s per-portfolio app-sharing limits, Digi Carotene uses **one centralized System User token**.

- Meta App + developer permissions live under **one primary Business Portfolio**
- Client Pages / Instagram / ad accounts are **shared or granted** into that primary portfolio
- **Do not** create a separate Meta App per client portfolio

### Steps (Meta Business Suite)

1. Open the **primary Business Portfolio** → **Settings** → **System Users**.
2. Select the system user (e.g. `analytics-cron`).
3. **Add assets** → assign the client Page(s) / Instagram account(s) / ad account(s) the system user needs (full control for those assets).
4. **Generate token** under that system user with the Graph permissions required for the assets you sync, for example:
   - Organic: `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement`
   - Ads: include ads read scopes as needed (`ads_read`, etc.)
5. Copy the permanent System User access token.

That single token is authorized for the central Meta App and every assigned client asset. Paste it in **Manage Accounts** when connecting each account (same token can be reused across assigned assets).

---

## Connect flow (in app)

### Organic (Instagram / Facebook Page)

1. Team opens **Manage Accounts** → Connect Organic Account.
2. Select the owning **client**, platform, account ID, and paste the System User token.
3. App validates via Meta Graph, saves `growth_organic_accounts` (+ `growth_organic_profiles` for Instagram).
4. Instagram: `runInstagram29DayBackfill` → last **29 completed days** into `growth_organic_posts_metrics` and `growth_organic_daily_followers`.

### Ads

1. Team opens **Manage Accounts** → Connect Ad Account.
2. Select the owning **client**, ad account ID (`act_…`), currency, and paste the System User token.
3. App validates, saves `growth_ads_accounts`, runs `runAdBackfill` (~90 days of campaign / ad set / ad metrics).
4. PHP cron extends rows nightly (`sync_yesterday_ads_acc.php`).

**Organic** vs **ad** accounts are separate. WhatsApp is out of scope for V1.

---

## Portals

| Portal | Access |
|--------|--------|
| **Team** | Full Growth UI + Manage Accounts. Connecting an account requires selecting `client_id` (migration `027`). |
| **Client** | Same analytics pages, scoped by `client_id`. No Manage Accounts / token UI. Nav hides Content Performance or Campaign Analytics when that account type is not linked. |

Login method (Google / email) is separate from data ownership. Clients see Meta data only because the team linked accounts to their `client_id`.

---

## Data model

### Organic

| Table | Purpose |
|-------|---------|
| `growth_organic_accounts` | Connected Page / Instagram + token + `client_id` |
| `growth_organic_profiles` | Instagram token, username, follower count |
| `growth_organic_posts_metrics` | Post reach, impressions, engagement |
| `growth_organic_daily_followers` | Net followers gained per day |

Migrations: `018`, `021`, `027`, `028`.

### Ads

| Table | Purpose |
|-------|---------|
| `growth_ads_accounts` | Connected ad account + token + `client_id` |
| `growth_ads_campaign_daily_metrics` | Campaign daily metrics |
| `growth_ads_adsets` / `growth_ads_adset_daily_metrics` | Ad set master + daily |
| `growth_ads_ads` / `growth_ads_ad_daily_metrics` | Ad master + daily |

Migrations: `022`, `025`, `027`, `028`.

Age / gender / placement breakdowns are **not stored** — fetched live from Meta on detail pages when selected.

---

## Product surfaces

| Area | Behavior |
|------|----------|
| **Dashboard** | Organic interactions / reach from `growth_organic_posts_metrics`; followers gained from `growth_organic_daily_followers` |
| **Content Performance** | Per-post organic metrics |
| **Campaign Analytics** | Campaign → ad set → ad drill-down from stored daily metrics; optional live age/gender/placement breakdowns |
| **Reports / Custom Report** | Team-built report flows |

Daily sync after connect: [PHP cron README](../../scripts/growth-and-analytics/php/README.md).

---

## Code map

```
src/features/growth-and-analytics/   UI, hooks, utils
src/services/
  growthAccountsService.ts       Connect / update accounts
  metaService.ts                 Meta Graph API
  instagramBackfillService.ts    Organic connect backfill
  adBackfillService.ts           Ads connect backfill
  pastPostsMetricsService.ts
  instagramDailyFollowersService.ts
scripts/growth-and-analytics/php/    Midnight yesterday sync
```
