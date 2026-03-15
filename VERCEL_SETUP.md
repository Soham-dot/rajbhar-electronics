# Vercel Setup Guide

This guide makes production behavior match local behavior for:
- Admin dashboard
- Admin authentication
- Session management
- Leads database and notifications

## 1) Add environment variables in Vercel

Open your Vercel project:
- `Settings -> Environment Variables`

Add these keys to **Production** (and Preview if needed):

### Required for admin login/session
- `ADMIN_USERNAME` = your admin username
- `ADMIN_PASSWORD` = your admin password
- `ADMIN_SESSION_SECRET` = random secret, at least 32 characters

### Required for admin dashboard leads storage
- `POSTGRES_URL` = Neon/Postgres connection string
- `DATABASE_URL` = optional fallback (can be same as `POSTGRES_URL`)

### Optional lead delivery channels
- `LEADS_WEBHOOK_URL` = webhook endpoint for lead payloads
- `RESEND_API_KEY` = Resend API key for email notifications
- `LEADS_FROM_EMAIL` = verified sender email in Resend
- `LEADS_NOTIFY_EMAIL` = recipient email for lead notifications

### Optional session duration
- `ADMIN_SESSION_TTL_HOURS` = session lifetime in hours (example: `9`)

## 2) Configure GitHub secrets for automatic deploy

This repo now includes:
- `.github/workflows/deploy-vercel.yml`

It deploys to Vercel production automatically after `CI Build and Lint` succeeds on `main`.

Add these repository secrets in GitHub:
- `Settings -> Secrets and variables -> Actions -> New repository secret`

Required secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

How to get them:
- `VERCEL_TOKEN`: Vercel dashboard -> Account Settings -> Tokens
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
  - Run `npx vercel link` locally once, then open `.vercel/project.json`
  - Copy `orgId` and `projectId` into GitHub secrets

## 3) Trigger deployment

- Push to `main` and GitHub Actions will deploy automatically.
- You can also run the workflow manually from Actions:
  - `Deploy to Vercel Production` -> `Run workflow`

## 4) Verify admin flow

1. Visit `/admin/login`
2. Login with `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. Open `/admin`
4. Confirm session stays active and lead list loads

## 5) Common production issues

- `Unauthorized` on admin API:
  - Session cookie may be missing/expired. Login again.
- `Admin session secret is not configured`:
  - Add `ADMIN_SESSION_SECRET` in Vercel and redeploy.
- `Database is not configured`:
  - Add `POSTGRES_URL` or `DATABASE_URL` in Vercel and redeploy.
- Deploy workflow fails with missing secret:
  - Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` in GitHub Actions secrets.

## Security notes

- Never commit real secrets to Git.
- Keep `.env.local` for local machine only.
- Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` if exposed.
