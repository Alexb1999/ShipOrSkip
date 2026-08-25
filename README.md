# ShipOrSkip.lol

Viral, satirical indie-hacker discovery: MRR tiers, a Tinder-style Ship/Skip deck, pay-to-outbid hijacks, Call BS stakes, and Open Graph flex cards.

## Run locally

```bash
cp .env.example .env
# Postgres: Docker Desktop, or Homebrew `brew services start postgresql@15`
# then: createuser -s shiporskip && createdb -O shiporskip shiporskip
docker compose up -d   # if Docker is running
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with **Continue as demo** (Twitter/X is optional). Demo login and free checkout are **off in production** unless you set `ALLOW_DEMO_LOGIN` / `ALLOW_DEMO_PAYMENTS`.

## Optional keys

| Env | Why |
|---|---|
| `AUTH_TWITTER_ID` / `AUTH_TWITTER_SECRET` | Real X OAuth. Required on production (demo login is off). |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Real Checkout. Locally, payments fulfill instantly if unset. Production refuses checkout without a key. Webhook: `/api/webhooks/stripe` |
| `CRON_SECRET` | `GET /api/cron?secret=...` expires bids and unresolved Call BS challenges |
| `TRUSTMRR_API_KEY` | Optional. Public TrustMRR pages work without it. Official API is used if set. |
| `ALLOW_DEMO_LOGIN` | `true` to keep `@demo_hacker` on a staging deploy |
| `ALLOW_DEMO_PAYMENTS` | `true` to allow instant unpaid checkout on staging |

## Loop

1. Claim a self-reported MRR rank
2. Share `/u/{username}` (Twitter card via `/api/og`)
3. Rivals swipe Ship/Skip (ELO) or outbid a tier/header slot
4. Dethrone pings show in the header; 1-click counter-bid
5. Call BS ($10, 48h). Prove it with a TrustMRR URL or drop to Homeless for 14 days
6. Super Ship ($15): 10× ELO, 24h front of deck, +500 impressions
