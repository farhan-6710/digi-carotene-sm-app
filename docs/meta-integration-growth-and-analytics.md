# Meta Account Setup Flow

Use this process for **Digi Carotene’s own** Meta Business setup (agency portfolio, app, system user, and long-lived token). Do this once for the agency.

## 1. Create Business Portfolio

- Log in to Digi Carotene’s **Meta Business Suite**: [https://business.facebook.com](https://business.facebook.com)
- Create a **Business Portfolio** for Digi Carotene.
- Add the required assets to the portfolio:
  - Facebook Page
  - Instagram Account
  - Ad Account

## 2. Create a Meta App

- Go to **Facebook for Developers**: [https://developers.facebook.com](https://developers.facebook.com)
- Create a new app.
- Add the following use cases:
  1. **Create & manage ads with Marketing API**
  2. **Manage everything on your Page**
  3. **Manage messaging & content on Instagram**

## 3. Create System User

- Go back to Digi Carotene’s **Business Portfolio**.
- Create a **System User**.
- Connect the Meta App to the System User.
- Assign the required assets to the System User.
- Give the System User **Full Control / Full Permissions** for those assets.

## 4. Generate Long-Lived Token

- Generate a **Long-Lived Access Token** using the System User.
- Include the scopes needed for Pages, Instagram, and Ads (from the app use cases above).
- This token can access assets assigned to the System User.

**Important — Facebook Pages vs Instagram / Ads**

| Asset | Token Digi Carotene uses |
| --- | --- |
| Ad Account | System User long-lived token (as pasted) |
| Instagram | System User long-lived token (as pasted) |
| Facebook Page | **Page Access Token** — Digi Carotene exchanges the system user token for one via `GET /{page-id}?fields=access_token` |

Page Insights (`/{page-id}/insights`) rejects system user tokens with `(#190) This method must be called with a Page Access Token`. That is **not** a missing use case — Meta requires a Page token for that endpoint. Full control on the Page for the system user is still required so the exchange succeeds.

Copy and securely save:
  - **Access Token**
  - **Account/Business Name**
  - **Account/Business ID**

## Final Flow

**Business Portfolio → Add Assets → Create App → Add Use Cases → Create System User → Assign Assets & Permissions → Generate Long-Lived Token**

---

# New Client Meta Account Setup Flow

Use this whenever a **new client** needs Growth data. Clients keep their own Meta login — they grant Digi Carotene **partner access**. Do **not** create a new portfolio, app, system user, or token for each client.

## 1. Add the client in Digi Carotene

Go to:

[https://digicarotene.in/team-portal/clients-management](https://digicarotene.in/team-portal/clients-management)

- Create the client record first.

## 2. Get partner access

- Ask the client to share their Page, Instagram, and Ad Account into Digi Carotene’s **main Business Portfolio** via partner access: [https://business.facebook.com](https://business.facebook.com)
- Accept / confirm the shared assets in Digi Carotene’s portfolio.

## 3. Assign shared assets to the Digi Carotene system user

- In Digi Carotene’s Business Portfolio, open the existing **System User**.
- Assign the client’s shared Page, Instagram, and Ad Account to that system user (full permissions).

## 4. Connect in Digi Carotene (same token)

Go to:

[https://digicarotene.in/team-portal/growth-and-analytics/manage-accounts](https://digicarotene.in/team-portal/growth-and-analytics/manage-accounts)

- Select the **Client**.
- Enter **Account ID**, **Account Name**, and Digi Carotene’s existing **Long-Lived Access Token** (same token from Meta Account Setup Flow).
- Connect organic and/or ads as needed.

## Final Flow

**Add Client → Partner access into Digi Carotene portfolio → Assign assets to Digi Carotene system user → Connect in Manage Accounts with the same Digi Carotene token**

---

## Midnight cron data sync

After an account is connected, Digi Carotene stores the token and runs an initial backfill. Going forward, Hostinger PHP crons sync **yesterday’s** Meta data every night (around midnight IST).


| Cron                             | What it syncs                                                              |
| -------------------------------- | -------------------------------------------------------------------------- |
| `sync_yesterday_organic_acc.php` | Instagram post metrics + follower gain for every connected organic account |
| `sync_yesterday_ads_acc.php`     | Ads campaign / ad set / ad daily metrics for every connected ad account    |


Each cron reads connected accounts from Supabase, calls Meta Graph with that account’s stored token, and upserts yesterday’s rows. Dashboards read this cached data — they do not pull full history every page load.