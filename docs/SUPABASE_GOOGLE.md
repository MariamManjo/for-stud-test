# Google sign-in and Supabase: connection status

The live example currently uses Sites ChatGPT authentication and D1 storage. The Supabase files in this repository are **preparation only**: no Supabase project has been selected, no migration has been applied, and Google login is not connected. Account-level GitHub/ChatGPT connections in Supabase do not configure application authentication.

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

## Implementation after project selection

Use the supported Supabase JavaScript client for Google OAuth and session refresh. Replace the existing Sites identity adapter with server-verified Supabase authentication and pass the visitor's bearer token through to database requests so RLS applies. Never trust a user ID sent from a browser or the existing identity headers on a public standalone deployment.

Save the trip, ordered stops, and favorites together in a database transaction, checking the expected revision so concurrent tabs cannot overwrite each other. Adapt the existing API response shape to preserve the current planner UI. Replace ChatGPT links with real Google login and sign-out actions, display the visitor's account, handle cancellation and expired sessions, and reload saved data after login.

Choose an app hosting/access path that allows Google users to reach the site. The current owner-private Sites URL still has a ChatGPT access boundary. Replacing a button does not remove that boundary. Confirm the platform's external-auth path or use a standalone deployment before publishing the Google version.

Before release, test Google login/cancellation/logout/refresh; anonymous rejection; two-user data isolation; invalid place IDs; transactional rollback; stale revision conflicts; and public catalog access. The prepared SQL has not been executed or tested against a Supabase database yet.
