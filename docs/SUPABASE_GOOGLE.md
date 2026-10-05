# Google sign-in and Supabase: connection status

The app now uses the supported Supabase JavaScript SDK for Google OAuth, public place reads, and user-owned trip data. The database schema, seed, and transactional save function have been applied to the owner's project. Google is enabled with a test user; completing a real visitor login is a separate release check.

## What the owner needs to configure

1. Open https://supabase.com/dashboard/organizations. Create or select an organization, then a project. Enter the database password directly in Supabase, not in chat or GitHub. Send Codex the project's dashboard URL so it can identify the intended project.
2. Apply `supabase/migrations/202610050001_tbilisi.sql` in the project's SQL Editor once. Then apply `supabase/seed.sql`. These files create app-specific tables; do not run them against a project containing tables with the same names without reviewing the conflict first.
3. In Google Cloud, create/select a project and configure Google Auth Platform branding, audience, and the `openid`, `email`, and `profile` scopes. Create an OAuth client of type **Web application**. While Google is in testing mode, add the people who will test login as test users.
4. In Supabase **Authentication → Sign In / Providers → Google**, enable Google. Enter the Google client ID and secret directly there. Copy the Supabase callback URL shown on that page into Google's **Authorized redirect URIs**. Set the app's origin as an authorized JavaScript origin.
5. In Supabase **Authentication → URL Configuration**, set the final app URL and allow the exact application callback URL. The Supabase callback in Google settings and the application's return URL are different URLs.
6. The frontend needs the project URL and **publishable key** (or legacy anon key), available in the project connection/settings view. These are public app configuration. A secret/service-role key must never go in the browser or repository. This app does not need a service-role key for user-owned data.

Official setup: https://supabase.com/docs/guides/auth/social-login/auth-google
Redirects: https://supabase.com/docs/guides/auth/redirect-urls
Database isolation: https://supabase.com/docs/guides/database/postgres/row-level-security

## Prepared database

- `tbilisi_places`: the six existing, sourced city-guide entries with their photographs, coordinates, and references. Visitors may read; visitors cannot edit the catalog.
- `tbilisi_trips`: one trip per Supabase user, with name, date, notes, and revision.
- `tbilisi_trip_stops`: ordered stops linked to real catalog entries.
- `tbilisi_favorites`: user-owned saved places.

Foreign keys reject nonexistent places. Row-level security requires the authenticated Supabase user ID to match every private row's owner. Deleting an auth user removes their trip, stops, and favorites. Existing D1 data is not automatically copied: a ChatGPT user ID cannot be assumed to identify the same person as a Supabase UUID.

## Implemented connection

`browser/supabase.js` creates a PKCE client; `scripts/build-auth.mjs` bundles it for the browser. The URL and publishable key are public configuration. Supabase verifies bearer tokens and applies RLS to every private database operation. The `save_tbilisi_trip` function is security invoker and atomically saves stops, favorites, and trip details using the expected revision.

The old D1 trip and catalog API endpoints return HTTP 410. No client-supplied identity headers grant access to the new data. The guide allows anonymous browsing/planning; Google sign-in is required to save. Unsaved anonymous drafts are discarded on sign-in after a confirmation.

Verified in the actual database: atomic save, stop ordering, stale revision rejection, rollback on nonexistent place IDs, and cross-user isolation. Temporary verification users and records were rolled back. The local browser loaded six Supabase places and live weather, generated a draft, and rejected anonymous saving. A complete Google consent/login/save/reload test still requires the owner's Google account.

Existing D1 trip data is not automatically migrated to Supabase identities.
