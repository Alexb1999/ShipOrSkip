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

Open [http://localhost:3000](http://localhost:3000). Sign in with **Continue as demo** (Twitter/X is optional).

## Optional keys

| Env | Why |
|---|---|
| `AUTH_TWITTER_ID` / `AUTH_TWITTER_SECRET` | Real X OAuth |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Real Checkout. If unset, payments fulfill instantly in demo mode |
| `CRON_SECRET` | `GET /api/cron?secret=...` expires bids and unresolved Call BS challenges |

## Loop

1. Claim a self-reported MRR rank
2. Share `/u/{username}` (Twitter card via `/api/og`)
3. Rivals swipe Ship/Skip (ELO) or outbid a tier/header slot
4. Dethrone pings show in the header; 1-click counter-bid
5. Call BS ($10, 48h). Verify via Stripe (or mock in dev) or drop to Homeless for 14 days
