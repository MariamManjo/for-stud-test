# Hosting

The existing Sites host supports public access, with Supabase Google sign-in inside the app for saving private data. Vercel is optional; no second hosting service is required.

This repository currently builds a Cloudflare Worker with Vinext. Do not import it into Vercel as an ordinary Next.js deployment without adapting the build/runtime and weather route. Supabase remains the same backend if you later move hosts. Update the Google JavaScript origin and Supabase allowed return URL to the new domain before testing login.

For a new copy, configure your own Supabase project and public client configuration, apply both Supabase migrations and the seed, enable Google, and use the Sites plugin to register and deploy the Worker. The legacy D1 migrations are retained only as historical teaching material.

Release checks: public browsing, Google cancellation/login/logout, save/reload, two-user isolation, stale revisions, invalid stops, mobile layout, and weather failure handling. Google OAuth stays limited to configured test users while its audience is in testing mode.
