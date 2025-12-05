# .env.local Setup Guide

Create a file named `.env.local` in your project root with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

- Replace each value with your actual credentials.
- Never commit `.env.local` to version control.
- If you need help finding these values, ask Copilot for step-by-step instructions.
