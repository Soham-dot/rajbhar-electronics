# Rajbhar Electronics

Production-ready website for Rajbhar Electronics (TV repair service), built with Next.js App Router.

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Neon Postgres (`@neondatabase/serverless`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill values.

Admin/auth variables:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_TTL_HOURS` (optional)

Database variables:
- `POSTGRES_URL`
- `DATABASE_URL` (optional fallback)

Lead notification variables (optional):
- `LEADS_WEBHOOK_URL`
- `RESEND_API_KEY`
- `LEADS_FROM_EMAIL`
- `LEADS_NOTIFY_EMAIL`

## Production (Vercel)

For complete hosting setup, see:
- [VERCEL_SETUP.md](./VERCEL_SETUP.md)

## Build

```bash
npm run build
npm start
```
