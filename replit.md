# Retail Assist App

## Overview
A Next.js SaaS application for AI-powered customer automation. Deploy AI agents across Messenger, Instagram DM, and websites to handle customer conversations with custom AI personalities powered by OpenAI.

## Project Architecture

### Tech Stack
- **Framework**: Next.js 16.0.7 with React 19
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API
- **Social Integration**: Facebook/Instagram webhooks

### Directory Structure
```
app/                    # Next.js App Router pages
├── admin/             # Admin login and dashboard
├── api/               # API routes (agents, webhooks, automation)
├── auth/              # Authentication pages (login, signup, reset)
├── components/        # Reusable UI components
├── dashboard/         # Main dashboard with agents, analytics, inbox
├── marketing/         # Landing page components
└── test/              # Testing pages

components/            # Shared components
├── dashboard/         # Dashboard-specific components
└── testing/           # Testing utilities

lib/                   # Business logic and utilities
├── automation/        # Comment automation logic
├── meta/              # Facebook/Instagram API helpers
├── openai/            # OpenAI integration (with mock for testing)
├── supabase/          # Supabase client configuration
└── utils/             # Helper functions

supabase/migrations/   # Database migration files
scripts/               # Setup and testing scripts
```

## Environment Variables

### Required for Production
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret)
- `OPENAI_API_KEY` - OpenAI API key (secret)

### Optional (for Facebook/Instagram integration)
- `META_PAGE_ACCESS_TOKEN` - Facebook page access token
- `META_VERIFY_TOKEN` - Webhook verification token

## Development

### Running Locally
The app runs on port 5000:
```bash
npm run dev
```

### Mock Mode
The app includes mock implementations for testing without real credentials:
- `lib/supabase/mock-client.ts` - Mock Supabase client
- `lib/openai/mock.ts` - Mock OpenAI responses

### Database Migrations
Apply Supabase migrations:
```bash
supabase db push
```

## Key Features
1. **AI Agents** - Create and manage custom AI agents
2. **Comment Automation** - Auto-reply to Facebook/Instagram comments
3. **Direct Messages** - Send automated DMs based on triggers
4. **Analytics Dashboard** - Track conversation metrics
5. **Visual Search** - Product image search capabilities
6. **Website Integration** - Embed chat widget on websites

## Deployment
Configured for autoscale deployment with:
- Build: `npm run build`
- Start: `npm run start`
