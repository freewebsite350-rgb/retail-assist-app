# Retail Assist Bot Prototype Test Flow

## 1. Prerequisites
- Ensure `.env.local` contains:
  - `NEXT_PUBLIC_SUPABASE_URL` (your Supabase project URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (your Supabase anon key)
  - `OPENAI_API_KEY` (your OpenAI key)
  - `SUPABASE_SERVICE_ROLE_KEY` (your Supabase service role key)
- Apply DB migrations:
  - Run: `bash scripts/supabase-migrate.sh`

## 2. Start the App
- Run: `npm install && npm run dev`
- Open: http://localhost:3000

## 3. Test the Bot Flow
### a. Sign Up / Log In
- Go to `/auth/signup` and create a user account.
- Log in at `/auth/login`.

### b. Create an Agent
- Go to `/dashboard/agents/new`.
- Fill out the agent form and submit.
- Copy the API key (masked/reveal/copy UI).

### c. Test Agent Chat
- Go to `/dashboard/agents` and select your agent.
- Use the chat playground to send a message.
- Confirm a response from the bot (OpenAI).

### d. Verify Logs
- (Optional) Check Supabase DB for `agent_logs` entries for your agent.

## 4. API Key Test
- Use Postman/curl to POST to `/api/agent/[agentId]` with `x-api-key` header.
- Confirm you get a valid response.

## 5. Troubleshooting
- If errors occur, check:
  - Console output in terminal
  - Network tab in browser
  - Supabase logs

## 6. Next Steps
- Review with partners, note any issues or improvements needed.
- Ask Copilot for amendments or new features as required.
