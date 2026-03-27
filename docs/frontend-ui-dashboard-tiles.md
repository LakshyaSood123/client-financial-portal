# Frontend UI Dashboard Tiles

## What changed
- Added a distributed tile layout for the portal usage dashboard (`/portal/stats`) with KPI gradient tiles, a wide chart card, and a status tile.
- Updated the global theme variables and dashboard styles to match an Adminity-style palette (light app background, dark sidebar, white cards, vibrant gradients).
- Added mock preview via query string (`?mock=1`) on `/portal/stats` without changing auth logic.

## Theme variables
Theme variables live in `src/styles/app.css` and include:
- Layout: `--bg`, `--panel`, `--panel2`, `--brand-blue`, `--text`, `--muted`, `--border`
- Gradients: `--grad-orange-*`, `--grad-green-*`, `--grad-pink-*`, `--grad-teal-*`
- Chart palette: `--chart-orange`, `--chart-green`, `--chart-pink`, `--chart-teal`

Dashboard-specific layout classes live in `src/styles/dashboard.css`.

## How to preview
- Portal usage page: `http://localhost:5173/portal/stats`
- Mock layout preview: `http://localhost:5173/portal/stats?mock=1`

## Accessibility notes
- Focus-visible outlines are enabled for buttons and nav items.
- Icon-only actions include tooltips (native title + CSS tooltip).
- Card hover includes subtle lift to aid visual affordance.
