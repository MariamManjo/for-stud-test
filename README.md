# Tbilisi, explored

A visual city guide and saved trip planner, built as a teaching example with Codex. It demonstrates how a frontend, backend, database, authentication, external API, and browser agent tools work together.

[Hosted example](https://tbilisi-explored.manjo-m.chatgpt.site/) · [Architecture](docs/ARCHITECTURE.md) · [Student exercises](docs/STUDENT_GUIDE.md) · [Deployment](docs/DEPLOYMENT.md)

The hosted example is private and requires an allowed ChatGPT account. Repository access does not grant access to the hosted app.

## Google login and Supabase

Google authentication and Supabase storage are the next integration. Database migrations, a real-place seed, and the account configuration steps are prepared in [the connection guide](docs/SUPABASE_GOOGLE.md). They have not been applied or connected to the live app.

## What works

- Browse six Tbilisi places with distinct photos, descriptions, and maps.
- Search, filter by category, and save favorites.
- Suggest a day based on interests and available time.
- Add, remove, and reorder stops; edit the trip name, date, and notes.
- Save one current itinerary per signed-in visitor in a D1 database.
- Retrieve live Tbilisi weather through a server-side Open-Meteo request.
- Use browser WebMCP tools where the browser supports them.

The guided planner uses predefined suggestions, not a paid language model. Time allowances are estimates, not routing results. Standard controls work without WebMCP support.

## Stack

| Layer | Implementation |
| --- | --- |
| UI | HTML, CSS, browser JavaScript |
| Backend | TypeScript route handlers with Vinext |
| Runtime | Cloudflare Workers |
| Database | Cloudflare D1 / SQLite; Drizzle schema and migrations |
| Authentication | Sites-provided ChatGPT identity in production; local mock sign-in in development |
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

Initialize the local database using the included migration:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_naive_tana_nile.sql
```

Start the development server:

```sh
npm run dev -- --port 4173
```

Open the URL printed by the server. In **My trip**, choose **Sign in with ChatGPT**. Local development uses a test identity (`seedy@sites.test`); it does not contact a real identity provider. Generate a plan, save it, and refresh to check persistence.

Do not reapply the same migration to an existing local database. For schema changes, run `npm run db:generate`, inspect the generated SQL, then apply only the new migrations in order.

## Project map

```text
public/index.html       Page markup
public/style.css        Visual design and responsive layout
public/app.js           Search, favorites, trip planner, browser tools
public/assets/          Licensed Tbilisi photographs
lib/document.ts         HTML served by the root route
lib/places.json         Initial place catalog
lib/store.ts            Database, identity, and response helpers
app/api/places/         Place catalog endpoint
app/api/state/          Private trip read/write endpoint
app/api/weather/        Weather endpoint
db/schema.ts            Database table definitions
drizzle/                Versioned database migrations
build/                  Worker and Sites integration
scripts/                Local runtime and dependency helpers
docs/                   Architecture, lessons, deployment, and credits
```

After editing `public/index.html`, run `npm run sync:html` so `lib/document.ts` stays synchronized. Build and CI check this synchronization.

## Checks

```sh
npm run check
npm run build
```

The original implementation was manually checked for save/reload, separate account data, anonymous rejection, invalid input, stale revision conflicts, cross-origin writes, favorites, live weather, and browser agent tools. CI checks JavaScript syntax, HTML synchronization, and the production build; it does not simulate those complete browser flows.

## Deployment and boundaries

This project needs a Worker runtime, a D1 binding named `DB`, database migrations, and trusted authentication. GitHub Pages can host static files but cannot run this backend. See [deployment instructions](docs/DEPLOYMENT.md).

The repository deliberately omits the hosted example's Site ID, credentials, live database contents, local database files, and environment secrets. No AI API key is required. Hosting and external services have their own usage limits; this repository does not promise unlimited free production use.

## Credits

Photo attribution and licenses are included in the app footer and [credits](docs/CREDITS.md). Third-party component and build-tool license notices are retained in `build/` and `vendor/`.
