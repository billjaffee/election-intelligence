# Federal Election Intelligence Engine

A production-ready, static electoral intelligence dashboard for U.S. House and Senate races. Built with vanilla HTML/CSS/JS — no framework, no build step, no server required. Deploy anywhere in minutes.

---

## Quick Start

1. Edit `data.js` with your race data (see schema below)
2. Open `index.html` in a browser — or run a local server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

3. Deploy to GitHub Pages (free):
   - Push repo to GitHub
   - Settings → Pages → Source: `main` branch, root folder
   - Live in ~60 seconds at `https://yourusername.github.io/repo-name/`

---

## What's in each file

| File | Purpose |
|---|---|
| `data.js` | **All race data.** Edit this file to update the dashboard. |
| `app.js` | Rendering engine. Reads `data.js`, builds the UI. Rarely needs editing. |
| `styles.css` | Design system. Edit CSS variables in `:root` to retheme. |
| `index.html` | Page structure. Add/remove sections here if needed. |
| `README.md` | This file. |

---

## Creating a New Race

### Step 1 — Duplicate the repo (or just `data.js`)

Copy this folder for each race you track. Only `data.js` changes per race. `app.js`, `styles.css`, and `index.html` are universal.

### Step 2 — Fill in `data.js`

Every section is documented below. Start from the top — `meta` through `footer`.

---

## `data.js` Schema Reference

### `meta` — page identity

```js
meta: {
  title:        "Pennsylvania U.S. Senate 2026",  // page title
  subtitle:     "Electoral intelligence dashboard...",
  chamber:      "senate",   // "senate" | "house"
  state:        "Pennsylvania",
  district:     null,       // null for Senate; integer for House (e.g. 7)
  electionDate: "2026-11-03",
  primaryDate:  "2026-05-19",
  lastUpdated:  "2026-05"   // YYYY-MM or YYYY-MM-DD
}
```

### `overview` — hero section

```js
overview: {
  eyebrow:  "2026 U.S. Senate · Pennsylvania",
  title:    "Casey vs. McCormick",
  subtitle: "One-paragraph race summary...",
  metrics: [
    { label: "Race",                value: "PA U.S. Senate"   },
    { label: "Partisan lean",       value: "D+1 (PVI)"        },
    { label: "Dem win probability", value: "52%", accent: true },  // accent: true = highlighted card
    { label: "Probability range",   value: "38–64%", note: "..." }
  ],
  callout: "Key insight paragraph...",
  keyVariablesHeading: "Top variables driving the outcome",
  keyVariables: [
    { title: "Variable name", impact: "±8 to 12 pts" }
  ]
}
```

### `candidates` — D vs R profiles

```js
candidates: {
  democrat: {
    name:        "Bob Casey",
    status:      "Declared",   // Declared | Exploring | TBD | Withdrawn
    isIncumbent: true,
    party:       "Democrat",
    partyKey:    "D",
    oneLiner:    "Three-term incumbent senator...",
    strengths:   ["Strength 1", "Strength 2"],
    weaknesses:  ["Weakness 1", "Weakness 2"],
    notes:       "Strategic context note..."
  },
  republican: {
    // same structure
  }
}
```

### `raceRatings` — forecaster ratings

```js
raceRatings: {
  description: "One-sentence context...",
  current: [
    {
      rater:      "Cook Political Report",
      rating:     "Toss Up",
      ratingTier: "tossup",     // see rating tiers below
      updated:    "2026-04"
    }
  ],
  history: [
    { date: "2026-01", cook: "Lean Republican", sabato: "Lean Republican", ie: "Lean Republican", cna: "Lean Republican" },
    { date: "2026-04", cook: "Toss Up",         sabato: "Leans Republican", ie: "Toss Up",        cna: "Toss Up"        }
  ]
}
```

**Rating tiers (controls badge color):**
| `ratingTier` value | Displayed as |
|---|---|
| `solid-dem` | Safe/Solid Democrat |
| `likely-dem` | Likely Democrat |
| `lean-dem` | Lean Democrat |
| `tossup` | Toss Up |
| `lean-rep` | Lean Republican |
| `likely-rep` | Likely Republican |
| `solid-rep` | Safe/Solid Republican |

If you omit `ratingTier`, the engine infers it from the `rating` string automatically.

### `nationalEnvironment` — national context

```js
nationalEnvironment: {
  genericBallot: {
    dem:    47,
    rep:    48,
    label:  "R+1",
    asOf:   "2026-05",
    source: "RealClearPolitics average"
  },
  presidentialApproval: {
    approve:    44,
    disapprove: 52,
    net:        -8,
    asOf:       "2026-05",
    source:     "FiveThirtyEight average"
  },
  // "strong-D" | "slight-D" | "neutral" | "slight-R" | "strong-R"
  waveEnvironment: "slight-R",
  historicalNote: "Context text..."
}
```

### `fundraising` — FEC quarterly data

```js
fundraising: {
  quarters: [
    {
      period: "Q1 2026",
      dem: { raised: 5100000, spent: 2200000, coh: 17400000 },
      rep: { raised: null,    spent: null,     coh: null     },  // null = unavailable
      note: "Optional quarterly note"
    }
  ],
  note: "Overall note about the fundraising section"
}
```

### `winProbabilityModel` — interactive model

```js
winProbabilityModel: {
  description: "One paragraph...",
  baseline: {
    demWinPct:  42,
    label:      "Baseline — current environment",
    derivation: "How you derived the baseline..."
  },
  sliders: [
    // Continuous slider (linear impact):
    {
      id:            "generic-ballot",
      label:         "Generic ballot shift",
      sublabel:      "D favorable →",
      min:           -6,
      max:           6,
      step:          1,
      default:       0,
      unit:          "pts",
      impactPerUnit: 1.8,   // Dem win % change per unit of slider
      note:          "Helper note shown below slider"
    },
    // Discrete slider (non-linear, labeled steps):
    {
      id:         "candidate-quality",
      label:      "Republican nominee quality",
      sublabel:   "Better nominee →",
      min:        -3,
      max:        3,
      step:       1,
      default:    0,
      impactMap:  { "-3": 10, "-2": 6, "-1": 3, "0": 0, "1": -3, "2": -6, "3": -10 },
      labels:     { "-3": "Walker-tier", "0": "Average", "3": "Kemp-tier" },
      note:       "Helper note..."
    }
  ],
  tiers: [
    { min: 70, max: 100, label: "Safe Democrat",     color: "solid-dem"  },
    { min: 60, max: 69,  label: "Likely Democrat",   color: "likely-dem" },
    { min: 54, max: 59,  label: "Lean Democrat",     color: "lean-dem"   },
    { min: 46, max: 53,  label: "Toss Up",           color: "tossup"     },
    { min: 40, max: 45,  label: "Lean Republican",   color: "lean-rep"   },
    { min: 30, max: 39,  label: "Likely Republican", color: "likely-rep" },
    { min: 0,  max: 29,  label: "Safe Republican",   color: "solid-rep"  }
  ],
  sensitivityHeading: "What moves the needle most",
  sensitivity: [
    { variable: "Variable name", direction: "positive", impact: "+6 to +10 pts" },
    { variable: "Other variable", direction: "negative", impact: "−5 to −8 pts" },
    { variable: "Uncertain variable", direction: "varies", impact: "±5 to 10 pts" }
  ]
}
```

### `milestones` — timeline

```js
milestones: [
  {
    date:        "2026-05-19",       // YYYY-MM-DD, YYYY-MM, or free string
    title:       "Georgia Primary",
    description: "Full description of why this date matters...",
    status:      "pending",          // "pending" | "happened" | "overdue"
    notes:       "Post-event notes (shown indented below description)",
    emphasis:    true                // true = gold title, bigger dot
  }
]
```

### `probabilityTracker` — historical probability log

```js
probabilityTracker: {
  description: "One sentence context...",
  demLabel:    "Ossoff (D) win probability",
  entries: [
    {
      date:        "2026-05",
      probability: 42,         // integer 0–100
      reason:      "Why you set this estimate..."
    }
  ]
}
```

**Add a new entry** each time you update your probability estimate. The chart and log update automatically. Sorted chronologically for the chart, reverse-chronologically for the log.

### `electorate` — collapsible district profile

```js
electorate: {
  heading:    "Georgia Electorate Profile",
  subheading: "Source line / description",
  methodNote: "Methodological context paragraph...",
  presidentialResults: {
    title: "2024 Presidential — Georgia",
    segments: [
      { label: "Trump (R)",  value: 50.7, color: "rep"  },  // color: "dem" | "rep" | "gray"
      { label: "Harris (D)", value: 48.5, color: "dem"  },
      { label: "Other",      value: 0.8,  color: "gray" }
    ],
    note: "Analytical note about these results..."
  },
  priorSenateResults: { /* same structure */ },
  voterRegistration:  { /* same structure */ },
  demographics: {
    title: "Key county dynamics",
    cards: [
      { label: "Fulton County",  value: "D+40 — Ossoff's base" }
    ]
  }
}
```

### `citations` — section footnotes

```js
citations: {
  overview:             "Sources: ...",
  candidates:           "Sources: ...",
  raceRatings:          "Sources: ...",
  fundraising:          "Source: FEC...",
  winProbabilityModel:  "Methodology: ...",
  milestones:           "Sources: ...",
  probabilityTracker:   "All estimates are analytical judgments...",
  electorate:           "Sources: ..."
}
```

### `footer`

```js
footer: {
  author:             "Your Name & Claude",
  lastUpdatedDisplay: "May 2026",
  disclaimer:         "All probability estimates are analytical judgments, not polling."
}
```

---

## Tips

- **Adding a new probability entry:** Add to `probabilityTracker.entries`. The chart auto-extends.
- **Updating ratings:** Add a new row to `raceRatings.history` and update `raceRatings.current`.
- **Marking milestones done:** Change `status: "pending"` to `status: "happened"` and add a `notes` string.
- **Tuning the model:** Adjust `impactPerUnit` or `impactMap` values in `winProbabilityModel.sliders` to calibrate how much each factor moves the needle.
- **Retheming:** Edit the CSS variables in `:root` in `styles.css`. Swap `--dem`, `--rep`, `--gold` to match your brand.
- **Scaling to multiple races:** Copy the whole folder, rename, and edit only `data.js`.

---

## File dependencies

```
index.html
  └── styles.css
  └── https://cdnjs.cloudflare.com/…/chart.umd.min.js  (Chart.js, CDN)
  └── data.js     ← edit this for each race
  └── app.js      ← universal engine, rarely edited
```

No npm. No build step. No server required.

---

*Built with Claude Code · Engine designed for rapid deployment across any U.S. House or Senate race.*
