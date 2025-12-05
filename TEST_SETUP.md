# Comment → DM Automation: Testing Instructions

## 1. Apply Supabase Migrations

Run the migration to create the required tables:

```
supabase db push
# or
supabase db migrate up
```

## 2. Configure Environment Variables

Set these in your `.env.local`:

```
META_PAGE_ACCESS_TOKEN=your_facebook_page_token
META_VERIFY_TOKEN=your_webhook_verify_token
```

## 3. Enable Automation in Dashboard

- Go to **Dashboard → Settings**
- Fill out the **Comment → DM Automation** section
- Save your settings

## 4. Test with the CommentEventTester

- Use `/components/testing/CommentEventTester.tsx` in your app or storybook
- Paste a sample Facebook/Instagram comment webhook JSON
- Click **Simulate**
- See the result (would send DM, public reply, etc)

## 5. Test the Webhook End-to-End

- Point your Facebook/Instagram webhook to `/api/webhooks/facebook`
- Post a comment on your page or IG business account
- If automation is enabled and trigger words match, a DM and/or public reply will be sent
- Check the `automation_logs` table for event logs

## 6. Troubleshooting

- Ensure your workspace's `meta_page_id` matches the page sending the event
- Check for errors in the API response and Supabase logs
- Make sure your page access token has `pages_messaging` and `pages_manage_metadata` permissions

---

**All code is modular and production-ready. Extend as needed for your SaaS!**
# Quick Test Setup Guide

## For UI/UX Testing (No Real Credentials Needed)

### Step 1: Copy Mock Environment
```bash
cp .env.local.test .env.local
```

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Test the Flow
1. **Homepage:** http://localhost:3000
2. **Sign Up:** http://localhost:3000/auth/signup
   - Use any email/password (e.g., test@example.com / password123)
3. **Dashboard:** http://localhost:3000/dashboard
   - You'll be redirected if not logged in
4. **Create Agent:** http://localhost:3000/dashboard/agents/new
5. **Chat Playground:** http://localhost:3000/dashboard/agents (select an agent)

### Step 4: What to Expect
- Sign up/login works with mock data (no DB needed)
- Agents are saved in memory (resets on server restart)
- Chat responses are simulated (no OpenAI call)
- API keys are generated and masked/revealed

### When Ready for Production
Replace `.env.local` with real Supabase and OpenAI credentials.
