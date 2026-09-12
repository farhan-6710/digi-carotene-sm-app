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
| **Login customer ID** | Digi Carotene MCC id (digits only, no hyphens) — sent as `login-customer-id` when calling a client account through the MCC |

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
- Manager (login) Customer ID

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
5. Enter Digi Carotene **Manager (login) Customer ID**.
6. Paste Digi Carotene **Developer token**, **OAuth client ID**, **client secret**, and **refresh token** (same agency values for every client, like Meta’s system user token).
7. Currency (defaults to INR; API may return the account currency).

On connect, Digi Carotene exchanges the refresh token, calls Google Ads with `developer-token` + `login-customer-id`, and verifies the customer before saving.

**Browser note:** Google Ads API responses are often blocked by CORS in the browser (Meta Graph is not). If verification fails with a network/CORS error, Digi Carotene still stores the credentials so the account appears in Manage Accounts; a Hostinger PHP sync (same pattern as Meta midnight crons) will be the durable verify + metrics path.

## Final client flow

**Add Client → Link under Digi Carotene MCC → Connect in Manage Accounts with Digi Carotene Google credentials + client Customer ID**

---

## Midnight cron data sync

After an account is connected, Digi Carotene stores credentials and (for Meta) runs an initial backfill. Hostinger PHP crons sync **yesterday’s** data every night (around midnight IST).

| Cron | What it syncs |
| --- | --- |
| `sync_yesterday_organic_acc.php` | Instagram post metrics + follower gain (unchanged; organic only) |
| `sync_yesterday_ads_acc.php` | **Meta** + **Google** ads: campaign / ad set (ad group) / ad daily metrics into the same `growth_ads_*` tables |

`sync_yesterday_ads_acc.php` reads `growth_ads_accounts.platform`:

- `meta_ads` — Meta Marketing API (system user access token), same as before
- `google_ads` — Google Ads API with OAuth refresh token + developer token + `login-customer-id` (MCC)

Google maps **ad group → ad set** and **ad → ad** so Campaign Analytics tables stay shared. Reach/frequency are Meta concepts; Google rows store impressions as reach and `0` frequency until a Google-specific UI lands.

---

## Campaign Analytics note

Meta Ads campaign charts are live in the app today.

Google Ads rows sync into Supabase via the midnight cron above. The Campaign Analytics UI for Google remains a separate surface until Google-specific charts ship.
