# Friday Workspace 1.0 — Frontend

Every file in this folder is real, working source code — but it has never
been through `npm install`, because the sandbox that generated it has no
internet access. That one-time install has to happen on your own machine.

## Run it (3 commands)

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).
You now have a live-reloading dev server — save any file and the browser
updates instantly.

Requires Node.js 20.19+ or 22.12+ (`node -v` to check).

## Try it

Type "active employees" or "attrition rate" into the chat box and press
Enter. After ~800ms you'll get a chart back with a working Segmented
control above it (Overall / Only Full Time / Only Contractors).

Refresh the page — your conversation is still there. Open the app in a
second browser tab — send a message in one tab, watch it appear in the
other without refreshing. That cross-tab sync is `useLocalStorage` doing
its job (see the comments in `src/hooks/useLocalStorage.js`).

## What to check against the real Figma

This was built from the assignment PDF plus the exported screenshot, not a
live pull from Figma (no login access to the file from here). Open the
Figma link side-by-side with the running app and adjust:

- `src/theme.js` — exact colors / spacing if the inspector shows different hex values
- `src/components/AppLayout.jsx` — exact left-nav items and right-sider content
- `src/data/mockDb.json` — real data if the assignment provided any

## Project structure

```
src/
  main.jsx              → entry point, wraps app in ConfigProvider
  App.jsx                → owns chatHistory state, the "send message" flow
  theme.js                → all color/spacing tokens in one place
  hooks/
    useLocalStorage.js    → persistence, the most conceptually important file
  data/
    mockDb.json           → the "backend" — chat replies + seed data
  components/
    AppLayout.jsx          → 3-column shell (Sider / Content / Sider)
    ChatMessageCard.jsx     → the ONE reusable message bubble
    DataChart.jsx            → memoized ApexCharts wrapper
    ChatInput.jsx             → the fixed-bottom input box
```

## Extending it

To make the AI "know" about a new topic: add one more entry to
`chartDataStore` in `src/data/mockDb.json` with its own `keywords` array.
No code changes needed anywhere else — `App.jsx`'s `matchIntent` function
already loops over whatever is in that file.
