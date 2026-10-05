# Tbilisi, explored

A visual city guide and saved trip planner, built as a teaching example with Codex. It demonstrates how a frontend, backend, database, authentication, external API, and browser agent tools work together.

[Hosted example](https://tbilisi-explored.manjo-m.chatgpt.site/) · [Architecture](docs/ARCHITECTURE.md) · [Student exercises](docs/STUDENT_GUIDE.md) · [Deployment](docs/DEPLOYMENT.md)

The guide uses Google sign-in through Supabase. Places are publicly readable; trips and favorites belong to the signed-in Supabase user. Google OAuth is currently in testing mode, so add permitted test accounts in Google Cloud before testing sign-in.

## Google login and Supabase

The app connects to the owner's Supabase project. To use your own database, apply both migrations under `supabase/migrations/`, then `supabase/seed.sql`, and replace the public project URL and publishable key in `browser/supabase.js`. Configure Google OAuth and return URLs using [the connection guide](docs/SUPABASE_GOOGLE.md). Run `npm run build:auth` after changing client configuration. Never put a Google client secret or Supabase secret/service-role key in frontend code.

## What works

- Browse six Tbilisi places with distinct photos, descriptions, and maps.
- Search, filter by category, and save favorites.
- Suggest a day based on interests and available time.
- Add, remove, and reorder stops; edit the trip name, date, and notes.
- Save one current itinerary per Google user in Supabase Postgres.
- Retrieve live Tbilisi weather through a server-side Open-Meteo request.
- Use browser WebMCP tools where the browser supports them.

The guided planner uses predefined suggestions, not a paid language model. Time allowances are estimates, not routing results. Standard controls work without WebMCP support.

## Stack

| Layer | Implementation |
| --- | --- |
| UI | HTML, CSS, browser JavaScript |
| Backend | TypeScript route handlers with Vinext |
| Runtime | Cloudflare Workers |
| Database | Supabase Postgres with row-level security |
| Authentication | Supabase Google OAuth with PKCE and automatic session refresh |
| Weather | Open-Meteo |
| Maps | OpenStreetMap embeds and links |

## Run locally

Install Node.js 22.13 or newer and npm. Then:

```sh
git clone https://github.com/MariamManjo/for-stud-test.git
cd for-stud-test
npm run install:ci
npm run build
```

Start the development server:

```sh
npm run dev -- --port 4173
```

Browsing and guided planning work anonymously. Saving requires a real Google session. For local Google login, add your exact localhost return URL to Supabase's redirect allowlist. Google login no longer uses the starter's mock identity or D1 database.

After editing `public/index.html`, run `npm run sync:html` so `lib/document.ts` stays synchronized. Build and CI check this synchronization.

## Checks

```sh
npm run check
npm run build
```

The original implementation was manually checked for save/reload, separate account data, anonymous rejection, invalid input, stale revision conflicts, cross-origin writes, favorites, live weather, and browser agent tools. CI checks JavaScript syntax, HTML synchronization, and the production build; it does not simulate those complete browser flows.

## Deployment and boundaries

This version runs on a Worker host and uses Supabase for authentication and application data. The legacy D1 binding is retained for host compatibility but is not used by the new trip or catalog flows. GitHub Pages can host static files but cannot run this backend. See [deployment instructions](docs/DEPLOYMENT.md).

The repository deliberately omits the hosted example's Site ID, credentials, live database contents, local database files, and environment secrets. No AI API key is required. Hosting and external services have their own usage limits; this repository does not promise unlimited free production use.

## Credits

Photo attribution and licenses are included in the app footer and [credits](docs/CREDITS.md). Third-party component and build-tool license notices are retained in `build/` and `vendor/`.
