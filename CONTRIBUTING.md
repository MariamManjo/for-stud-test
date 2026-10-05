# Contributing

1. Create a branch for a focused change.
2. Run the app locally using the README.
3. Change the relevant source and documentation together.
4. If markup changes, run `npm run sync:html`.
5. Run `npm run check` and `npm run build`.
6. Open a pull request explaining the user-visible change and how you checked it.

Keep API keys, local database state, personal trip notes, and generated builds out of commits. Preserve photo attribution and third-party license notices.

Database migrations are append-only after they have been applied. Generate a new migration for later schema changes instead of rewriting applied SQL.
