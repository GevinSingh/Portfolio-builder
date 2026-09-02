<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2abeab7c-4a57-4be8-aa35-a5318be81a04

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Environment variables in [.env](.env) & [.env.local](.env.local):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://glhowtmwkgzylfoglwhy.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS
   VITE_SUPABASE_URL=https://glhowtmwkgzylfoglwhy.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_yEAo5ZQIbFqNq6M3omLoBw_7b5hyrdS
   ```
3. Run the full stack app:
   `npm run dev` or `npm start`
