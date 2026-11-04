// Jobs & Vibes dashboard: trendline chart, vibe gauge, confidence loop.
// Data comes from data/unrate.js (loaded as a script so the page also works from file://).

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtMonth = (ym) => {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
};
const indexOf = (ym) => UNRATE.findIndex((d) => d.date === ym);

/* ---------- 1. Trendline ---------- */

const EVENTS = [
  { date: "2020-04", long: "COVID lockdowns — record spike", lift: 0, narrowLift: 0, side: "start" },
  { date: "2022-03", long: "Fed begins rate hikes", lift: 0, narrowLift: 0, side: "start" },
  { date: "2025-09", long: "Fed starts cutting rates", lift: 0, narrowLift: 0, side: "end" },
  { date: "2025-11", long: "4.5% — 4-year high", lift: 1, narrowLift: 1, side: "end" },
  { date: "2026-03", long: "Iran war oil shock", lift: 2, narrowLift: 0, side: "end" },
  { date: "2026-09", long: "Fed hikes for 1st time since 2023", lift: 3, narrowLift: 1, side: "end" },
];

const VIEWS = {
  full: { xMin: 0, yMin: 0, yMax: 16, topY: 15.5, step: 1.3, gapY: 1.2 },
  zoom: { xMin: indexOf("2023-01"), yMin: 3, yMax: 5, topY: 4.95, step: 0.16, gapY: 3.25 },
};

function buildAnnotations(view, narrow) {
  const v = VIEWS[view];
  const last = UNRATE.length - 1;
  const ann = {
    band: {
      type: "box",
      xMin: indexOf("2020-03"),
      xMax: last,
      backgroundColor: "rgba(37, 99, 235, 0.07)",
      borderWidth: 0,
      label: {
        display: view === "full",
        content: "Post-Pandemic Period",
        position: { x: "center", y: "end" },
        color: "#1e40af",
        font: { size: 12, weight: "bold" },
        padding: 6,
      },
    },
    gap: {
      type: "label",
      display: !narrow,
      xValue: indexOf("2025-10"),
      yValue: v.gapY,
      content: narrow ? ["No Oct 2025", "data (shutdown)"] : ["No Oct 2025 data —", "gov't shutdown"],
      position: { x: "end", y: "center" },
      color: "#64748b",
      font: { size: 10, style: "italic" },
      xAdjust: -6,
    },
  };
  EVENTS.forEach((e, i) => {
    const x = indexOf(e.date);
    ann["ev" + i] = {
      type: "line",
      xMin: x,
      xMax: x,
      borderColor: "rgba(15, 23, 42, 0.45)",
      borderWidth: 1.5,
      borderDash: [5, 4],
    };
    ann["evl" + i] = {
      type: "label",
      xValue: x,
      // on phones, label each line with its number from the event key below the chart
      yValue: v.topY - (narrow ? e.narrowLift : e.lift) * v.step,
      content: narrow ? String(i + 1) : e.long,
      position: narrow ? { x: "center", y: "start" } : { x: e.side, y: "start" },
      xAdjust: narrow ? 0 : e.side === "end" ? -4 : 4,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "#0f172a",
      font: { size: narrow ? 10 : 11, weight: "600" },
      padding: 3,
    };
  });
  return ann;
}

function initChart() {
  const canvas = document.getElementById("unrateChart");
  if (!canvas || typeof Chart === "undefined") return;

  const narrow = () => canvas.parentElement.clientWidth < 600;
  let view = "full";

  const chart = new Chart(canvas, {
    type: "line",
    data: {
      labels: UNRATE.map((d) => fmtMonth(d.date)),
      datasets: [{
        label: "Unemployment rate (%)",
        data: UNRATE.map((d) => d.rate),
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        spanGaps: true,
        tension: 0.15,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: {
          min: VIEWS.full.xMin,
          title: { display: true, text: "Month", font: { weight: "bold" } },
          // one tick per January, labeled with just the year
          ticks: {
            maxRotation: 0,
            autoSkip: false,
            callback(value) {
              const d = UNRATE[value].date;
              return d.endsWith("-01") ? d.slice(0, 4) : null;
            },
          },
          grid: { display: false },
        },
        y: {
          min: 0,
          max: 16,
          title: { display: true, text: "Unemployment Rate (%)", font: { weight: "bold" } },
          ticks: { callback: (v) => v + "%" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          filter: (item) => item.parsed.y !== null,
          callbacks: {
            title: () => "",
            label: (ctx) => `${ctx.label}: ${ctx.parsed.y.toFixed(1)}%`,
          },
        },
        annotation: { annotations: buildAnnotations("full", narrow()) },
      },
    },
  });

  function setView(next) {
    view = next;
    const v = VIEWS[view];
    chart.options.scales.x.min = v.xMin;
    chart.options.scales.y.min = v.yMin;
    chart.options.scales.y.max = v.yMax;
    chart.options.scales.y.ticks.stepSize = view === "zoom" ? 0.25 : undefined;
    chart.options.plugins.annotation.annotations = buildAnnotations(view, narrow());
    chart.update();
    document.getElementById("view-full").setAttribute("aria-pressed", String(view === "full"));
    document.getElementById("view-zoom").setAttribute("aria-pressed", String(view === "zoom"));
  }

  document.getElementById("view-full").addEventListener("click", () => setView("full"));
  document.getElementById("view-zoom").addEventListener("click", () => setView("zoom"));

  let wasNarrow = narrow();
  window.addEventListener("resize", () => {
    if (narrow() !== wasNarrow) {
      wasNarrow = narrow();
      setView(view);
    }
  });
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
  { name: "Panic", def: "extreme fear & severe drop", fill: "#dc2626", ink: "#fff" },
  { name: "Concern", def: "growing anxiety & mild downturn", fill: "#f97316", ink: "#1e293b" },
  { name: "Cautious", def: "neutral outlook, mixed signals", fill: "#facc15", ink: "#1e293b" },
  { name: "Optimistic", def: "positive confidence & growth", fill: "#86efac", ink: "#1e293b" },
  { name: "Exuberance", def: "high enthusiasm & boom", fill: "#16a34a", ink: "#fff" },
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
    path.setAttribute("stroke-width", "50");

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
    Object.entries({ x1: xa, y1: ya, x2: xb, y2: yb, stroke: "#fff", "stroke-width": 2 })
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

const GDP_CITE = '<sup><a href="#src-23">[23]</a></sup>';

const LOOPS = {
  rises: {
    label: "Showing: <strong>Unemployment RISES</strong> (downward spiral, the current risk)",
    center: "🔁 Downward spiral",
    button: "Show reverse direction ↔",
    boxes: [
      ["📈", "Unemployment rises / hiring stalls", ""],
      ["😟", "Consumer confidence falls", "Workers fear losing their job or not finding one."],
      ["💰", "Spending falls", "Families save \"just in case\" and delay big purchases (cars, vacations, homes)."],
      ["🏪", "Business revenue falls", "Stores and restaurants sell less, so they cut hours, freeze hiring, or lay off."],
      ["📉", "GDP slows", `Consumer spending is about two-thirds of U.S. GDP${GDP_CITE}, so less spending means less output.`],
      ["🔁", "More unemployment", "Loops back to step 1: a downward spiral."],
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
    label: "Showing: <strong>Unemployment FALLS</strong> (upward spiral)",
    center: "🔁 Upward spiral",
    button: "Show original direction ↔",
    boxes: [
      ["📉", "Unemployment falls / hiring picks up", ""],
      ["😊", "Confidence rises", "Workers feel secure in their jobs."],
      ["🛍️", "Spending rises", "Families make the big purchases they had been delaying."],
      ["🏪", "Business revenue rises", "Firms add shifts and hire more workers."],
      ["📈", "GDP grows", `Consumer spending is about two-thirds of GDP${GDP_CITE}, so more spending means more output.`],
      ["🔁", "Even more hiring", "An upward spiral. If it overheats, it can push up inflation."],
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
      const [icon, title, text] = L.boxes[i];
      box.innerHTML = `<div class="ic" aria-hidden="true">${icon}</div><b>${i + 1}. ${title}</b>${text ? `<span>${text}</span>` : ""}`;
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
