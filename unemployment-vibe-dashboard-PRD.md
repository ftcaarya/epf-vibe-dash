# PRD: "Jobs & Vibes" — U.S. Unemployment Vibe Dashboard

**Product type:** Simple single-page static website (HTML/CSS/JS)
**Country:** United States  **Indicator:** Unemployment Rate (U-3, seasonally adjusted)
**Research current as of:** November 4, 2026
**Owner:** [Student name] — Economics, "Evaluate the Economy" project

> ⚠️ **Data freshness note:** The BLS October 2026 jobs report is scheduled for **Friday, November 6, 2026, 8:30 a.m. ET**. If the dashboard is turned in after that date, update the "current value" (Section 6.1), the chart data, and the caption with the October figure before submitting.

---

## 1. Purpose & Goal

Build a one-page "Vibe Dashboard" that answers the project's two core questions:

1. **Economic Sentiment & Evidence** — How do Americans *feel* about jobs right now, and what does the unemployment data actually show?
2. **Policy & Action Plan** — What should Congress/the President (fiscal policy) and the Federal Reserve (monetary policy) do?

The site must hit every item on the assignment checklist and be designed to earn **"Exceeds Mastery"** in every rubric row (see Section 11 for the rubric map).

**Vibe question for this indicator:** *Do Americans feel secure in their jobs, or are they worried about finding work?*

---

## 2. Audience & Success Criteria

| Audience | What they need |
|---|---|
| Teacher (grader) | Every rubric criterion visibly addressed, sources cited, clear logic |
| Classmates (if presented) | Fast, visual story they can follow in ~2 minutes |

**Success =** all 7 rubric rows score "Exceeds Mastery"; every number on the page has a source; page loads on a phone and a laptop.

---

## 3. Scope

**In scope**
- One HTML page with 8 sections (Hero, Data/Trendline, Vibe Meter, Confidence Loop, Wealth Effect [optional], Fiscal Policy, Fed Pitch, Sources)
- One student-made line chart from real BLS/FRED data, highlighting 2020–present
- Interactive-lite elements (chart tooltips, gauge needle, hover on flowchart steps)

**Out of scope**
- Live API calls (data is hard-coded from a downloaded CSV so the page never breaks during grading)
- Logins, backend, database, multiple pages

---

## 4. Tech Requirements

| Item | Requirement |
|---|---|
| Stack | Plain `index.html`, `styles.css`, `script.js` (or all-in-one file) |
| Chart library | Chart.js via CDN (`https://cdn.jsdelivr.net/npm/chart.js`) + `chartjs-plugin-annotation` for event markers and the shaded post-pandemic band |
| Data | `data/unrate.csv` downloaded from FRED (series **UNRATE**, Jan 2019 → latest) converted to a JS array |
| Gauge | Inline SVG semicircle (no library needed) |
| Flowcharts | HTML/CSS boxes with arrows (flexbox) or inline SVG; Mermaid.js acceptable |
| Hosting | GitHub Pages, Netlify Drop, or just open the file locally / screen-record it |
| Responsive | Readable at 375px (phone) and 1280px (laptop); no horizontal scroll |
| Accessibility | Alt text / `aria-label` on chart and gauge; color is never the only signal (labels on every zone) |

---

## 5. Page Layout (top → bottom)

```
┌──────────────────────────────────────────────┐
│ HERO: title, KPI cards, one-line verdict     │
├──────────────────────────────────────────────┤
│ 1. THE DATA (Trendline + caption + Q&A)      │
├──────────────────────────────────────────────┤
│ 2. THE VIBE METER (gauge + defense + 3 news) │
├──────────────────────────────────────────────┤
│ 3. THE CONFIDENCE LOOP (flowchart)           │
├──────────────────────────────────────────────┤
│ 4. WEALTH EFFECT (optional)                  │
├──────────────────────────────────────────────┤
│ 5. FISCAL POLICY (cause-and-effect chart)    │
├──────────────────────────────────────────────┤
│ 6. FED PITCH (3 option cards, 1 highlighted) │
├──────────────────────────────────────────────┤
│ SOURCES (numbered, full citations)           │
└──────────────────────────────────────────────┘
```

Sticky top nav with anchor links to each section.

---

## 6. Section Specs & Final Content

### 6.0 Hero

- **Title:** "Jobs & Vibes: Is America Working — and Does It Feel Like It?"
- **Subtitle:** "An economist's dashboard on the U.S. unemployment rate, November 2026"
- **KPI cards (4):**

| Card | Value | Sub-label | Source |
|---|---|---|---|
| Unemployment rate | **4.2%** | Sept 2026 (latest) | [1] |
| vs. 1 year ago | **↓ 0.2 pts** | was 4.4% in Sept 2025 | [1] |
| vs. 3 years ago | **↑ 0.5 pts** | was 3.7% in Sept 2023 | [2] |
| Jobs added (Sept) | **+29,000** | well below ~90k forecast | [1][9] |

- **One-line verdict banner:** "The numbers say *stable*. The mood says *worried*. Vibe rating: **CAUTIOUS** (leaning toward Concern)."

---

### 6.1 Component 1 — The Data (Trendline)

**Chart spec**
- Line chart, monthly U.S. unemployment rate, **Jan 2019 → Sept 2026** (or latest).
- Title: "U.S. Unemployment Rate, 2019–2026 (Seasonally Adjusted)"
- X-axis label: "Month"; Y-axis label: "Unemployment Rate (%)"; Y range 0–16.
- **Shade the post-pandemic period (Mar 2020 → present)** with a light band labeled "Post-Pandemic Period."
- **Data gap:** FRED has no value for **October 2025** (the 2025 government shutdown prevented BLS from calculating it). Use `null` and set `spanGaps: true` so the line connects, and add a small note "No Oct 2025 data — gov't shutdown" [10].
- Event markers (vertical dashed lines with short labels):

| Date | Label |
|---|---|
| Apr 2020 | "COVID lockdowns — record spike" |
| Mar 2022 | "Fed begins rate hikes" |
| Sep 2025 | "Fed starts 3 rate cuts" [6] |
| Nov 2025 | "4.5% — 4-year high" [3] |
| Mar 2026 | "Iran war oil shock" [11] |
| Sep 2026 | "Fed hikes for 1st time since 2023" [7] |

- Source line under chart: "Data: U.S. Bureau of Labor Statistics via FRED (UNRATE). Chart created by [student name]."

**Verified data points (use the FRED CSV for every other month):**

| Month | Rate | Source / note |
|---|---|---|
| Sep 2023 | 3.7% | FRED current vintage [2] (first reported as 3.8% [12] — later revised by annual seasonal adjustment; use FRED's number on the chart) |
| Sep 2025 | 4.4% | BLS [1] |
| Oct 2025 | — | not published (shutdown) [10] |
| Nov 2025 | 4.5% | 4-year high [3] |
| Jan 2026 | 4.3% | [3] |
| Feb 2026 | 4.4% | employers cut 92,000 jobs [4] |
| Mar 2026 | 4.3% | [3] |
| Apr 2026 | 4.3% | [5] |
| May 2026 | 4.3% | BLS [1] |
| Jun 2026 | 4.2% | BLS [1] |
| Jul 2026 | 4.1% | BLS [1] |
| Aug 2026 | 4.1% | BLS [1] |
| Sep 2026 | 4.2% | BLS [1] |

> Pandemic-era values (e.g., the April 2020 peak near 15%) — pull directly from the FRED CSV; don't type them from memory.

**Research Questions — answer box (display as a 5-row Q&A list):**

1. **Current value?** 4.2% in September 2026, with about 7.1 million people unemployed [1].
2. **vs. 1 year ago?** Down 0.2 points from 4.4% in September 2025 — slightly better [1].
3. **vs. 3 years ago?** Up about 0.5 points from 3.7% in September 2023 — the job market is looser than in the post-pandemic boom [2].
4. **Major events?** COVID shutdowns (2020 spike), rapid reopening (2021–22), Fed rate hikes cooling hiring (2022–23), a 2025 government shutdown and weak 2025 hiring pushing the rate to a 4-year high of 4.5% (Nov 2025) [3][10], the Iran war oil shock from March 2026 raising costs and uncertainty [11], AI-related hiring freezes especially for entry-level roles [13], and the Fed's September 2026 rate hike [7].
5. **Improving, declining, or stable?** **Stable.** BLS says the rate has stayed between 4.1% and 4.3% since March 2026 [1] — but hiring is very slow (only +29k in September, with July/August revised down by 60k combined) [1].

**Caption (3–5 sentences, ready to paste):**
> This graph shows the U.S. unemployment rate from 2019 to 2026, with the post-pandemic period shaded. Unemployment spiked to record levels in spring 2020 when COVID shut down the economy, then fell quickly to historic lows near 3.5% by 2023 as businesses reopened. Since then, the rate has slowly crept up, reaching a four-year high of 4.5% in November 2025 before easing back to 4.2% by September 2026. The flat line over the past several months shows a "low-hire, low-fire" job market: few people are being laid off, but companies are adding very few new jobs. Overall, the trend suggests the labor market is stable but not improving.

**Supporting stat strip (small chips under the caption):**
- Labor force participation: 61.8% (down from 62.5% a year earlier) [1]
- Long-term unemployed (27+ weeks): 1.9 million = 27.1% of all unemployed [1]
- Black unemployment rose to 7.0% in September [1]
- Average hourly earnings: +3.0% over 12 months [1] vs. inflation 3.7% [8] → **real wages are falling**
- Job openings: ~7.1 million (August 2026) [14]

---

### 6.2 Component 2 — The Vibe Meter (The Feeling)

**Gauge spec**
- SVG semicircle with 5 labeled zones, left → right:
  **Panic** (red) → **Concern** (orange) → **Cautious** (yellow) → **Optimistic** (light green) → **Exuberance** (green)
- Hover/tap each zone shows its definition:
  - Panic: extreme fear & severe drop
  - Concern: growing anxiety & mild downturn
  - Cautious: neutral outlook, mixed signals
  - Optimistic: positive confidence & growth
  - Exuberance: high enthusiasm & boom
- **Needle position: Cautious, tilted toward Concern** (≈ 40% of the arc). Animate needle on scroll into view.
- Label under gauge: "Today's Rating: CAUTIOUS"

**Sentiment evidence panel (two columns):**

| 😟 Worried signals | 🙂 Steady signals |
|---|---|
| UMich consumer sentiment at 48.0 in Oct 2026 — a five-month low and not far above May 2026's all-time record low of 44.8 [15][16] | Unemployment still low by historical standards at 4.2% [1] |
| Only +29k jobs in Sept; July/Aug revised down 60k [1] | Conference Board confidence jumped to 91.7 in Oct — highest since June — on better job views [17] |
| Wages (+3.0%) are losing to inflation (3.7%) [1][8] | Real GDP grew at a strong 3.4% annual rate in Q3 2026 [18] |
| Conference Board's "jobs plentiful minus hard to get" gap is only +5.3% — historically weak [17] | Layoffs remain low; employers are holding on to workers [9] |

**Rating Defense (paste-ready):**
> I rate today's economy **Cautious**, leaning toward Concern. On paper, the job market looks okay: unemployment is 4.2%, layoffs are low, and GDP grew 3.4% last quarter. But Americans don't *feel* secure. Hiring has nearly stalled, wages are rising more slowly than prices, and University of Michigan consumer sentiment sits near the lowest level ever recorded. People who already have jobs are mostly holding on, but people looking for work — especially young and entry-level workers — are struggling. That mix of solid data and anxious feelings is exactly what "mixed signals" means.

**Research Questions (Q&A list):**
1. **How are news organizations describing the economy?** As a "low-hire, low-fire" job market — stable but stuck — with worries about energy prices and inflation [9].
2. **Are experts optimistic or worried?** Mostly cautious: economists note the labor market hasn't cracked, but expect energy costs from the Iran war to weigh on hiring into 2027 [9].
3. **Do all sources interpret the data the same way?** No. The Fed sees the labor market as stable enough to raise rates to fight inflation [7], while many consumers and some economists see weak hiring as a warning sign [9]. Two consumer surveys even moved in opposite directions in October (UMich low, Conference Board up) [15][17].
4. **Where would you place today's mood and why?** Cautious — see Rating Defense above.

**Media Evidence — 3 headline cards** (each card: colored tag, headline, outlet, date, 1-sentence summary, link)

| Tag | Headline (exact title) | Outlet & date | One-line takeaway |
|---|---|---|---|
| 🟢 **Positive** | "US Consumer Confidence Rises for First Time in Four Months" | Bloomberg, Oct 27, 2026 [17] | Americans felt better about jobs and business conditions in October. |
| 🔴 **Negative** | "The U.S. added only 29,000 jobs in September as job market lacks spark" | NPR, Oct 2, 2026 [9] | Hiring came in far below forecasts and unemployment ticked up. |
| 🔵 **Neutral** | "Unemployment rate little changed at 4.2 percent in September 2026" | BLS *The Economics Daily*, Oct 2026 [19] | The official data shows the job market holding steady. |

---

### 6.3 Component 3 — The Confidence Loop (The Logic)

**Flowchart spec:** circular loop of 6 boxes with arrows; toggle button "Show reverse direction" swaps text to the "unemployment falls" version. Each box has an icon and 1–2 lines.

**Loop A — Unemployment RISES (current risk):**
1. 📈 **Unemployment rises / hiring stalls** →
2. 😟 **Consumer confidence falls** — workers fear losing their job or not finding one →
3. 💰 **Spending falls** — families save "just in case," delay big purchases (cars, vacations, homes) →
4. 🏪 **Business revenue falls** — stores and restaurants sell less, so they cut hours, freeze hiring, or lay off →
5. 📉 **GDP slows** — consumer spending is about two-thirds of U.S. GDP, so less spending = less output →
6. 🔁 **More unemployment** — loops back to step 1 (a downward spiral)

**Loop B — Unemployment FALLS (reverse direction):**
Unemployment falls → people feel secure, confidence rises → spending rises → businesses earn more and hire → GDP grows → even more hiring (upward spiral; if it overheats, it can push up inflation).

**Research Questions (shown as hover tooltips on each arrow):**
1. *Indicator → confidence:* job security is the #1 driver of how people feel about their own finances.
2. *Confidence → spending:* worried households build savings and cut non-essentials.
3. *Spending → businesses:* lower sales mean lower profits, fewer shifts, fewer hires.
4. *Business activity → GDP:* less production and investment shrinks total output.
5. *Opposite direction:* falling unemployment creates the upward spiral above.

**Current-data callout:** "Right now we're in a *stalled* loop — unemployment isn't rising fast, but hiring is so slow that confidence is weak. Real GDP still grew 3.4% in Q3 2026 [18], so the downward spiral hasn't started."

---

### 6.4 Component 4 — The Wealth Effect (OPTIONAL — include for extra depth)

Short card, 4–5 sentences + mini multiplier diagram:

> When stock prices or home values rise, people *feel* richer even if their paycheck hasn't changed. Investors and homeowners tend to spend more, which boosts business sales and can lead companies to hire — helping lower unemployment. Through the **multiplier effect**, one person's extra spending becomes another person's income (e.g., a homeowner spends $1,000 on repairs → the contractor spends it at restaurants → restaurant workers earn more). But the wealth effect mostly helps people who already own stocks or homes; unemployed and lower-income workers benefit less, so it may not fix feelings of job insecurity. Overall, rising wealth slightly **strengthens** the job market, but it can't fully offset worries about weak hiring and high prices.

Mini diagram: `Asset values ↑ → feel wealthier → spend $1,000 → contractor income → restaurant spending → workers' income → hiring ↑`

---

### 6.5 Component 5 — Fiscal Policy Connection

**Visual:** Cause-and-effect chart (2×3 grid of cards).

| Government action | Effect on spending | Effect on unemployment |
|---|---|---|
| ⬆️ Increase gov't spending (infrastructure, job training) | More demand, more contracts | ⬇️ Unemployment falls |
| ⬇️ Tax cuts | People keep more income → spend more | ⬇️ Unemployment falls |
| ⬆️ Tax increases | Less take-home pay → spend less | ⬆️ Unemployment rises |
| ⬇️ Cut gov't spending | Less demand, fewer public jobs | ⬆️ Unemployment rises |

**Research Questions (Q&A list):**
1. *Government spending:* creates jobs directly (public projects) and indirectly (contractors, suppliers) → lowers unemployment.
2. *Tax cuts:* raise disposable income → more spending → businesses hire.
3. *Tax increases:* reduce spending → can slow hiring.
4. *During a recession:* **expansionary** fiscal policy — raise spending and/or cut taxes.
5. *During high inflation:* **contractionary** fiscal policy — cut spending and/or raise taxes to cool demand.

**Current context box:**
- The One Big Beautiful Bill Act (signed July 4, 2025) delivered large tax refunds in early 2026 — roughly $285 billion of fiscal stimulus in 2026, close to 1% of GDP [20].
- CBO projects a FY2026 federal deficit of about $1.9 trillion (5.8% of GDP) [21].
- Inflation is 3.7%, well above the 2% target [8].

**Policy Advisory (paste-ready):**
> **Recommendation: MAINTAIN overall spending and taxes — no new broad stimulus, but use targeted help.** The economy isn't in a recession (GDP grew 3.4% and unemployment is 4.2%), and inflation is already high at 3.7%, so a big new round of tax cuts or spending would risk pushing prices even higher — especially since 2026 already got a large boost from tax refunds. Raising taxes or cutting spending now would also be risky because hiring is so weak. Instead, the government should keep total spending steady while shifting money toward **targeted programs**: job-training and apprenticeship programs for entry-level workers losing out to AI, and support for the 1.9 million long-term unemployed. This helps people find work without overheating the whole economy.

---

### 6.6 Fed Pitch — Monetary Policy Recommendation

**Visual:** 3 option cards side by side (Raise / Lower / Hold). The chosen card is enlarged with a "✅ MY RECOMMENDATION" badge; the other two are dimmed with a 1-line "why not."

**Current setting:** Federal funds rate target **3.75%–4.00%**, after a 25-basis-point hike in September 2026 (first hike since 2023) and a hold on October 28, 2026 [7][22]. Fed Chair: **Kevin Warsh** (took over from Jerome Powell in May 2026) [23]. Next FOMC meeting: December 8–9, 2026 [22].

| Option | Verdict | One-line reason |
|---|---|---|
| Raise rates | ❌ | Hiring is already near a standstill; higher borrowing costs could push unemployment up. |
| Lower rates | ❌ | Inflation is 3.7% and rising — a cut could make prices worse. |
| **Hold steady** | ✅ | Balances both halves of the Fed's dual mandate. |

**Analysis Framework (Q&A):**
1. *What does the indicator suggest?* A stable but sluggish job market — not a crisis.
2. *Is the economy overheating?* Not in jobs (hiring is weak); prices are rising mainly from energy — core inflation is a lower 2.6% [8].
3. *Is confidence strong or weak?* Weak to mixed (UMich 48.0; Conference Board 91.7) [15][17].
4. *Are consumers spending too much or too little?* About right for now — GDP grew 3.4% [18] — but falling real wages could slow spending soon.
5. *Which action best supports stability?* Holding rates steady.

**Recommendation (paste-ready):**
> **I recommend the FOMC HOLD interest rates steady at 3.75%–4.00% at its December meeting.** The Fed has two jobs: keep prices stable and keep employment high. Inflation is too high at 3.7%, but much of that comes from oil and energy prices tied to the Iran war — and raising interest rates can't produce more oil. Meanwhile, the job market is fragile: only 29,000 jobs were added in September and earlier months were revised down. Another hike could tip a "low-hire" market into a "high-fire" one and push unemployment up. Cutting rates would be the wrong move too, because it could add fuel to inflation. Holding steady lets the September hike work its way through the economy while the Fed watches the next jobs and inflation reports. If unemployment rises above about 4.5%, the Fed should consider cutting; if core inflation keeps climbing, it should consider another hike.

---

### 6.7 Coordinated Action Plan (closing banner)

Two-column summary card:

| 🏛️ Government (Fiscal) | 🏦 Federal Reserve (Monetary) |
|---|---|
| Maintain overall spending & taxes; redirect funds to job training and long-term-unemployed support | Hold the federal funds rate at 3.75%–4.00%; stay data-dependent |
| **Goal:** help job seekers without adding to inflation | **Goal:** let past hikes cool prices without breaking the job market |

Closing line: "Stable numbers, anxious people — the right move is **steady hands, targeted help.**"

---

### 6.8 Sources Section

Numbered list (matches the [#] markers on the page). Each item: outlet/agency, title, date, link. Format consistently (MLA or APA — ask teacher).

1. U.S. Bureau of Labor Statistics. "The Employment Situation — September 2026." Oct 2, 2026. https://www.bls.gov/news.release/empsit.htm
2. Federal Reserve Bank of St. Louis (FRED). "Unemployment Rate (UNRATE)." https://fred.stlouisfed.org/series/UNRATE
3. Trading Economics. "US Unemployment Edges Up to 4.4% in February." 2026. https://tradingeconomics.com/united-states/unemployment-rate/news/531388
4. PBS NewsHour / AP. "U.S. lost 92,000 jobs last month and unemployment rate rises to 4.4%." Mar 6, 2026. https://www.pbs.org/newshour/economy/u-s-lost-92000-jobs-last-month-and-unemployment-rate-rises-to-4-4
5. Trading Economics. "US Jobless Rate Unchanged in April." May 8, 2026. https://tradingeconomics.com/united-states/unemployment-rate/news/549251
6. Advisor Perspectives. "Fed's Interest Rate Decision: July 29, 2026." https://www.advisorperspectives.com/dshort/updates/2026/07/29/feds-interest-rate-decision-july-29-2026
7. J.P. Morgan Wealth Management. "Fed raises rates at September meeting." Sep 17, 2026. https://www.chase.com/personal/investments/learning-and-insights/article/federal-reserve-raises-rates-officials-signal-one-more-hike-in-2026
8. Trading Economics. "US Inflation Rate Tops Forecasts." Oct 14, 2026. https://tradingeconomics.com/united-states/inflation-cpi/news/591934
9. NPR (via WUNC). "The U.S. added only 29,000 jobs in September as job market lacks spark." Oct 2, 2026. https://www.wunc.org/2026-10-02/the-u-s-added-only-29-000-jobs-in-september-as-job-market-lacks-spark — also CBS News, https://cbsnews.com/news/september-jobs-report-us-hiring-labor-market and Allwork.Space, https://allwork.space/2026/10/u-s-job-growth-nearly-stalls-in-september-as-payrolls-rise-just-29000/
10. The Trucker / AP. "Late-arriving September jobs report…" Nov 2025. https://www.thetrucker.com/trucking-news/business/late-arriving-september-jobs-report-likely-shows-that-hiring-was-sluggish-but-layoffs-few
11. Fortune. "Trump's war in Iran is costing the U.S. economy 10,000 jobs a month, Goldman Sachs says." Mar 26, 2026. https://fortune.com/2026/03/26/trump-iran-war-oil-shock-jobs-goldman-sachs-gen-z
12. U.S. Bureau of Labor Statistics. "The Employment Situation — September 2023." Oct 6, 2023. https://www.bls.gov/news.release/archives/empsit_10062023.pdf
13. CBS News. "AI job cuts are rising, but experts say layoffs are only part of the story." 2026. https://www.cbsnews.com/news/ai-layoffs-hiring-entry-level-workers/
14. Securities.io. "U.S. Job Openings Little Changed at 7.1 Million in August." Sep 29, 2026. https://www.securities.io/u-s-job-openings-little-changed-at-7-1-million-in-august/
15. Trading Economics. "US Consumer Sentiment Revised Higher but Remains Weak." Oct 23, 2026. https://tradingeconomics.com/united-states/consumer-confidence/news/594700
16. Finance Calendar. "US University of Michigan Consumer Sentiment October 2026" (record-low reference). https://www.financecalendar.com/?p=1337
17. The Conference Board. "US Consumer Confidence Increased in October." Oct 27, 2026. https://www.prnewswire.com/news-releases/us-consumer-confidence-increased-in-october-302920731.html — Bloomberg headline: https://www.bloomberg.com/news/articles/2026-10-27/us-consumer-confidence-increases-for-first-time-in-four-months
18. U.S. Bureau of Economic Analysis. "GDP (Advance Estimate), 3rd Quarter 2026." Oct 29, 2026. https://bea.gov/news/2026/gdp-advance-estimate-3rd-quarter-2026
19. U.S. Bureau of Labor Statistics. "BLS Weekly Update" (The Economics Daily headline). Oct 2026. https://www.bls.gov/opub/update.htm
20. Baird Wealth. "Significant Consumer Stimulus Arrives in 2026." https://olsongroup.bairdwealth.com/resource-center/investment/significant-consumer-stimulus-arrives-in-2026
21. Washington Examiner. "One Big Beautiful Bill Act will add $4.7 trillion to deficits: CBO." 2026.
22. Advisor Perspectives. "Fed's Interest Rate Decision: October 28, 2026." https://www.advisorperspectives.com/dshort/updates/2026/10/28/feds-interest-rate-decision-october-28-2026
23. KPBS / NPR. "Senate confirms Kevin Warsh as next chair of the Federal Reserve." May 13, 2026. https://www.kpbs.org/news/economy/2026/05/13/senate-confirms-kevin-warsh-as-next-chair-of-the-federal-reserve

---

## 7. Visual Design

- **Theme:** clean "economist's control room" — dark navy header (#1e293b), white cards, soft gray page background.
- **Section accent colors** (mirror the assignment): blue (Data), purple (Vibe), teal (Loop), amber (Fiscal), green/red/blue (Fed options).
- **Fonts:** Inter or Poppins (Google Fonts) for headings; system sans-serif for body.
- **Cards:** 12px rounded corners, subtle shadow, colored top border (like the assignment slides).
- **Headline tags:** green / red / blue pills for Positive / Negative / Neutral.
- **Numbers:** large bold KPI values; every number followed by a small superscript source link.

---

## 8. Interactions

| Element | Behavior |
|---|---|
| Line chart | Hover tooltip shows "Month YYYY: X.X%"; event markers labeled |
| Gauge | Needle animates from 0 to "Cautious" on scroll; zone definitions on hover/tap |
| Confidence Loop | Toggle "Unemployment rises ↔ falls"; arrow tooltips explain each step |
| Fed cards | Hover expands the "why not" text; recommended card permanently highlighted |
| Source markers | Clicking [#] jumps to that source in the Sources list |

---

## 9. Data Handling Steps (for the builder)

1. Go to FRED → series **UNRATE** → "Download" → CSV; set range Jan 2019 → latest.
2. Convert to an array: `const data = [{date:"2019-01", rate:4.0}, …]` (Oct 2025 = `null`).
3. Cross-check the September 2026 value (4.2%) against the BLS release [1].
4. After **Nov 6, 2026**, add October 2026 and update the hero KPI, Q&A #1, and the caption.

---

## 10. Acceptance Criteria (checklist from the assignment)

- [ ] Selected one economic indicator (Unemployment Rate)
- [ ] At least one student-made graph using real data (FRED/BLS line chart)
- [ ] Post-pandemic period (2020–present) highlighted; labels + title present
- [ ] 3–5 sentence caption; all 5 data research questions answered
- [ ] Vibe Meter gauge with all 5 zones, needle placed, rating defended
- [ ] 3 contrasting headlines (positive / negative / neutral) with outlet + date + link
- [ ] Confidence Loop flowchart showing impact on consumer behavior and GDP, plus reverse direction
- [ ] Wealth Effect explained (optional — included)
- [ ] Fiscal Policy cause-and-effect chart + increase/decrease/maintain advisory
- [ ] Fed Pitch with Raise/Lower/Hold options and a justified recommendation
- [ ] Created digitally
- [ ] All sources cited; every number traceable to a source

---

## 11. Rubric Map (how each row hits "Exceeds Mastery")

| Rubric criterion | Where it's met | "Exceeds" evidence |
|---|---|---|
| Economic Indicator Research & Analysis (20) | 6.0, 6.1 Q&A, stat strip | Current / 1-yr / 3-yr comparisons, plus participation, long-term unemployed, real wages, revisions |
| Trendline & Data Visualization (20) | 6.1 chart + caption | Labeled axes, title, shaded 2020+ band, event annotations, handled data gap |
| Vibe Meter, Sentiment, Headlines & Media (20) | 6.2 | Multiple surveys (UMich + Conference Board), evidence table, 3 credible headlines tied back to data |
| Confidence Loop / Economic Logic (10) | 6.3 | Sequential 6-step loop + reverse loop + tie to current data |
| Fiscal Policy Connection (10) | 6.5 | Cause-effect chart, recession vs inflation tools, current OBBBA/deficit context, evidence-based advisory |
| Monetary Policy (Fed Pitch) (10) | 6.6 | Current rate + recent decisions, dual-mandate reasoning, conditions for changing course |
| Communication, Design & Sources (10) | 7, 8, 6.8 | Consistent design, interactive elements, 23 numbered citations |

---

## 12. Milestones

| Step | Task | Est. time |
|---|---|---|
| 1 | Download FRED CSV, build data array | 20 min |
| 2 | HTML skeleton + nav + hero | 30 min |
| 3 | Line chart with band, annotations, caption | 45 min |
| 4 | Vibe gauge + headline cards | 45 min |
| 5 | Confidence Loop + fiscal grid | 45 min |
| 6 | Fed Pitch + action plan + sources | 30 min |
| 7 | Mobile check, proofread, update with Oct jobs data (Nov 6) | 30 min |
