# Execution Plan: "Jobs & Vibes" Unemployment Vibe Dashboard

**Source:** `unemployment-vibe-dashboard-PRD.md`
**Prepared:** November 4, 2026
**Status:** Steps 1–9 and 11 built (Nov 4, 2026). Step 10 skipped: the due date was Oct 30, so the September data is the right "latest." Step 12 (deploy) is waiting on approval to push.

**Decisions made:** D1 Aarya Raut · D2 MLA · D3 due Oct 30, so September 2026 data is used and comparisons are vs. Sep 2025 / Sep 2023 · D4 GitHub Pages · D5 three files. All fixes #1–13 applied. Source research swapped weak or secondary sources for Fed, BLS and CBO-based ones (28 sources, every one cited on the page).

This plan turns the PRD into ordered build steps. Each step lists what gets built, which PRD section it covers, and a "done when" check. Before the steps there's a list of problems I found in the PRD and the questions I need you to answer before I start.

---

## 0. Before We Start

### 0.1 Decisions I need from you

| # | Question | Default if you don't answer |
|---|---|---|
| D1 | Your name for the byline and the chart credit ("Chart created by [student name]") | Leave `[Your Name]` as a placeholder |
| D2 | Citation style, MLA or APA (PRD 6.8 says "ask teacher") | MLA 9 |
| D3 | When is this due? Before or after the Oct jobs report on **Fri Nov 6, 8:30 a.m. ET**? | Build with September data and leave one config block that's easy to update (Step 10) |
| D4 | Where will it be hosted: GitHub Pages, Netlify Drop, or just a local file? | GitHub Pages from this repo, which also works opened locally |
| D5 | Three files (`index.html` / `styles.css` / `script.js`) or one self-contained file? | Three files plus `data/` |

### 0.2 Problems found in the PRD (fix or confirm)

These came up while I read the PRD closely. None of them blocks the build, but each one could cost points or confuse the grader.

**Content and layout inconsistencies**
1. **Fiscal grid shape.** 6.5 says "2×3 grid of cards", but the table has **4** actions. Plan: a **2×2 grid** (increase/decrease spending, tax cuts/increases) where each card shows action → spending effect → unemployment effect.
2. **Coordinated Action Plan is missing from the layout.** 6.7 is specced, but the Section 5 layout diagram and the "8 sections" count in Section 3 leave it out. Plan: put it as a closing banner between Fed Pitch and Sources, with its own nav link.
3. **The gauge needle would sit on a zone line.** With 5 equal zones, each zone covers 20% of the arc. "≈40%" is exactly the line between Concern and Cautious, so the needle would look like it points at both. Plan: set it at **~45%**, inside Cautious and leaning left toward Concern.
4. **Loop B has no per-box text.** Loop A has 6 boxes with titles and descriptions. Loop B is one sentence. The toggle swaps box text, so Loop B needs 6 matching boxes. I'll write them from the PRD sentence (draft in Step 5).
5. **Arrow tooltip count.** There are 6 arrows but only 5 research questions, and Q5 ("opposite direction") belongs on the toggle, not on an arrow. Plan: Q1–Q4 go on arrows 1→2 through 4→5. Arrows 5→6 and 6→1 get short tooltips based on the "two-thirds of GDP" line and the spiral. Q5 goes next to the toggle button.
6. **The Y-axis range of 0–16 squashes the recent trend.** The 2023–2026 movement (3.7 → 4.5 → 4.2) will look almost flat, and that's the period the questions focus on. Plan: keep the required full view and add a **"Zoom: 2023–now"** toggle that rescales to about 3–5%. This is a cheap way to earn "Exceeds" on the visualization row.
7. **Event label crowding.** Sep 2025, Nov 2025, and the Oct 2025 gap note are within 3 months of each other. Plan: stagger the label heights and shorten the text on narrow screens.

**Citation and fact-check flags** (rubric: "every number traceable to a source")
8. **Uncited claims:** "Mar 2022 Fed begins rate hikes" (no source), "consumer spending ≈ two-thirds of GDP" (no source), and "Inflation is 3.7% **and rising**" on the Lower-rates card (no source shows "rising"). Plan: add a citation for the first two (Fed press release / BEA) and soften the third to "Inflation is 3.7%, well above 2%" unless [8] shows it rising.
9. **Source [6] mismatch.** The marker "Sep 2025: Fed starts 3 rate cuts" cites a *July 2026* rate-decision article. It probably mentions the cuts, but a Sep 2025 FOMC statement would be a cleaner source.
10. **Source [3] is overloaded.** One Trading Economics article titled "...4.4% in February" is cited for Nov 2025, Jan 2026, and Mar 2026 values. Plan: check those numbers against the FRED CSV and cite [2] (FRED) for the chart points instead.
11. **Weak or incomplete sources:** [21] has **no URL**. [16] (`financecalendar.com/?p=1337`) looks like a weak source for an "all-time record low", so swap it for the UMich release or a major outlet if one exists. [19] links to a generic BLS update page, so find the exact *Economics Daily* article URL.
12. **Numbers to double-check against the source:** LFPR 61.8% vs. 62.5% a year earlier (a 0.7-pt drop is unusually large). 7.1M unemployed and 7.1M job openings (same number, so make sure they weren't mixed up). Core CPI 2.6% vs. headline 3.7% (a big gap; confirm in [8]).
13. **Unpinned CDN.** `https://cdn.jsdelivr.net/npm/chart.js` always loads the newest version, so a future release could break the page while it's being graded. Plan: pin exact versions, e.g. `chart.js@4.4.1` and `chartjs-plugin-annotation@3.0.1`.

---

## 1. Build Steps

### Step 1 — Project scaffold
**Covers:** PRD §4
- Create `index.html`, `styles.css`, `script.js`, `data/unrate.csv`, `data/unrate.js`, `README.md`.
- Add the pinned Chart.js and annotation plugin `<script>` tags and the Google Font (Inter).
- Hold all "freshness-sensitive" values (latest month, rate, jobs added, the comparisons) in **one `CONFIG` object** at the top of `script.js`, so the Nov 6 update means editing one place (see Step 10).

**Done when:** the empty page opens locally and from a static server with no console errors.

### Step 2 — Data pipeline
**Covers:** PRD §6.1 data table, §9
1. Download FRED **UNRATE** CSV, Jan 2019 → latest, into `data/unrate.csv`. *(I can fetch this. You confirm the file.)*
2. Convert it to `data/unrate.js` → `const UNRATE = [{date:"2019-01", rate:4.0}, …]`, with **Oct 2025 = `null`**.
3. Load the data as a `<script>`, **not** with `fetch()`. `fetch` fails when the page is opened as a local `file://`, and the PRD wants the page to never break during grading.
4. Check the CSV against the PRD's verified table: Sep 2023 = 3.7, Sep 2025 = 4.4, Nov 2025 = 4.5, Jan–Sep 2026 values. **Write down every mismatch** and resolve it (FRED's current vintage wins on the chart, per the PRD).
5. Read the April 2020 peak from the CSV. Don't type it from memory.

**Done when:** the array has every month from Jan 2019 to Sep 2026, Oct 2025 is null, and every cross-check passes or has a written resolution.

### Step 3 — Page skeleton, nav, hero
**Covers:** PRD §5, §6.0, §7
- Semantic sections with ids: `#data`, `#vibe`, `#loop`, `#wealth`, `#fiscal`, `#fed`, `#plan`, `#sources`.
- Sticky top nav with anchor links. On phones it collapses to a horizontally scrollable pill row so there's no hamburger menu.
- Hero: title, subtitle, **4 KPI cards** (4.2% · ↓0.2 pts · ↑0.5 pts · +29,000), each with a superscript source link, and the verdict banner.
- Design tokens: navy `#1e293b` header, gray page background, white cards, 12px corners, colored top borders per section (§7).
- Citation component: `<sup><a href="#src-N">[N]</a></sup>` used everywhere. Sources get `id="src-N"` and a `:target` highlight so clicking a [#] visibly jumps to and highlights that source (§8).

**Done when:** the nav scrolls to every section, the KPI cards wrap to a 2×2 layout at 375px, and every KPI has a working source link.

### Step 4 — Component 1: Trendline
**Covers:** PRD §6.1, rubric rows 1–2
- Chart.js line chart with **category labels** ("Jan 2019"…), so no date-adapter library is needed. Title, axis labels, Y range 0–16.
- Annotation plugin:
  - Shaded box Mar 2020 → last month, labeled "Post-Pandemic Period."
  - 6 dashed vertical event lines with labels at staggered heights (fix #7).
  - Small note at Oct 2025: "No Oct 2025 data — gov't shutdown [10]".
- `spanGaps: true`. Tooltip format: "Month YYYY: X.X%". For Oct 2025 it says "not published (shutdown)".
- **Zoom toggle** "Full view / 2023–now" (fix #6).
- Below the chart: source line, 3–5 sentence caption, **5-row Q&A list**, and the **stat-chip strip** (LFPR, long-term unemployed, Black unemployment, real wages, job openings), each with a citation.
- Accessibility: `role="img"` plus an `aria-label` that summarizes the trend, and a collapsible **"View data as table"** `<details>` element as a non-visual fallback.

**Done when:** all 6 markers and the band show at 1280px, labels don't overlap at 375px, the tooltip works on hover and tap, and the caption + Q&A match the plotted numbers.

### Step 5 — Component 2: Vibe Meter
**Covers:** PRD §6.2, rubric row 3
- **Inline SVG** semicircle with 5 equal arc zones (Panic → Exuberance). Each zone has a **text label on the arc** so color is never the only signal.
- Zones are focusable `<g tabindex="0">` elements with hover/tap/focus popovers showing each zone's definition.
- Needle animates from 0 to **~45%** (fix #3) the first time the gauge scrolls into view (`IntersectionObserver`). Skip the animation if the user has `prefers-reduced-motion` set.
- "Today's Rating: CAUTIOUS" label. The SVG gets an `aria-label` that states the rating.
- **Evidence panel:** two columns (Worried / Steady, 4 rows each) that stack on mobile.
- **Rating Defense** paragraph, plus a **4-question Q&A**.
- **3 headline cards:** colored pill (Positive / Negative / Neutral), exact headline, outlet, date, one-line takeaway, and a link that opens in a new tab.

**Done when:** the needle lands visibly inside Cautious, all 5 zone definitions can be reached by keyboard and by tap, and every headline link resolves.

### Step 6 — Component 3: Confidence Loop
**Covers:** PRD §6.3, rubric row 4
- **Desktop:** 6 boxes in a circle (CSS grid in a ring, or an SVG with positioned boxes) with curved arrows. **Mobile:** a vertical stack with a "↺ back to step 1" arrow at the bottom.
- Each box has an emoji icon, a bold title, and 1–2 lines of text.
- **Toggle button** "Unemployment rises ↔ falls" swaps all 6 boxes between Loop A and Loop B. The button uses `aria-pressed`, and the change is announced through an `aria-live` region.
- Loop B box text (fix #4, please review):
  1. 📉 **Unemployment falls / hiring picks up**
  2. 😊 **Confidence rises**: workers feel secure in their jobs
  3. 🛍️ **Spending rises**: families make the big purchases they had delayed
  4. 🏪 **Business revenue rises**: firms add shifts and hire
  5. 📈 **GDP grows**: more consumer spending means more output
  6. 🔁 **Even more hiring**: an upward spiral (if it overheats, it can push up inflation)
- Arrow tooltips per fix #5. Q5 sits next to the toggle.
- **Current-data callout** ("stalled loop", GDP +3.4% [18]).

**Done when:** the toggle switches all text both ways, the arrow tooltips work on hover, tap, and focus, and the layout holds at 375px.

### Step 7 — Component 4: Wealth Effect (optional, included)
**Covers:** PRD §6.4
- A short card with the PRD paragraph and the **multiplier mini-diagram**: a horizontal chain of 7 pills that wraps on mobile.
- If possible, add one citation (e.g., a BEA or Fed note on the wealth effect) so the section isn't the only uncited one.

**Done when:** the card renders and the chain wraps cleanly.

### Step 8 — Component 5: Fiscal Policy
**Covers:** PRD §6.5, rubric row 5
- **2×2 cause-and-effect grid** (fix #1). Each card shows action → spending effect → unemployment effect with ⬆️/⬇️ arrows **and** words.
- 5-question Q&A list, including "recession → expansionary" and "inflation → contractionary".
- **Current context box:** OBBBA ~$285B / ~1% of GDP [20], FY2026 deficit $1.9T / 5.8% of GDP [21, needs a URL], inflation 3.7% [8].
- **Policy Advisory** with a highlighted "Recommendation: MAINTAIN" label.

**Done when:** the grid reads correctly with colors turned off, and every context number is cited.

### Step 9 — Fed Pitch, Action Plan, Sources
**Covers:** PRD §6.6–6.8, rubric rows 6–7
- **Current-setting strip:** 3.75–4.00%, Sep hike / Oct 28 hold [7][22], Chair Warsh [23], next FOMC Dec 8–9 [22].
- **3 option cards.** Hold is enlarged and gets a "✅ MY RECOMMENDATION" badge. Raise and Lower are dimmed, and their "why not" text expands on hover or focus and is always visible on touch screens.
- 5-question Analysis Framework, plus the Recommendation paragraph with the conditions for changing course (>4.5% → cut, core inflation keeps rising → hike).
- **Coordinated Action Plan:** two-column closing banner and the closing line (fix #2).
- **Sources:** numbered list `id="src-1"…"src-23"` (plus any added in fix #8), formatted in the citation style from D2, with full URLs.

**Done when:** every `[N]` on the page jumps to a source that exists, and no source goes uncited or unused.

### Step 10 — October jobs-report update (Nov 6, 2026 or later)
**Covers:** PRD warning banner, §9 step 4
Only if the project is turned in after Nov 6, 8:30 a.m. ET:
1. Re-download the FRED CSV (or add the October point from the BLS release).
2. Update `CONFIG`: latest month/rate, jobs added, 1-yr comparison (vs. Oct 2025, which is **null** because of the shutdown, so change the 1-yr card to compare against Nov 2025 or Sep 2025 and say which), and the 3-yr comparison (vs. Oct 2023).
3. Rewrite the hero KPIs, Data Q&A #1–3 and #5, the caption, the evidence panel, and the Fed analysis if the story changed (e.g., the rate jumps).
4. Update source [1] to the October Employment Situation release.

**Done when:** no "September 2026 (latest)" wording is left anywhere on the page.

> ⚠️ **Watch out:** with October data, the "vs. 1 year ago" comparison hits the missing Oct 2025 value. Decide how to handle it before you update the hero card.

### Step 11 — QA pass
**Covers:** PRD §2, §4, §10, §11
- **Responsive:** 375px, 768px, 1280px, with no horizontal scroll (check `document.documentElement.scrollWidth`).
- **Accessibility:** keyboard-only walkthrough, focus outlines visible, chart and gauge labeled, reduced motion respected, contrast ≥ 4.5:1 on text.
- **Citations audit:** list every number on the page → confirm it has a [N] → confirm source N supports it. Write the audit to `QA-CHECKLIST.md`.
- **Links:** every external URL returns 200 (scripted check). Fix or replace dead ones.
- **Console:** zero errors when served and when opened as `file://`.
- **Proofread:** spelling, consistent month formats ("Sept" vs. "Sep"; I'll standardize on "Sep"), consistent "pts" usage.
- Tick off **§10 acceptance criteria** and **§11 rubric map** one by one in `QA-CHECKLIST.md`.

### Step 12 — Deploy and hand-off
- Commit to `main` and enable GitHub Pages (if D4 = GitHub Pages). Confirm the live URL loads.
- `README.md`: what the project is, how to open it locally, and how to do the Step 10 update.
- Optional: a 1–2 minute screen recording for the presentation backup (PRD §4 hosting note).

---

## 2. Order and Time

| Step | Task | Est. time | Depends on |
|---|---|---|---|
| 0 | Your decisions + PRD fixes sign-off | — | — |
| 1 | Scaffold | 10 min | 0 |
| 2 | Data pipeline + cross-check | 20 min | 1 |
| 3 | Skeleton, nav, hero, citation system | 30 min | 1 |
| 4 | Trendline | 45 min | 2, 3 |
| 5 | Vibe Meter | 45 min | 3 |
| 6 | Confidence Loop | 40 min | 3 |
| 7 | Wealth Effect | 10 min | 3 |
| 8 | Fiscal Policy | 25 min | 3 |
| 9 | Fed Pitch, Action Plan, Sources | 30 min | 3 |
| 10 | Oct data update | 20 min | Nov 6 release |
| 11 | QA pass | 40 min | 4–9 |
| 12 | Deploy | 15 min | 11 |

Steps 5–9 don't depend on each other and can be built in any order once Step 3 is done. That's about 5½ hours total, similar to the PRD's ~4 hours plus the extra QA and citation work.

---

## 3. Risks

| Risk | Mitigation |
|---|---|
| A source URL is dead or doesn't say what the PRD claims | Link check + citation audit in Step 11, with time set aside to swap sources |
| FRED revises values so they differ from the PRD table | FRED wins on the chart. Update the caption/Q&A text to match (Step 2.4) |
| CDN is down during grading | Pinned versions. Optionally download local copies into `vendor/` as a fallback |
| The October report changes the story (e.g., the rate jumps to 4.4%+) | Step 10 includes rewriting the narrative, not just swapping numbers |
| The grader opens the file locally | Data loaded as a script, not `fetch` (Step 2.3), and the page is tested via `file://` |

---

## 4. Files This Plan Will Create

```
epf-vibe-dash/
├── index.html
├── styles.css
├── script.js
├── data/
│   ├── unrate.csv      # raw FRED download
│   └── unrate.js       # converted array, Oct 2025 = null
├── README.md
├── QA-CHECKLIST.md     # citation audit + rubric tick-off
└── unemployment-vibe-dashboard-PRD.md   (existing)
```

**Next:** answer D1–D5, approve or reject fixes #1–13, and I'll start at Step 1.
