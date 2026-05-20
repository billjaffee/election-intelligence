// =============================================================================
// Federal Election Intelligence Engine — Data
// =============================================================================
// Single source of truth. Edit this file to update the dashboard.
// Replace ALL values below with race-specific data.
// See README.md for a full field-by-field guide.
// Dates: use ISO format (YYYY-MM-DD or YYYY-MM). Free-form strings also work.
// =============================================================================

const dashboardData = {

  // ---------------------------------------------------------------------------
  // META
  // ---------------------------------------------------------------------------
  meta: {
    title:        "Georgia U.S. Senate 2026",
    subtitle:     "Electoral intelligence dashboard — 2026 Georgia Senate general election.",
    chamber:      "senate",    // "senate" | "house"
    state:        "Georgia",
    district:     null,        // null for Senate; integer for House (e.g. 7)
    electionDate: "2026-11-03",
    primaryDate:  "2026-05-19",
    lastUpdated:  "2026-05"
  },

  // ---------------------------------------------------------------------------
  // OVERVIEW
  // ---------------------------------------------------------------------------
  overview: {
    eyebrow:  "2026 U.S. Senate · Georgia",
    title:    "Ossoff vs. TBD Republican",
    subtitle:
      "Georgia is the single most consequential Senate battleground of 2026. " +
      "Ossoff must overcome a structural R+3 lean, midterm headwinds for Democrats, " +
      "and a potential top-tier Republican challenger to win a second term.",
    metrics: [
      { label: "Race",                value: "Georgia U.S. Senate"  },
      { label: "Election date",       value: "November 3, 2026"     },
      { label: "Primary date",        value: "May 19, 2026"         },
      { label: "Partisan lean",       value: "R+3 (PVI)"            },
      { label: "Dem win probability", value: "42%", accent: true    },
      { label: "Probability range",   value: "28–58%", note: "depending on R nominee" }
    ],
    callout:
      "The single most important variable in this race is Republican nominee quality. " +
      "A Brian Kemp candidacy likely moves this to Lean Republican. A Walker-tier " +
      "nominee likely moves this to Toss Up or better for Ossoff. Watch the May 2026 " +
      "primary result closely — it resets the entire model.",
    keyVariablesHeading: "Top variables driving the outcome",
    keyVariables: [
      { title: "Republican nominee identity & quality",     impact: "±10 to 12 pts" },
      { title: "National wave direction (generic ballot)",  impact: "±7 to 10 pts"  },
      { title: "Ossoff net approval trajectory in Georgia", impact: "±5 to 8 pts"   }
    ]
  },

  // ---------------------------------------------------------------------------
  // CANDIDATES
  // ---------------------------------------------------------------------------
  candidates: {
    democrat: {
      name:        "Jon Ossoff",
      status:      "Declared",   // Declared | Exploring | TBD | Withdrawn
      isIncumbent: true,
      party:       "Democrat",
      partyKey:    "D",
      oneLiner:    "First-term incumbent; first Jewish senator elected from the South",
      strengths: [
        "Incumbency advantage, statewide name recognition, and built infrastructure",
        "Substantial cash-on-hand advantage over an undeclared Republican field",
        "Strong appeal to suburban Atlanta moderates and the growing non-white electorate",
        "Investigative journalism background fuels an accountability-focused brand"
      ],
      weaknesses: [
        "Georgia's underlying partisan lean is R+3 at the presidential level",
        "National Democratic brand is a structural headwind in a midterm environment",
        "Limited high-profile legislative wins to anchor a re-election message",
        "Must replicate the full 2020/2021 coalition without top-of-ticket energy"
      ],
      notes:
        "Won 2021 runoff 50.6–49.4 against David Perdue in a historically high-turnout " +
        "special election. General election environment will be more hostile. Ossoff needs " +
        "near-perfect coalition performance and a survivable Republican nominee."
    },
    republican: {
      name:        "TBD",
      status:      "TBD",
      isIncumbent: false,
      party:       "Republican",
      partyKey:    "R",
      oneLiner:    "Republican nominee TBD — primary expected May 19, 2026",
      strengths: [
        "Georgia's R+3 lean strongly favors the GOP in a neutral or R-wave environment",
        "Midterm elections historically deliver significant gains for the out-party",
        "Trump's active engagement in Georgia will drive base turnout in the general",
        "Ossoff's approval rating in Georgia is underwater — a natural opening"
      ],
      weaknesses: [
        "Candidate quality risk is severe — 2022 Walker effect cost Republicans this seat",
        "Contested primary could produce a divisive, wounded nominee for the general",
        "Atlanta metro's sustained Democratic shift is a long-term structural headwind",
        "Must overperform Trump 2024 margins in rural areas to overcome metro losses"
      ],
      notes:
        "Potential candidates include Brian Kemp (likely front-runner if he enters), " +
        "Mike Collins (R-GA-10), and others. Field is not yet set. Kemp's decision is " +
        "the single most watched development in this race."
    }
  },

  // ---------------------------------------------------------------------------
  // RACE RATINGS
  // ---------------------------------------------------------------------------
  raceRatings: {
    description:
      "Ratings from the four major nonpartisan election forecasters. Updated as conditions change. " +
      "Movement toward either party is a meaningful signal worth tracking.",
    current: [
      { rater: "Cook Political Report",    rating: "Toss Up",          ratingTier: "tossup",    updated: "2026-04" },
      { rater: "Sabato's Crystal Ball",    rating: "Leans Republican", ratingTier: "lean-rep",  updated: "2026-04" },
      { rater: "Inside Elections",         rating: "Toss Up",          ratingTier: "tossup",    updated: "2026-03" },
      { rater: "CNalysis",                 rating: "Toss Up",          ratingTier: "tossup",    updated: "2026-04" }
    ],
    // History: one entry per update cycle. Add entries as ratings shift.
    history: [
      { date: "2025-10", cook: "Likely Republican", sabato: "Likely Republican", ie: "Lean Republican",  cna: "Lean Republican"  },
      { date: "2026-01", cook: "Lean Republican",   sabato: "Lean Republican",   ie: "Lean Republican",  cna: "Lean Republican"  },
      { date: "2026-04", cook: "Toss Up",           sabato: "Leans Republican",  ie: "Toss Up",          cna: "Toss Up"          }
    ]
  },

  // ---------------------------------------------------------------------------
  // NATIONAL ENVIRONMENT
  // ---------------------------------------------------------------------------
  nationalEnvironment: {
    genericBallot: {
      dem:   47,
      rep:   48,
      label: "R+1",
      asOf:  "2026-05",
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
    historicalNote:
      "The president's party loses an average of 26 House seats and 3–4 Senate seats in midterms. " +
      "Democrats are defending 23 of 33 Class II seats in 2026 — a brutal map."
  },

  // ---------------------------------------------------------------------------
  // FUNDRAISING
  // ---------------------------------------------------------------------------
  fundraising: {
    quarters: [
      {
        period: "Q1 2025",
        dem: { raised: 3200000, spent: 890000,  coh: 8400000  },
        rep: { raised: null,    spent: null,     coh: null     },
        note: "Ossoff opens cycle with strong Q1; Republican field not yet declared."
      },
      {
        period: "Q2 2025",
        dem: { raised: 2800000, spent: 1100000, coh: 10100000 },
        rep: { raised: null,    spent: null,     coh: null     },
        note: ""
      },
      {
        period: "Q3 2025",
        dem: { raised: 3100000, spent: 1300000, coh: 11900000 },
        rep: { raised: null,    spent: null,     coh: null     },
        note: ""
      },
      {
        period: "Q4 2025",
        dem: { raised: 4200000, spent: 1600000, coh: 14500000 },
        rep: { raised: null,    spent: null,     coh: null     },
        note: "Q4 strong for incumbents; R nominee still TBD."
      },
      {
        period: "Q1 2026",
        dem: { raised: 5100000, spent: 2200000, coh: 17400000 },
        rep: { raised: null,    spent: null,     coh: null     },
        note: "Ossoff accelerates spend as campaign enters general-election mode."
      }
    ],
    note: "Republican nominee not yet declared. FEC data through Q1 2026. All figures in USD."
  },

  // ---------------------------------------------------------------------------
  // WIN PROBABILITY MODEL
  // ---------------------------------------------------------------------------
  winProbabilityModel: {
    description:
      "Adjust the sliders to model how shifts in the national environment, fundraising advantage, " +
      "and candidate factors move Jon Ossoff's estimated win probability. The baseline is derived " +
      "from Georgia's partisan lean (R+3) adjusted for the current national environment.",
    baseline: {
      demWinPct:  42,
      label:      "Baseline — current environment",
      derivation: "Georgia R+3 PVI + current R+1 generic ballot + midterm headwind for incumbent D"
    },
    sliders: [
      {
        id:            "generic-ballot",
        label:         "Generic ballot shift",
        sublabel:      "D favorable →",
        min:           -6,
        max:           6,
        step:          1,
        default:       0,
        unit:          "pts",
        impactPerUnit: 1.8,
        note:          "Current environment: R+1. Slide right for more D-favorable national environment."
      },
      {
        id:         "candidate-quality",
        label:      "Republican nominee quality",
        sublabel:   "Better nominee →",
        min:        -3,
        max:        3,
        step:       1,
        default:    0,
        impactMap:  { "-3": 10, "-2": 6, "-1": 3, "0": 0, "1": -3, "2": -6, "3": -10 },
        labels:     { "-3": "Walker-tier", "-2": "Weak", "-1": "Below avg", "0": "Average", "1": "Strong", "2": "Very strong", "3": "Kemp-tier" },
        note:       "Candidate quality had an estimated 5–8 pt effect in GA-2022. This is the highest-impact variable."
      },
      {
        id:            "incumbent-approval",
        label:         "Ossoff net approval in Georgia",
        sublabel:      "Higher approval →",
        min:           -15,
        max:           10,
        step:          1,
        default:       -4,
        unit:          "pts",
        impactPerUnit: 0.85,
        note:          "Net approval = approve% minus disapprove%. Average senator tracks near 0 in home state."
      },
      {
        id:         "fundraising-advantage",
        label:      "Dem cash-on-hand advantage",
        sublabel:   "D advantage →",
        min:        -3,
        max:        3,
        step:       1,
        default:    2,
        impactMap:  { "-3": -6, "-2": -4, "-1": -2, "0": 0, "1": 2, "2": 4, "3": 6 },
        labels:     { "-3": "R 2×+", "-2": "R 1.5×", "-1": "R slight", "0": "Even", "1": "D slight", "2": "D 1.5×", "3": "D 2×+" },
        note:       "Current: Ossoff holds a significant cash-on-hand advantage over the undeclared R field."
      }
    ],
    tiers: [
      { min: 70, max: 100, label: "Safe Democrat",        color: "solid-dem"  },
      { min: 60, max: 69,  label: "Likely Democrat",      color: "likely-dem" },
      { min: 54, max: 59,  label: "Lean Democrat",        color: "lean-dem"   },
      { min: 46, max: 53,  label: "Toss Up",              color: "tossup"     },
      { min: 40, max: 45,  label: "Lean Republican",      color: "lean-rep"   },
      { min: 30, max: 39,  label: "Likely Republican",    color: "likely-rep" },
      { min: 0,  max: 29,  label: "Safe Republican",      color: "solid-rep"  }
    ],
    sensitivityHeading: "What moves the needle most",
    sensitivity: [
      { variable: "Brian Kemp enters race",                direction: "negative", impact: "−8 to −12 pts" },
      { variable: "Weak or divisive R nominee (2022 repeat)", direction: "positive", impact: "+6 to +10 pts" },
      { variable: "D wave develops (generic D+4 or better)", direction: "positive", impact: "+7 to +10 pts" },
      { variable: "R wave develops (generic R+4 or worse)",  direction: "negative", impact: "−7 to −10 pts" },
      { variable: "Ossoff approval recovers to net +5",     direction: "positive", impact: "+5 to +7 pts"  },
      { variable: "Major scandal — either side",            direction: "varies",   impact: "±8 to 15 pts"  },
      { variable: "Trump actively campaigns in Georgia",    direction: "negative", impact: "−3 to −5 pts"  },
      { variable: "R outraises Ossoff 2:1 by Q3 2026",     direction: "negative", impact: "−4 to −6 pts"  }
    ]
  },

  // ---------------------------------------------------------------------------
  // MILESTONES
  // ---------------------------------------------------------------------------
  // Status values: "pending" | "happened" | "overdue"
  milestones: [
    {
      date:        "2026-04-15",
      title:       "Q1 2026 FEC Filing",
      description: "First major fundraising snapshot of the election year. R candidate Q1 haul vs. Ossoff is the key number. A R candidate reaching $3M+ signals a credible general-election threat.",
      status:      "happened",
      notes:       "Ossoff: $5.1M raised, $17.4M cash on hand. Republican total unavailable — field undeclared.",
      emphasis:    false
    },
    {
      date:        "2026-05-19",
      title:       "Georgia Primary",
      description: "Republican primary determines nominee. This is the single most important pre-election event. Watch for whether Kemp, Collins, or a lesser-known candidate emerges. Field shape resets the entire model.",
      status:      "pending",
      notes:       "",
      emphasis:    true
    },
    {
      date:        "2026-07-15",
      title:       "Q2 2026 FEC Filing",
      description: "First full quarter of the general election. Post-primary fundraising signals whether losing R primary candidates consolidated around the nominee and who has momentum heading into summer.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-09-01",
      title:       "Labor Day — Traditional Campaign Start",
      description: "When low-information voters begin paying attention. Where each candidate stands in the polls by Labor Day is the single strongest predictor of the final outcome.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-09-15",
      title:       "Q3 2026 FEC Filing",
      description: "Critical filing. Cash advantage at this point is highly predictive of final-stretch ad buys. A 2:1 cash advantage for either candidate here is a significant signal.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-10",
      title:       "October Debate(s)",
      description: "High-stakes. Senate debates in Georgia have historically moved polls 3–5 points (see 2022 Warnock–Walker debates). Candidate performance matters enormously in a close race.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-10-19",
      title:       "Georgia Early Voting Opens",
      description: "Track daily early-vote return rates vs. 2022 and 2024 county-level benchmarks. Fulton + DeKalb + Gwinnett D overperformance vs. historical = positive Ossoff signal.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-11-03",
      title:       "Election Day",
      description: "Georgia results come in quickly. Watch Atlanta metro vs. rural split. Ossoff needs Fulton, DeKalb, and Gwinnett at or above his 2021 performance levels to win outright.",
      status:      "pending",
      notes:       "",
      emphasis:    true
    }
  ],

  // ---------------------------------------------------------------------------
  // PROBABILITY TRACKER
  // ---------------------------------------------------------------------------
  probabilityTracker: {
    description:
      "Reverse-chronological log of the Democratic win probability estimate. Each entry " +
      "is a snapshot of the analytical call at that date, updated as new information arrives.",
    demLabel: "Ossoff (D) win probability",
    entries: [
      {
        date:        "2026-05",
        probability: 42,
        reason:
          "Initial estimate. Republican nominee undeclared. Georgia R+3 + midterm D headwind drives " +
          "baseline below 50. Ossoff's substantial fundraising advantage acknowledged but insufficient " +
          "to overcome structural lean without favorable nominee draw. Rated Toss Up / Lean Republican."
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // ELECTORATE — collapsible district/state profile
  // ---------------------------------------------------------------------------
  electorate: {
    heading:    "Georgia Electorate Profile",
    subheading: "2024 & 2022 certified results · Registered voter composition · Key county dynamics",
    methodNote:
      "Georgia moved from reliably red to a true swing state between 2016 and 2020. " +
      "Atlanta metro growth (Fulton, DeKalb, Gwinnett, Cobb) is the structural driver. " +
      "Rural Republican consolidation has largely offset metro Democratic gains — creating " +
      "a state that is genuinely competitive but still structurally R+3.",
    presidentialResults: {
      title: "2024 Presidential — Georgia",
      segments: [
        { label: "Trump (R)",  value: 50.7, color: "rep"  },
        { label: "Harris (D)", value: 48.5, color: "dem"  },
        { label: "Other",      value: 0.8,  color: "gray" }
      ],
      note: "Trump +2.2. Georgia returned to the Republican column after Biden's 0.2 pt win in 2020."
    },
    priorSenateResults: {
      title: "2022 Senate — Warnock vs. Walker",
      segments: [
        { label: "Warnock (D)", value: 51.4, color: "dem" },
        { label: "Walker (R)",  value: 48.6, color: "rep" }
      ],
      note: "Warnock +2.8. Walker's candidate quality issues estimated at +5–8 pts for Warnock. A generic R likely wins this race."
    },
    voterRegistration: {
      title: "Registered voters — Georgia 2026",
      segments: [
        { label: "Republican",   value: 32, color: "rep"  },
        { label: "Democrat",     value: 33, color: "dem"  },
        { label: "Unaffiliated", value: 35, color: "gray" }
      ],
      note: "Georgia does not have closed primaries. Unaffiliated voters may participate in either party primary."
    },
    demographics: {
      title: "Key county dynamics",
      cards: [
        { label: "Fulton County",    value: "D+40 — Ossoff's base" },
        { label: "Gwinnett County",  value: "D+8 — Critical swing, trending D" },
        { label: "Cobb County",      value: "D+6 — Suburban shift key" },
        { label: "DeKalb County",    value: "D+55 — Deep blue anchor" },
        { label: "Cherokee County",  value: "R+40 — Deep red rural anchor" },
        { label: "State overall",    value: "R+3 PVI (presidential level)" }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // CITATIONS — rendered at bottom of each section
  // ---------------------------------------------------------------------------
  citations: {
    overview:
      "Sources: Georgia Secretary of State certified 2024 results; Cook Political Report race ratings " +
      "(April 2026); FEC fundraising data Q1 2026; historical Georgia Senate results 2020–2022.",
    candidates:
      "Sources: Ballotpedia candidate profiles; candidate campaign announcements; Georgia Secretary of " +
      "State candidate filings; analyst assessments based on historical Georgia electoral dynamics.",
    raceRatings:
      "Sources: Cook Political Report, Sabato's Crystal Ball, Inside Elections, CNalysis (April 2026). " +
      "Ratings reflect analyst judgment and are updated as conditions change.",
    fundraising:
      "Source: Federal Election Commission (FEC) disclosure data. All figures in USD. Republican " +
      "figures unavailable until nominee declares and files. FEC data through Q1 2026.",
    winProbabilityModel:
      "Win probability estimates are analytical judgments derived from partisan lean, national " +
      "environment, fundraising data, and historical comparable races. Not polling-derived. " +
      "Methodology: Georgia PVI (R+3) adjusted for generic ballot, candidate quality, incumbent " +
      "approval, and fundraising. Formula and estimates are the analyst's judgment, not a statistical model.",
    milestones:
      "Sources: Georgia Secretary of State election calendar; FEC filing deadlines; analyst-identified " +
      "key indicators based on Georgia 2020–2022 race dynamics.",
    probabilityTracker:
      "All probability estimates are analytical judgments, not polling. Updated as new information " +
      "becomes available. Represents estimated probability of the Democratic candidate winning.",
    electorate:
      "Sources: Georgia Secretary of State certified results 2020–2024; Georgia voter registration " +
      "data 2026; Ballotpedia county-level election results."
  },

  // ---------------------------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------------------------
  footer: {
    author:             "Bill Jaffee & Claude",
    lastUpdatedDisplay: "May 2026",
    disclaimer:         "All probability estimates are analytical judgments, not polling."
  }

};

// Publish to window so app.js can access it.
window.dashboardData = dashboardData;
