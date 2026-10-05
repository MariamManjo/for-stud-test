# Deploying your own copy

## Sites

The hosted example runs on Sites. This repository's `.openai/hosting.json` declares a logical D1 binding (`DB`) and intentionally has no project ID.

To create your own deployment, ask Codex with the Sites plugin to open this repository, register a new Site, preserve `DB`, build the Worker, apply the included migrations, and publish privately. Sites manages the real database binding and authentication boundary. Do not copy another project's Site ID or publish into the example's deployment.

## Other Cloudflare Workers deployments

The build emits a Worker, but a standalone deployment also needs:

1. A real D1 database bound as `DB`.
2. The included migrations applied to that database in order.
3. A verified authentication/session provider replacing `identity()` in `lib/store.ts`.
4. Frontend sign-in/sign-out links adapted to that provider.
5. A deliberate public/private access policy.

Do not deploy the existing identity-header adapter on an unprotected public endpoint. The `oai-authenticated-user-*` headers are trustworthy only behind the Sites authentication boundary.

## Local production preview

After building and applying local migrations:

```sh
npm start -- --port 4174
```

The built preview has no sign-in simulator. Use `npm run dev` for classroom sign-in demonstrations. Both previews use the project-local `.wrangler/state` database directory.

## Release checks

- Search and category filters work, including empty results.
- A signed-in visitor can save and reload favorites and itinerary details.
- Anonymous trip API requests are rejected.
- One visitor cannot retrieve another visitor's trip.
- Invalid place IDs and malformed dates are rejected.
- A stale revision produces a conflict instead of overwriting newer data.
- Weather failure leaves the rest of the app usable.
- Images and attributions load correctly.

CI builds the app but does not deploy it. Production database records and migrations must be managed separately from source changes.
