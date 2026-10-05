# Learn by changing the city guide

## Lesson 1: Frontend and UX

Find a place card in `public/app.js` and its styles in `public/style.css`. Change spacing or typography, then check both a wide and narrow screen. Explain what happens when a search returns no matches.

Exercise: add a visible saved marker to cards without introducing a nested button inside the existing card button. Keep the marker accessible.

## Lesson 2: APIs

Read the weather route and inspect its response in the browser's network panel. Identify the difference between a browser calling your backend and your backend calling an external provider.

Exercise: display the next two forecast days. Preserve the provider credit and the existing unavailable state.

## Lesson 3: Backend and database

Trace **Save my trip** from the button to `PUT /api/state`, then to the D1 prepared statement. Save a plan and refresh. Identify which information is persisted and which interface state resets.

Exercise: add a preferred start time. Update the backend validation and frontend together. The trip JSON can hold the field without a new database column; explain when a dedicated column would be useful.

## Lesson 4: Identity and authorization

Compare the local sign-in mock with the production identity boundary. Explain why checking a user ID only in the browser would be insufficient.

Exercise: open two tabs, load the same plan, save a change in one, then try saving the older draft in the other. Confirm that the conflict message appears and that the newer save is preserved.

## Lesson 5: Agent tools

Inspect the WebMCP registrations. Identify which tools only change a draft and which persist data. A supported browser is required to invoke the tools; normal controls remain available elsewhere.

Exercise: design a `read_current_trip` tool. Return only the current visitor's plan, handle unavailable state, and mark it read-only. Validate valid input and an expected failure case.

## Final demonstration

Show a complete visitor flow: find a place, save it, create a day plan, reorder a stop, save, and reload. Explain the frontend, backend, database, API, and authentication role at each step.

Use test accounts and sample notes during class. Do not commit real student records or API secrets.
