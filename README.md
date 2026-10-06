# Portfolio Builder

A full-stack portfolio builder with AI-powered resume parsing, Supabase cloud sync, and multiple stunning templates.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables — copy the example file and fill in your own values:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   JWT_SECRET=your_long_random_secret_here
   ```

   > You can find your Supabase URL and anon key in your [Supabase Dashboard](https://supabase.com/dashboard) under **Project Settings → API**.

3. Run the full stack app:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

## Supabase Database Setup

Run the [`supabase_schema.sql`](./supabase_schema.sql) script in your Supabase SQL Editor to create all tables, indexes, triggers, and Row Level Security policies.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |
| `JWT_SECRET` | Secret key for signing Express API tokens (min 32 chars) |
| `PORT` | Express server port (default: `5000`) |

> ⚠️ **Never commit your `.env` file to GitHub.** It is already listed in `.gitignore`.
