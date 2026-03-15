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

## 2) Redeploy after saving variables

After env changes, trigger a fresh deployment so server functions pick up new values.

## 3) Verify admin flow

1. Visit `/admin/login`
2. Login with `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. Open `/admin`
4. Confirm session stays active and lead list loads

## 4) Common production issues

- `Unauthorized` on admin API:
  - Session cookie may be missing/expired. Login again.
- `Admin session secret is not configured`:
  - Add `ADMIN_SESSION_SECRET` in Vercel and redeploy.
- `Database is not configured`:
  - Add `POSTGRES_URL` or `DATABASE_URL` in Vercel and redeploy.

## Security notes

- Never commit real secrets to Git.
- Keep `.env.local` for local machine only.
- Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` if exposed.
