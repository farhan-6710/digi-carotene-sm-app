# Meta Business Structure: Ravi's Example

A concise guide to Meta setup for **Ravi**, who manages three businesses through one personal Facebook login and **Meta Business Suite**.

---

## Ravi's example

| Brand | Facebook Page | Instagram |
|---|---|---|
| ABC Interiors | ABC Interiors | `@abcinteriors` |
| Ravi Marketing Agency | Ravi Marketing Agency | `@ravimarketing` |
| Hyderabad Cafe | Hyderabad Cafe | `@hyderabadcafe` |

Each brand gets its own **Business Portfolio** (Page + linked Instagram + ad account), all managed in **Meta Business Suite** at [business.facebook.com](https://business.facebook.com).

```text
Ravi's Facebook account
  └── Meta Business Suite
        ├── ABC Interiors Business Portfolio
        │     ├── ABC Interiors Page ↔ @abcinteriors
        │     └── ABC Interiors Ads
        ├── Ravi Marketing Agency Business Portfolio
        │     ├── Ravi Marketing Agency Page ↔ @ravimarketing
        │     └── Ravi Marketing Agency Ads
        └── Hyderabad Cafe Business Portfolio
              ├── Hyderabad Cafe Page ↔ @hyderabadcafe
              └── Hyderabad Cafe Ads
```

---

## The five building blocks

| # | Thing | What it is | Ravi's example |
|---|---|---|---|
| 1 | **Facebook account** | Personal login (email + password). Starting point for everything. | `ravi@email.com` — one real account per person, no shared/fake logins |
| 2 | **Facebook Page** | Brand's public profile on Facebook. No separate password. | One Page per brand |
| 3 | **Instagram account** | Separate profile on Instagram (own username + password). Switch to **Professional (Business)** account. | `@abcinteriors`, `@ravimarketing`, `@hyderabadcafe` |
| 4 | **Meta Business Suite + Business Portfolio** | **Suite** = dashboard UI (control room). **Portfolio** = backend container that holds assets (filing cabinet). One Suite login; switch between multiple Portfolios. | Three Portfolios inside one Suite |
| 5 | **Ad account** | Where campaigns, billing, and spend live. Created inside a Portfolio via Business Suite. | ABC Interiors Ads, etc. |

**Suite vs Portfolio:** Ravi logs into **Meta Business Suite** to manage day-to-day work. Each **Business Portfolio** inside it owns that brand's Page, Instagram, ad account, pixels, and permissions.

**Client work:** For real clients, the **client should own their Portfolio** and grant Ravi access through Business Suite — not the other way around.

**Running an ad** uses three identities together:

```text
Ad account: ABC Interiors Ads  →  Page: ABC Interiors  +  Instagram: @abcinteriors
```

---

## How they relate

```text
Facebook account
  └── Meta Business Suite          (dashboard UI)
        └── Business Portfolio     (asset container — one per brand)
              ├── Facebook Page
              ├── Instagram account (linked to Page)
              └── Ad account
```

> **One-line rule:** Facebook account = login · Meta Business Suite = where Ravi manages · Business Portfolio = holds assets · Page + Instagram = brand identity · Ad account = runs and pays for ads.

---

## Setup order

Do these in sequence for each brand.

1. **Facebook account** — Create Ravi's personal account (`ravi@email.com`). One real login per person.
2. **Facebook Pages** — Create one Page per brand from Ravi's account.
3. **Instagram accounts** — Create `@abcinteriors`, `@ravimarketing`, `@hyderabadcafe`. Set each to a Professional (Business) account. Instagram is separate from Facebook — not auto-linked.
4. **Business Portfolios** — In Meta Business Suite, create one Portfolio per brand (ABC Interiors, Ravi Marketing Agency, Hyderabad Cafe).
5. **Add assets to Portfolio** — In Business Suite, switch to each Portfolio and add its matching Page + Instagram account. Do not mix brands across Portfolios.
6. **Link Page ↔ Instagram** — In the same Portfolio, connect each Instagram to its matching Page.
   ```text
   Instagram → Edit profile → Page → Connect existing Page → pick matching Page
   ```
7. **Ad account** — In Business Suite → Settings → Accounts → Ad accounts → Add → Create new. One ad account per Portfolio.
8. **Run ads** — Campaign uses the Portfolio's ad account + Page + Instagram as identities.

---

## Rules to remember

- One **Facebook account** per person — never shared fake accounts like `ABC Interiors Admin`.
- One **Meta Business Suite** — not one per brand.
- One **Business Portfolio** per real business — keeps assets, billing, and permissions clean.
- Never connect a brand's Instagram to the wrong Page.
- Never mix assets across Portfolios (e.g. `@abcinteriors` does not belong in Hyderabad Cafe's Portfolio).
