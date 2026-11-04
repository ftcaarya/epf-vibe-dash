# Jobs & Vibes — U.S. Unemployment Vibe Dashboard

A one-page "Evaluate the Economy" dashboard on the U.S. unemployment rate (U-3, seasonally adjusted), by Aarya Raut. Data is current as of October 30, 2026 (latest jobs report: September 2026).

## Open it

- **Locally:** double-click `index.html`. It works from `file://` because the data loads as a `<script>`, not with `fetch`.
- **GitHub Pages:** go to repo Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.

## Files

| File | What it is |
|---|---|
| `index.html` | All page content, Q&A answers and the MLA Works Cited |
| `styles.css` | Layout and theme; responsive from 375px phones to laptops |
| `script.js` | Trendline chart (Chart.js), Vibe Meter gauge (SVG), Confidence Loop toggle |
| `data/unrate.csv` | Raw FRED download, series UNRATE, Jan 2019 → Sep 2026 |
| `data/unrate.js` | The same data as a JS array (Oct 2025 = `null`, never collected because of the shutdown) |

Chart.js `4.4.1` and chartjs-plugin-annotation `3.0.1` load from jsDelivr, pinned to exact versions with SRI hashes, so a new library release can't change or break the page.

## Updating the data

1. Re-download `https://fred.stlouisfed.org/graph/fredgraph.csv?id=UNRATE&cosd=2019-01-01` into `data/unrate.csv`.
2. Regenerate `data/unrate.js` with the same `{ date: "YYYY-MM", rate: N }` format.
3. Update the hero KPIs, the Data Q&A, the caption and source [1] in `index.html`.
