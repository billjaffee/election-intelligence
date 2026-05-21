// =============================================================================
// Federal Election Intelligence Engine — Renderer
// =============================================================================
// Reads window.dashboardData (from data.js) and renders each section.
// Wires the interactive win probability model, nav active-state,
// scroll-reveal animations, and the probability chart.
// =============================================================================

(function () {
  "use strict";

  const data = window.dashboardData;
  if (!data) {
    console.error("dashboardData missing. Ensure data.js loads before app.js.");
    return;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const $ = (id) => document.getElementById(id);

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class")   node.className = v;
      else if (k === "dataset") Object.entries(v).forEach(([dk, dv]) => (node.dataset[dk] = dv));
      else if (k === "html")    node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  };

  // Format ISO date strings for display
  const fmtDate = (s) => {
    if (!s) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      return new Date(s + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    if (/^\d{4}-\d{2}$/.test(s)) {
      return new Date(s + "-01T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long" });
    }
    return s;
  };

  // Sort key for dates that may be YYYY-MM or YYYY-MM-DD
  const sortKey = (s) => {
    if (!s) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{4}-\d{2}$/.test(s)) return s + "-01";
    const d = new Date(s);
    return isNaN(d) ? s : d.toISOString().slice(0, 10);
  };

  // Format currency (compact: $1.2M, $850K)
  const fmtMoney = (n) => {
    if (n == null) return null;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
  };

  // Format full dollar amount with commas
  const fmtDollar = (n) => {
    if (n == null) return "—";
    return "$" + Number(n).toLocaleString("en-US");
  };

  // Rating string → CSS tier key
  const ratingToTier = (rating) => {
    if (!rating) return "tossup";
    const r = rating.toLowerCase();
    if (r.includes("solid dem") || r.includes("safe dem"))    return "solid-dem";
    if (r.includes("likely dem"))                              return "likely-dem";
    if (r.includes("lean dem") || r.includes("leans dem"))    return "lean-dem";
    if (r.includes("toss"))                                    return "tossup";
    if (r.includes("lean rep") || r.includes("leans rep"))    return "lean-rep";
    if (r.includes("likely rep"))                             return "likely-rep";
    if (r.includes("solid rep") || r.includes("safe rep"))    return "solid-rep";
    return "tossup";
  };

  // ---------------------------------------------------------------------------
  // Overview (hero)
  // ---------------------------------------------------------------------------

  function renderOverview() {
    const o = data.overview || {};
    const m = data.meta    || {};

    const brand = $("nav-brand");
    if (brand) brand.textContent = m.chamber === "senate"
      ? `${m.state} Senate '${String(m.electionDate || "").slice(2,4)}`
      : `${m.state}-${m.district || ""} '${String(m.electionDate || "").slice(2,4)}`;

    const eyebrow = $("overview-eyebrow");
    if (eyebrow) eyebrow.textContent = o.eyebrow || "";

    const title = $("overview-title");
    if (title) title.textContent = o.title || m.title || "";

    // Hero banner — derive candidate names from the title ("Ossoff vs. Collins")
    const titleParts = String(o.title || m.title || "").split(/\s+vs\.?\s+/i);
    const demCandEl = $("hero-dem-cand");
    const repCandEl = $("hero-rep-cand");
    if (demCandEl) demCandEl.textContent = titleParts[0] || "Democrat";
    if (repCandEl) repCandEl.textContent = titleParts[1] || "Republican";

    // Metrics grid
    const grid = $("overview-metrics");
    if (grid) {
      grid.innerHTML = "";
      (o.metrics || []).forEach((metric) => {
        let value = metric.value;
        if (metric.dynamic === "countdown" && metric.target) {
          const target = new Date(metric.target + "T00:00:00");
          const today  = new Date();
          today.setHours(0, 0, 0, 0);
          const days = Math.max(0, Math.ceil((target - today) / 86400000));
          value = String(days);
        }
        const classes =
          "metric-card"
          + (metric.accent  ? " metric-card--accent"   : "")
          + (metric.variant ? ` metric-card--${metric.variant}` : "");
        grid.appendChild(
          el("div", { class: classes }, [
            el("p", { class: "metric-label" }, metric.label || ""),
            el("p", { class: "metric-value"  }, String(value ?? "—")),
            metric.note ? el("p", { class: "metric-note" }, metric.note) : null
          ])
        );
      });
    }

    // Callout
    const callout = $("overview-callout");
    if (callout) callout.textContent = o.callout || "";

    // Key variables
    const kvHead = $("key-variables-heading");
    if (kvHead) kvHead.textContent = o.keyVariablesHeading || "Key variables";
    const kvWrap = $("overview-key-variables");
    if (kvWrap) {
      kvWrap.innerHTML = "";
      (o.keyVariables || []).forEach((kv, i) => {
        kvWrap.appendChild(
          el("div", { class: "key-variable-card" }, [
            el("p", { class: "kv-rank" }, `#${i + 1}`),
            el("p", { class: "kv-title" }, kv.title || ""),
            el("p", { class: "kv-impact" }, kv.impact || "")
          ])
        );
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Race Ratings
  // ---------------------------------------------------------------------------

  function renderRatings() {
    const rr = data.raceRatings || {};

    const intro = $("ratings-intro");
    if (intro) intro.textContent = rr.description || "";

    // Current ratings grid
    const ratingsGrid = $("ratings-grid");
    if (ratingsGrid) {
      ratingsGrid.innerHTML = "";
      (rr.current || []).forEach((r) => {
        const tier = r.ratingTier || ratingToTier(r.rating);
        ratingsGrid.appendChild(
          el("div", { class: "rater-card" }, [
            el("p", { class: "rater-name" }, r.rater || ""),
            el("span", { class: "rating-badge", dataset: { tier } }, r.rating || ""),
            el("p", { class: "rater-updated" }, r.updated ? `Updated ${fmtDate(r.updated)}` : "")
          ])
        );
      });
    }

    // Rating history table
    const histTable = $("ratings-history-table");
    if (histTable && (rr.history || []).length) {
      histTable.innerHTML = "";
      histTable.appendChild(
        el("thead", {}, el("tr", {}, [
          el("th", {}, "Date"),
          el("th", {}, "Cook Political"),
          el("th", {}, "Sabato's Crystal Ball"),
          el("th", {}, "Inside Elections"),
          el("th", {}, "CNalysis")
        ]))
      );
      const tbody = el("tbody");
      (rr.history || []).slice().sort((a, b) => sortKey(b.date) > sortKey(a.date) ? 1 : -1).forEach((row) => {
        const makeBadge = (rating) => {
          if (!rating) return el("td", {}, "—");
          const tier = ratingToTier(rating);
          return el("td", {}, el("span", { class: "rating-badge inline-rating", dataset: { tier } }, rating));
        };
        tbody.appendChild(el("tr", {}, [
          el("td", {}, fmtDate(row.date)),
          makeBadge(row.cook),
          makeBadge(row.sabato),
          makeBadge(row.ie),
          makeBadge(row.cna)
        ]));
      });
      histTable.appendChild(tbody);
    }
  }

  // ---------------------------------------------------------------------------
  // Public Polling
  // ---------------------------------------------------------------------------

  function renderPolling() {
    const p     = data.polling || {};
    const polls = (p.polls || []).slice().sort((a, b) => sortKey(b.date) > sortKey(a.date) ? 1 : -1);

    const intro = $("polling-intro");
    if (intro) intro.textContent = p.description || "";

    const wrap     = $("polling-table-wrap");
    const table    = $("polling-table");
    const avgWrap  = $("polling-average");
    const emptyEl  = $("polling-empty");

    if (!polls.length) {
      if (wrap)    wrap.style.display = "none";
      if (avgWrap) avgWrap.style.display = "none";
      if (emptyEl) emptyEl.textContent  = "No public polling available yet";
      return;
    }

    if (wrap)    wrap.style.display = "";
    if (avgWrap) avgWrap.style.display = "";
    if (emptyEl) emptyEl.textContent  = "";

    // Polling average — single topline number (spread)
    if (avgWrap) {
      const avgOss = polls.reduce((s, x) => s + (x.ossoff  || 0), 0) / polls.length;
      const avgCol = polls.reduce((s, x) => s + (x.collins || 0), 0) / polls.length;
      const spread = avgOss - avgCol;
      const leader = spread > 0 ? "Ossoff" : spread < 0 ? "Collins" : "Tied";
      const sign   = spread > 0 ? "+" : spread < 0 ? "−" : "";
      const mag    = Math.abs(spread).toFixed(1);
      const color  = spread > 0 ? "dem" : spread < 0 ? "rep" : "neutral";
      avgWrap.innerHTML = "";
      avgWrap.appendChild(el("p",   { class: "polling-average-label" }, "Polling average"));
      avgWrap.appendChild(el("p",   { class: `polling-average-value polling-average-value--${color}` },
        spread === 0 ? "Tied" : `${leader} ${sign}${mag}`));
      avgWrap.appendChild(el("p",   { class: "polling-average-sub" },
        `Mean of ${polls.length} poll${polls.length === 1 ? "" : "s"} · Ossoff ${avgOss.toFixed(1)}% · Collins ${avgCol.toFixed(1)}%`));
    }

    // Poll table
    if (table) {
      table.innerHTML = "";
      table.appendChild(
        el("thead", {}, el("tr", {}, [
          el("th", {}, "Pollster"),
          el("th", {}, "Date"),
          el("th", {}, "Sample"),
          el("th", {}, "Ossoff %"),
          el("th", {}, "Collins %"),
          el("th", {}, "Spread"),
          el("th", {}, "Source")
        ]))
      );
      const tbody = el("tbody");
      polls.forEach((poll) => {
        const oss   = Number(poll.ossoff  || 0);
        const col   = Number(poll.collins || 0);
        const sprd  = oss - col;
        const sprdLabel = sprd > 0 ? `Ossoff +${sprd.toFixed(1)}`
          : sprd < 0 ? `Collins +${Math.abs(sprd).toFixed(1)}`
          : "Tied";
        const sprdClass = sprd > 0 ? "dem-val" : sprd < 0 ? "rep-val" : "varies";
        tbody.appendChild(el("tr", {}, [
          el("td", {}, poll.pollster || "—"),
          el("td", {}, poll.date ? fmtDate(poll.date) : "—"),
          el("td", { class: "numeric" }, poll.sampleSize != null ? `n=${poll.sampleSize}` : "—"),
          el("td", { class: "dem-val" }, oss ? `${oss}%` : "—"),
          el("td", { class: "rep-val" }, col ? `${col}%` : "—"),
          el("td", { class: sprdClass }, sprdLabel),
          el("td", {}, poll.link
            ? el("a", { href: poll.link, target: "_blank", rel: "noopener" }, "View")
            : "—")
        ]));
      });
      table.appendChild(tbody);
    }
  }

  // ---------------------------------------------------------------------------
  // Fundraising
  // ---------------------------------------------------------------------------

  function renderFundraising() {
    const f = data.fundraising || {};
    const quarters = f.quarters || [];

    // Summary cards — latest quarter with data
    const summary = $("fundraising-summary");
    if (summary) {
      summary.innerHTML = "";
      const latest = quarters.slice().reverse().find(q => q.dem && q.dem.coh != null);
      const latestRep = quarters.slice().reverse().find(q => q.rep && q.rep.coh != null);
      const demCoh = latest && latest.dem ? latest.dem.coh : null;
      const repCoh = latestRep && latestRep.rep ? latestRep.rep.coh : null;

      const demTotal = quarters.reduce((acc, q) => acc + (q.dem && q.dem.raised || 0), 0);
      const repTotal = quarters.reduce((acc, q) => acc + (q.rep && q.rep.raised || 0), 0);

      summary.appendChild(
        el("div", { class: "funder-card funder-card--dem" }, [
          el("p", { class: "funder-label" }, "Democrat · Cash on Hand"),
          el("p", { class: "funder-value funder-value--dem" }, demCoh != null ? fmtMoney(demCoh) : "—"),
          el("p", { class: "funder-sub" }, latest ? `as of ${latest.period}` : "")
        ])
      );
      summary.appendChild(
        el("div", { class: "funder-card funder-card--rep" }, [
          el("p", { class: "funder-label" }, "Republican · Cash on Hand"),
          el("p", { class: "funder-value funder-value--rep" }, repCoh != null ? fmtMoney(repCoh) : "Not declared"),
          el("p", { class: "funder-sub" }, latestRep ? `as of ${latestRep.period}` : "Field undeclared")
        ])
      );
      summary.appendChild(
        el("div", { class: "funder-card" }, [
          el("p", { class: "funder-label" }, "Total Raised This Cycle — Dem"),
          el("p", { class: "funder-value funder-value--dem" }, demTotal ? fmtMoney(demTotal) : "—"),
          el("p", { class: "funder-sub" }, repTotal ? `vs. ${fmtMoney(repTotal)} Republican` : "R total not available")
        ])
      );
    }

    // Cash comparison bar
    const compareWrap = $("cash-compare-wrap");
    if (compareWrap) {
      const latestD = quarters.slice().reverse().find(q => q.dem && q.dem.coh != null);
      const latestR = quarters.slice().reverse().find(q => q.rep && q.rep.coh != null);
      const demCoh = latestD && latestD.dem ? latestD.dem.coh : null;
      const repCoh = latestR && latestR.rep ? latestR.rep.coh : null;

      if (demCoh != null || repCoh != null) {
        const total = (demCoh || 0) + (repCoh || 0);
        const demPct = total ? ((demCoh || 0) / total * 100).toFixed(1) : 50;
        const repPct = total ? ((repCoh || 0) / total * 100).toFixed(1) : 50;
        const bar = el("div", { class: "cash-compare-bar" });
        const demBar = el("div", { class: "cash-bar-dem", style: `width:${demCoh != null ? demPct : 0}%` });
        const repBar = el("div", { class: "cash-bar-rep", style: `width:${repCoh != null ? repPct : 0}%` });
        bar.appendChild(demBar);
        bar.appendChild(repBar);
        compareWrap.innerHTML = "";
        compareWrap.appendChild(
          el("p", { class: "cash-compare-label" }, "Cash on Hand — Head to Head")
        );
        compareWrap.appendChild(bar);
        const legend = el("div", { class: "cash-compare-legend" });
        legend.appendChild(el("span", {}, [
          el("span", { class: "cash-legend-dot cash-legend-dot--dem" }),
          document.createTextNode(`Democrat ${demCoh != null ? fmtMoney(demCoh) : "N/A"} (${demCoh != null ? demPct + "%" : "—"})`)
        ]));
        legend.appendChild(el("span", {}, [
          el("span", { class: "cash-legend-dot cash-legend-dot--rep" }),
          document.createTextNode(`Republican ${repCoh != null ? fmtMoney(repCoh) : "Not declared"}`)
        ]));
        compareWrap.appendChild(legend);
      }
    }

    const noteEl = $("fundraising-note");
    if (noteEl) noteEl.textContent = f.note || "";
  }

  // ---------------------------------------------------------------------------
  // Win Probability Model (interactive)
  // ---------------------------------------------------------------------------

  function renderWinModel() {
    const model = data.winProbabilityModel;
    if (!model) return;

    const descEl = $("model-description");
    if (descEl) descEl.textContent = model.description || "";

    const baselinePct = model.baseline ? model.baseline.demWinPct : 50;

    // Set baseline display
    const baselineValEl = $("prob-baseline-val");
    if (baselineValEl) baselineValEl.textContent = `${baselinePct}%`;

    // Slider state: { sliderId: currentValue }
    const sliderValues = {};
    (model.sliders || []).forEach((s) => { sliderValues[s.id] = s.default; });

    // Build slider controls
    const slidersWrap = $("model-sliders");
    if (slidersWrap) {
      slidersWrap.innerHTML = "";
      (model.sliders || []).forEach((slider) => {
        const valDisplay = el("span", { class: "slider-current-val" }, getSliderLabel(slider, slider.default));
        const range = el("input", {
          type: "range",
          id: `slider-${slider.id}`,
          min: String(slider.min),
          max: String(slider.max),
          step: String(slider.step || 1),
          value: String(slider.default)
        });
        range.addEventListener("input", () => {
          const v = parseInt(range.value);
          sliderValues[slider.id] = v;
          valDisplay.textContent = getSliderLabel(slider, v);
          updateProbDisplay();
        });

        slidersWrap.appendChild(
          el("div", { class: "slider-control" }, [
            el("div", { class: "slider-header" }, [
              el("div", {}, [
                el("span", { class: "slider-label" }, slider.label || ""),
                slider.sublabel ? el("span", { class: "slider-sublabel" }, ` · ${slider.sublabel}`) : null
              ]),
              valDisplay
            ]),
            el("div", { class: "slider-row" }, [
              el("span", { class: "slider-end" }, String(slider.min) + (slider.unit || "")),
              range,
              el("span", { class: "slider-end" }, "+" + slider.max + (slider.unit || ""))
            ]),
            slider.note ? el("p", { class: "slider-note" }, slider.note) : null
          ])
        );
      });
    }

    // Initial display
    updateProbDisplay();

    function updateProbDisplay() {
      const prob = computeProbability(sliderValues);
      const tier = getTier(prob);
      const adj  = prob - baselinePct;

      const numEl = $("prob-number");
      if (numEl) {
        numEl.textContent = `${prob}%`;
        // Color shifts with tier
        numEl.style.color = prob >= 54 ? "var(--dem)"
          : prob <= 46                 ? "var(--rep)"
          : "var(--text-primary)";
      }

      const repNumEl = $("prob-number-rep");
      if (repNumEl) {
        repNumEl.textContent = `${100 - prob}%`;
      }

      const tierEl = $("prob-tier");
      if (tierEl) tierEl.textContent = tier ? tier.label : "—";

      const adjEl = $("prob-adjustment");
      if (adjEl) {
        if (adj === 0) {
          adjEl.textContent = "No adjustment from baseline";
          adjEl.className = "prob-adjustment";
        } else {
          adjEl.textContent = (adj > 0 ? "+" : "") + adj + " pts from baseline";
          adjEl.className = `prob-adjustment ${adj > 0 ? "pos" : "neg"}`;
        }
      }

      const needle = $("prob-needle");
      if (needle) needle.style.left = `${prob}%`;

      // ── Hero banner sync ────────────────────────────────────────────────
      const heroMain   = $("hero-prob-main");
      const heroDemPct = $("hero-dem-pct");
      const heroRepPct = $("hero-rep-pct");
      const heroNeedle = $("hero-dial-needle");
      const heroLabel  = $("hero-prob-label");
      if (heroMain) {
        if (prob >= 54) {
          heroMain.textContent = `${prob}%`;
          heroMain.style.color = "var(--dem)";
          heroMain.style.setProperty("--hero-glow", "rgba(29,78,216,.45)");
          if (heroLabel) heroLabel.textContent = "Democratic Win Probability";
        } else if (prob <= 46) {
          heroMain.textContent = `${100 - prob}%`;
          heroMain.style.color = "var(--rep)";
          heroMain.style.setProperty("--hero-glow", "rgba(190,18,60,.45)");
          if (heroLabel) heroLabel.textContent = "Republican Win Probability";
        } else {
          heroMain.textContent = `${prob}%`;
          heroMain.style.color = "var(--text-primary)";
          heroMain.style.setProperty("--hero-glow", "rgba(26,25,40,.30)");
          if (heroLabel) heroLabel.textContent = "Democratic Win Probability";
        }
      }
      if (heroDemPct) heroDemPct.textContent = `${prob}%`;
      if (heroRepPct) heroRepPct.textContent = `${100 - prob}%`;
      if (heroNeedle) {
        // 0% Dem → -90° (full Rep, left); 50% → 0°; 100% → +90° (full Dem, right)
        const rotation = (prob - 50) * 1.8;
        heroNeedle.style.transform = `rotate(${rotation}deg)`;
      }
    }
  }

  function getSliderLabel(slider, val) {
    if (slider.labels) return slider.labels[String(val)] || String(val);
    const v = Number(val);
    const sign = v > 0 ? "+" : "";
    return `${sign}${v}${slider.unit || ""}`;
  }

  function computeProbability(sliderValues) {
    const model = data.winProbabilityModel;
    if (!model) return 50;
    let prob = model.baseline ? model.baseline.demWinPct : 50;
    (model.sliders || []).forEach((slider) => {
      const val = parseInt(sliderValues[slider.id] ?? slider.default);
      if (slider.impactPerUnit !== undefined) {
        prob += val * slider.impactPerUnit;
      } else if (slider.impactMap) {
        prob += slider.impactMap[String(val)] || 0;
      }
    });
    return Math.max(5, Math.min(95, Math.round(prob)));
  }

  function getTier(prob) {
    const tiers = (data.winProbabilityModel || {}).tiers || [];
    return tiers.find((t) => prob >= t.min && prob <= t.max) || { label: "Toss Up", color: "tossup" };
  }

  // ---------------------------------------------------------------------------
  // Milestones
  // ---------------------------------------------------------------------------

  function renderMilestones() {
    const list = $("milestone-list");
    if (!list) return;
    list.innerHTML = "";
    (data.milestones || []).forEach((m) => {
      list.appendChild(
        el("li", {
          class: "milestone-item",
          dataset: { status: m.status || "pending", emphasis: m.emphasis ? "true" : "false" }
        }, [
          el("p", { class: "milestone-date"        }, fmtDate(m.date)),
          el("p", { class: "milestone-title"       }, m.title || ""),
          m.description ? el("p", { class: "milestone-description" }, m.description) : null,
          m.notes       ? el("p", { class: "milestone-notes"       }, m.notes)       : null
        ])
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Electorate (collapsible)
  // ---------------------------------------------------------------------------

  function buildStackedBar(segConfig) {
    if (!segConfig) return null;
    const wrap = el("div", { class: "electorate-subsection" });
    wrap.appendChild(el("h3", { class: "electorate-subsection-title" }, segConfig.title || ""));

    const bar = el("div", { class: "stacked-bar" });
    (segConfig.segments || []).forEach((seg) => {
      const showLabel = seg.value >= 10;
      const segEl = el("div", {
        class: "bar-segment",
        style: `width:${seg.value}%`,
        dataset: { color: seg.color || "gray" },
        title: `${seg.label}: ${seg.value}%`
      }, showLabel
        ? el("span", { class: "segment-label" }, `${seg.label} ${seg.value}%`)
        : null
      );
      bar.appendChild(segEl);
    });
    wrap.appendChild(bar);

    if (segConfig.note) {
      wrap.appendChild(el("p", { class: "bar-stacked-note" }, segConfig.note));
    }
    return wrap;
  }

  function buildDemographics(demos) {
    if (!demos) return null;
    const wrap = el("div", { class: "electorate-subsection" });
    wrap.appendChild(el("h3", { class: "electorate-subsection-title" }, demos.title || ""));
    const grid = el("div", { class: "demographics-grid" });
    (demos.cards || []).forEach((c) => {
      grid.appendChild(
        el("div", { class: "demo-card" }, [
          el("p", { class: "demo-card-label" }, c.label || ""),
          el("p", { class: "demo-card-value" }, c.value || "")
        ])
      );
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderElectorate() {
    const e = data.electorate;
    if (!e) return;

    const heading = $("electorate-heading");
    if (heading) heading.textContent = e.heading || "Electorate Profile";

    const subheading = $("electorate-subheading");
    if (subheading) subheading.textContent = e.subheading || "";

    const methodNote = $("electorate-method-note");
    if (methodNote) methodNote.textContent = e.methodNote || "";

    const body = $("electorate-body");
    if (!body) return;
    body.innerHTML = "";

    [
      buildStackedBar(e.presidentialResults),
      buildStackedBar(e.priorSenateResults),
      buildStackedBar(e.voterRegistration),
      buildDemographics(e.demographics)
    ].forEach((node) => { if (node) body.appendChild(node); });
  }

  // ---------------------------------------------------------------------------
  // Electorate collapse/expand
  // ---------------------------------------------------------------------------

  const ELECTORATE_KEY = "fed-electorate-expanded";

  function setElectorateExpanded(open) {
    const btn  = $("electorate-toggle");
    const pane = $("electorate-collapse");
    if (!btn || !pane) return;
    pane.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    try { localStorage.setItem(ELECTORATE_KEY, String(open)); } catch (_) {}
  }

  function wireElectorateCollapse() {
    const header = $("electorate-header");
    const btn    = $("electorate-toggle");
    const pane   = $("electorate-collapse");
    if (!header || !btn || !pane) return;

    let saved = null;
    try { saved = localStorage.getItem(ELECTORATE_KEY); } catch (_) {}
    if (saved === "true") {
      pane.style.transition = "none";
      setElectorateExpanded(true);
      void pane.offsetHeight;
      pane.style.transition = "";
    }

    header.addEventListener("click", () => {
      setElectorateExpanded(btn.getAttribute("aria-expanded") !== "true");
    });
  }

  // ---------------------------------------------------------------------------
  // Citations + Footer
  // ---------------------------------------------------------------------------

  function renderCitations() {
    const c = data.citations || {};
    document.querySelectorAll(".citation[data-citation-key]").forEach((node) => {
      const key = node.dataset.citationKey;
      if (c[key]) node.textContent = c[key];
    });
  }

  function renderFooter() {
    const f = data.footer || {};
    const el2 = $("footer-text");
    if (el2) el2.textContent =
      `Analysis by ${f.author || "—"} · Last updated: ${f.lastUpdatedDisplay || fmtDate(data.meta.lastUpdated)} · ${f.disclaimer || ""}`;
  }

  // ---------------------------------------------------------------------------
  // Sticky nav — scroll shadow + active section
  // ---------------------------------------------------------------------------

  function wireNav() {
    const nav   = $("site-nav");
    const links = Array.from(document.querySelectorAll(".nav-links a[data-section]"));
    const sects = links.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);

    // Scroll shadow
    window.addEventListener("scroll", () => {
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20);
    }, { passive: true });

    // Active section highlight
    const setActive = (id) => {
      links.forEach((a) => a.classList.toggle("is-active", a.dataset.section === id));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    sects.forEach((s) => observer.observe(s));

    // Mobile hamburger
    const hamburger = $("nav-hamburger");
    const menu      = $("nav-menu");
    if (hamburger && menu) {
      hamburger.addEventListener("click", () => {
        const open = menu.classList.toggle("is-open");
        hamburger.setAttribute("aria-expanded", String(open));
      });
      // Close on link click
      links.forEach((a) => {
        a.addEventListener("click", () => {
          menu.classList.remove("is-open");
          hamburger.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Scroll progress bar (fixed bar above nav, fills as the user scrolls)
  // ---------------------------------------------------------------------------

  function wireScrollProgress() {
    const bar = $("scroll-progress");
    if (!bar) return;
    const update = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // ---------------------------------------------------------------------------
  // Scroll-reveal (IntersectionObserver)
  // ---------------------------------------------------------------------------

  function wireScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", () => {
    renderOverview();
    renderRatings();
    renderPolling();
    renderFundraising();
    renderWinModel();
    renderMilestones();
    renderElectorate();
    renderCitations();
    renderFooter();
    wireElectorateCollapse();
    wireNav();
    wireScrollProgress();
    wireScrollReveal();
  });

})();
