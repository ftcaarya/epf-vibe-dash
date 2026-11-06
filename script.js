// Jobs & Vibes dashboard: trendline chart images, vibe gauge, confidence loop.
// Data comes from data/unrate.js (loaded as a script so the page also works from file://).

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtMonth = (ym) => {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
};

/* ---------- 1. Trendline ---------- */
// The chart images are made in Python (matplotlib) and live in images/graphs/.
// The two buttons swap between the full view and the 2023-now view.

const CHART_VIEWS = {
  full: {
    src: "images/graphs/unrate_full.png",
    alt: "Line chart of the U.S. unemployment rate from January 2019 to September 2026. It spikes to 14.8% in April 2020, falls to a low of 3.4% in 2023, rises to 4.5% in November 2025, and is 4.2% in September 2026. The period from March 2020 on is shaded as the post-pandemic period. October 2025 has no data.",
  },
  zoom: {
    src: "images/graphs/unrate_zoom.png",
    alt: "Line chart of the U.S. unemployment rate from January 2023 to September 2026, zoomed to the 3% to 5% range. It rises from about 3.5% in 2023 to 4.5% in November 2025, then eases to 4.2% by September 2026. October 2025 has no data.",
  },
};

function initChart() {
  const img = document.getElementById("unrateChart");
  if (!img) return;

  function setView(view) {
    img.src = CHART_VIEWS[view].src;
    img.alt = CHART_VIEWS[view].alt;
    document.getElementById("view-full").setAttribute("aria-pressed", String(view === "full"));
    document.getElementById("view-zoom").setAttribute("aria-pressed", String(view === "zoom"));
  }

  document.getElementById("view-full").addEventListener("click", () => setView("full"));
  document.getElementById("view-zoom").addEventListener("click", () => setView("zoom"));
}

function fillTable() {
  const body = document.querySelector("#unrateTable tbody");
  if (!body) return;
  body.innerHTML = UNRATE.map((d) =>
    `<tr><td>${fmtMonth(d.date)}</td><td>${d.rate === null ? "not collected (shutdown)" : d.rate.toFixed(1)}</td></tr>`
  ).join("");
}

/* ---------- 2. Vibe gauge ---------- */

const ZONES = [
  { name: "Panic", def: "extreme fear & severe drop", fill: "#a8322a", ink: "#fff" },
  { name: "Concern", def: "growing anxiety & mild downturn", fill: "#cf7a43", ink: "#fff" },
  { name: "Cautious", def: "neutral outlook, mixed signals", fill: "#dcb85a", ink: "#1b1b1b" },
  { name: "Optimistic", def: "positive confidence & growth", fill: "#8daf7c", ink: "#1b1b1b" },
  { name: "Exuberance", def: "high enthusiasm & boom", fill: "#2e6b3f", ink: "#fff" },
];
// 0 = far left, 1 = far right. 0.45 sits inside Cautious (0.4–0.6), leaning toward Concern.
const NEEDLE_POSITION = 0.45;
const CX = 170, CY = 170, R = 130;

function arcPoint(f, r = R) {
  const t = Math.PI * (1 - f);
  return [CX + r * Math.cos(t), CY - r * Math.sin(t)];
}

function initGauge() {
  const g = document.getElementById("gauge-zones");
  const out = document.getElementById("zone-def");
  if (!g) return;
  const NS = "http://www.w3.org/2000/svg";

  ZONES.forEach((z, i) => {
    const f0 = i / ZONES.length, f1 = (i + 1) / ZONES.length, fm = (f0 + f1) / 2;
    const [x0, y0] = arcPoint(f0), [x1, y1] = arcPoint(f1), [xm, ym] = arcPoint(fm);

    const zone = document.createElementNS(NS, "g");
    zone.setAttribute("class", "zone");
    zone.setAttribute("tabindex", "0");
    zone.setAttribute("role", "button");
    zone.setAttribute("aria-label", `${z.name}: ${z.def}`);

    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", z.fill);
    path.setAttribute("stroke-width", "46");

    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", xm);
    label.setAttribute("y", ym);
    label.setAttribute("fill", z.ink);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "central");
    label.setAttribute("transform", `rotate(${90 - 180 * (1 - fm)} ${xm} ${ym})`);
    label.textContent = z.name;

    zone.append(path, label);
    const show = () => { out.innerHTML = `<b>${z.name}:</b> ${z.def}`; };
    zone.addEventListener("mouseenter", show);
    zone.addEventListener("focus", show);
    zone.addEventListener("click", show);
    g.appendChild(zone);
  });

  // thin white separators between zones
  for (let i = 1; i < ZONES.length; i++) {
    const [xa, ya] = arcPoint(i / ZONES.length, R - 25), [xb, yb] = arcPoint(i / ZONES.length, R + 25);
    const sep = document.createElementNS(NS, "line");
    Object.entries({ x1: xa, y1: ya, x2: xb, y2: yb, stroke: "#f6f4ee", "stroke-width": 3 })
      .forEach(([k, v]) => sep.setAttribute(k, v));
    g.appendChild(sep);
  }

  const needle = document.getElementById("needle");
  needle.removeAttribute("transform");
  needle.style.transformOrigin = `${CX}px ${CY}px`;
  needle.style.transform = "rotate(0deg)";
  const swing = () => { needle.style.transform = `rotate(${NEEDLE_POSITION * 180}deg)`; };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        // next frame so the browser has painted the starting angle first
        requestAnimationFrame(() => requestAnimationFrame(swing));
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(document.getElementById("gauge"));
  } else {
    swing();
  }
}

/* ---------- 3. Confidence loop ---------- */

const GDP_CITE = '<sup><a href="#src-22">[22]</a></sup>';

const LOOPS = {
  rises: {
    label: "Showing: <strong>unemployment rises</strong> (downward spiral, the current risk)",
    center: "A downward spiral",
    button: "Show reverse direction",
    boxes: [
      ["Unemployment rises / hiring stalls", ""],
      ["Consumer confidence falls", "Workers fear losing their job or not finding one."],
      ["Spending falls", "Families save \"just in case\" and delay big purchases (cars, vacations, homes)."],
      ["Business revenue falls", "Stores and restaurants sell less, so they cut hours, freeze hiring, or lay off."],
      ["GDP slows", `Consumer spending is about two-thirds of U.S. GDP${GDP_CITE}, so less spending means less output.`],
      ["More unemployment", "Loops back to step 1: a downward spiral."],
    ],
    arrows: [
      "<b>Indicator → confidence:</b> job security is the #1 driver of how people feel about their own finances.",
      "<b>Confidence → spending:</b> worried households build savings and cut non-essentials.",
      "<b>Spending → businesses:</b> lower sales mean lower profits, fewer shifts, and fewer hires.",
      "<b>Business activity → GDP:</b> less production and investment shrinks total output.",
      "<b>GDP → jobs:</b> when output shrinks, firms need fewer workers, so layoffs and hiring freezes spread.",
      "<b>Back to the start:</b> newly unemployed people cut their own spending, so the cycle repeats.",
    ],
  },
  falls: {
    label: "Showing: <strong>unemployment falls</strong> (upward spiral)",
    center: "An upward spiral",
    button: "Show original direction",
    boxes: [
      ["Unemployment falls / hiring picks up", ""],
      ["Confidence rises", "Workers feel secure in their jobs."],
      ["Spending rises", "Families make the big purchases they had been delaying."],
      ["Business revenue rises", "Firms add shifts and hire more workers."],
      ["GDP grows", `Consumer spending is about two-thirds of GDP${GDP_CITE}, so more spending means more output.`],
      ["Even more hiring", "An upward spiral. If it overheats, it can push up inflation."],
    ],
    arrows: [
      "<b>Indicator → confidence:</b> steady paychecks make people feel better about their finances.",
      "<b>Confidence → spending:</b> secure households spend more and save less \"just in case.\"",
      "<b>Spending → businesses:</b> higher sales mean higher profits, more shifts, and more hires.",
      "<b>Business activity → GDP:</b> more production and investment grows total output.",
      "<b>GDP → jobs:</b> growing output means firms need more workers.",
      "<b>Back to the start:</b> newly hired people spend more, so the cycle repeats, until rising demand pushes up prices.",
    ],
  },
};

function initLoop() {
  const grid = document.getElementById("loop-grid");
  if (!grid) return;
  const btn = document.getElementById("loop-toggle");
  const tip = document.getElementById("arrow-tip");
  let mode = "rises";

  function render() {
    const L = LOOPS[mode];
    grid.classList.toggle("up", mode === "falls");
    grid.querySelectorAll(".lbox").forEach((box, i) => {
      const [title, text] = L.boxes[i];
      box.innerHTML = `<span class="n">${i + 1}</span><b>${title}</b>${text ? `<span>${text}</span>` : ""}`;
    });
    document.getElementById("loop-center").textContent = L.center;
    document.getElementById("loop-label").innerHTML = L.label;
    btn.textContent = L.button;
    btn.setAttribute("aria-pressed", String(mode === "falls"));
    grid.querySelectorAll(".larrow").forEach((a) => a.classList.remove("active"));
    tip.textContent = "Hover over or tap an arrow to see why each step leads to the next.";
  }

  grid.querySelectorAll(".larrow").forEach((a) => {
    const show = () => {
      grid.querySelectorAll(".larrow").forEach((x) => x.classList.toggle("active", x === a));
      tip.innerHTML = LOOPS[mode].arrows[Number(a.dataset.arrow) - 1];
    };
    a.addEventListener("mouseenter", show);
    a.addEventListener("focus", show);
    a.addEventListener("click", show);
  });

  btn.addEventListener("click", () => {
    mode = mode === "rises" ? "falls" : "rises";
    render();
  });

  render();
}

fillTable();
initChart();
initGauge();
initLoop();
