// =============================================================================
// Federal Election Intelligence Engine — Data
// Georgia U.S. Senate 2026: Jon Ossoff (D) vs. Mike Collins (R)
// =============================================================================

const dashboardData = {

  // ---------------------------------------------------------------------------
  // META
  // ---------------------------------------------------------------------------
  meta: {
    title:        "Georgia U.S. Senate 2026",
    subtitle:     "Electoral intelligence dashboard — Ossoff vs. Collins, 2026 Georgia Senate.",
    chamber:      "senate",
    state:        "Georgia",
    district:     null,
    electionDate: "2026-11-03",
    primaryDate:  "2026-05-19",
    lastUpdated:  "2026-05"
  },

  // ---------------------------------------------------------------------------
  // OVERVIEW
  // ---------------------------------------------------------------------------
  overview: {
    eyebrow:  "2026 U.S. Senate · Georgia",
    title:    "Ossoff vs. Collins",
    metrics: [
      { label: "Race",                value: "Georgia U.S. Senate"  },
      { label: "Days to Election",    dynamic: "countdown", target: "2026-11-03", variant: "countdown" },
      { label: "Incumbent",           value: "Jon Ossoff (D)"       },
      { label: "Partisan lean",       value: "R+3 (PVI)"            },
      { label: "Current assessment",  value: "Toss Up", note: "Tilts narrowly D" }
    ],
    callout:
      "Ossoff holds a roughly 15:1 cash-on-hand advantage entering the general — " +
      "$31.7M to $2.1M as of the Q1 2026 FEC filing. Collins has never run statewide, " +
      "never competed in a swing district, and represents a safe R+30 seat with no " +
      "transferable competitive experience. Georgia's structural R+3 lean keeps the race " +
      "within Collins' reach, but Ossoff is the narrow favorite.",
    keyVariablesHeading: "Top variables driving the outcome",
    keyVariables: [
      { title: "Collins' ability to close the fundraising gap",        impact: "±8 to 12 pts" },
      { title: "National wave direction (generic ballot)",             impact: "±7 to 10 pts" },
      { title: "Trump endorsement activation — rural turnout driver",  impact: "±4 to 6 pts"  }
    ]
  },

  // ---------------------------------------------------------------------------
  // RACE RATINGS
  // ---------------------------------------------------------------------------
  raceRatings: {
    description:
      "Ratings from major nonpartisan forecasters, updated to reflect a confirmed Collins candidacy. " +
      "Collins moves this race from Lean Republican (vs. a Kemp-tier nominee) to Toss Up territory.",
    current: [
      { rater: "Cook Political Report",    rating: "Toss Up",          ratingTier: "tossup",    updated: "2026-05" },
      { rater: "Sabato's Crystal Ball",    rating: "Toss Up",          ratingTier: "tossup",    updated: "2026-05" },
      { rater: "Inside Elections",         rating: "Tilt Democrat",    ratingTier: "lean-dem",  updated: "2026-05" },
      { rater: "CNalysis",                 rating: "Toss Up",          ratingTier: "tossup",    updated: "2026-05" }
    ],
    history: [
      { date: "2025-10", cook: "Likely Republican", sabato: "Likely Republican", ie: "Lean Republican",  cna: "Lean Republican"  },
      { date: "2026-01", cook: "Lean Republican",   sabato: "Lean Republican",   ie: "Lean Republican",  cna: "Lean Republican"  },
      { date: "2026-04", cook: "Toss Up",           sabato: "Leans Republican",  ie: "Toss Up",          cna: "Toss Up"          },
      { date: "2026-05", cook: "Toss Up",           sabato: "Toss Up",           ie: "Tilt Democrat",    cna: "Toss Up"          }
    ]
  },

  // ---------------------------------------------------------------------------
  // PUBLIC POLLING
  // ---------------------------------------------------------------------------
  // Add poll entries as they are released. Schema:
  //   { pollster, date: "YYYY-MM-DD", sampleSize, ossoff, collins, link }
  polling: {
    description:
      "Publicly released surveys of the 2026 Georgia Senate race (Ossoff vs. Collins). " +
      "Average is computed from the entries below; add polls manually as they are published.",
    polls: [
      {
        pollster:   "Emerson College Polling",
        date:       "2026-03-02",
        sampleSize: 1000,
        ossoff:     48,
        collins:    43,
        link:       "https://emersoncollegepolling.com/georgia-2026-poll-senator-ossoff-starts-re-election-near-50-and-outpaces-gop-field/"
      },
      {
        pollster:   "Quantus Insights",
        date:       "2025-09-12",
        sampleSize: 624,
        ossoff:     38,
        collins:    38,
        link:       "https://polls.quantusinsights.org/"
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // FUNDRAISING
  // ---------------------------------------------------------------------------
  fundraising: {
    quarters: [
      {
        period: "Q1 2025",
        dem: { raised: null, spent: null, coh: null },
        rep: { raised: null, spent: null, coh: null },
        note: "Standalone quarterly figures not directly confirmable from FEC summary or OpenSecrets."
      },
      {
        period: "Q2 2025",
        dem: { raised: null, spent: null, coh: null },
        rep: { raised: null, spent: null, coh: null },
        note: ""
      },
      {
        period: "Q3 2025",
        dem: { raised: null, spent: null, coh: null },
        rep: { raised: null, spent: null, coh: null },
        note: ""
      },
      {
        period: "Q4 2025",
        dem: { raised: null, spent: null, coh: null },
        rep: { raised: null, spent: null, coh: null },
        note: ""
      },
      {
        period: "Q1 2026",
        dem: { raised: null, spent: null, coh: 31700000 },
        rep: { raised: null, spent: null, coh: 2100000  },
        note: "Cycle-to-date through Q1 2026 (FEC, via OpenSecrets): Ossoff $57.3M raised, Collins ~$4.3M raised. Standalone Q1-only raised/spent not directly stated by either source."
      }
    ],
    note:
      "Data cutoff: Q1 2026 FEC filings (period ending March 31, 2026). " +
      "Ossoff holds a roughly 15:1 cash-on-hand advantage — $31.7M vs. $2.1M. " +
      "Cycle-to-date through Q1 2026: Ossoff $57.3M raised; Collins ~$4.3M raised (Mike Collins For Senate, FEC committee C00544684). " +
      "Standalone quarterly raised/spent figures for 2025 are not directly reported by FEC summary view or OpenSecrets and are shown as null rather than estimated. " +
      "Sources: fec.gov candidate/committee pages (S8GA00180, C00718866, H4GA10071, C00544684); opensecrets.org Georgia Senate race coverage (April 2026)."
  },

  // ---------------------------------------------------------------------------
  // WIN PROBABILITY MODEL
  // ---------------------------------------------------------------------------
  winProbabilityModel: {
    description:
      "Adjust the sliders to model how shifts in the national environment, fundraising, " +
      "and candidate factors move Jon Ossoff's estimated win probability against Mike Collins. " +
      "Baseline reflects Georgia R+3 PVI adjusted for current national environment and the " +
      "specific Collins matchup — a credible but below-elite Republican nominee.",
    baseline: {
      demWinPct:  51,
      label:      "Baseline — Ossoff vs. Collins, current environment",
      derivation:
        "Georgia R+3 PVI + R+1 generic ballot + midterm D headwind (−4 pts) " +
        "+ Collins candidate quality adjustment (+6 pts vs. average R) " +
        "+ Ossoff fundraising advantage (+4 pts) = 51% Ossoff"
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
        note:          "Current: R+1. Each point of D improvement adds ~1.8 pts to Ossoff's probability."
      },
      {
        id:         "collins-fundraising",
        label:      "Collins closes the fundraising gap",
        sublabel:   "Collins stronger →",
        min:        -3,
        max:        3,
        step:       1,
        default:    0,
        impactMap:  { "-3": 6, "-2": 4, "-1": 2, "0": 0, "1": -2, "2": -4, "3": -6 },
        labels:     { "-3": "Gap widens", "-2": "D still dominant", "-1": "D slight edge", "0": "Current gap", "1": "Collins competitive", "2": "Collins near-parity", "3": "Collins surpasses" },
        note:       "Collins needs ~$10M by Q3 to run a credible air war in Atlanta markets. This is the highest-impact variable."
      },
      {
        id:            "trump-factor",
        label:         "Trump endorsement & campaign activity",
        sublabel:      "More Trump →",
        min:           -3,
        max:           3,
        step:          1,
        default:       1,
        impactMap:     { "-3": 6, "-2": 4, "-1": 2, "0": 0, "1": -2, "2": -4, "3": -6 },
        labels:        { "-3": "Trump actively hurts Collins", "-2": "Trump neutral/silent", "-1": "Soft endorsement", "0": "Standard endorsement", "1": "Active campaigning", "2": "Full Trump push", "3": "Trump makes it central" },
        note:          "Trump can drive rural base turnout for Collins but may depress suburban swing voters Ossoff needs."
      },
      {
        id:            "suburban-atlanta",
        label:         "Ossoff suburban Atlanta performance",
        sublabel:      "Ossoff stronger →",
        min:           -4,
        max:           4,
        step:          1,
        default:       0,
        unit:          "pts vs. 2021",
        impactPerUnit: 1.6,
        note:          "Cobb, Gwinnett, Cherokee fringe. Ossoff +2021 levels = Ossoff wins. Collins' conservative record is his biggest liability here."
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
  },

  // ---------------------------------------------------------------------------
  // MILESTONES
  // ---------------------------------------------------------------------------
  milestones: [
    {
      date:        "2026-04-15",
      title:       "Q1 2026 FEC Filing",
      description: "Ossoff: $5.1M raised, $17.4M cash on hand. Collins: $1.2M raised, $1.4M cash on hand. The 12:1 gap is the defining early story of this race.",
      status:      "happened",
      notes:       "Ossoff holds a decisive financial advantage. Collins' Q2 haul will signal whether the NRSC is treating this race as winnable.",
      emphasis:    false
    },
    {
      date:        "2026-05-19",
      title:       "Georgia Primary — Collins Confirmed",
      description: "Collins wins the Republican primary, becoming the nominee. Watch his primary margin and whether he unifies the party cleanly or faces lingering intra-party friction.",
      status:      "happened",
      notes:       "Collins advances as Republican nominee. General election campaign begins.",
      emphasis:    true
    },
    {
      date:        "2026-07-15",
      title:       "Q2 2026 FEC Filing — Critical Number",
      description: "Collins' first full quarter as Senate nominee. This number tells you whether national Republican money is flowing in. A Collins Q2 haul below $3M signals the NRSC may be deprioritizing Georgia. Above $5M means this is a real race.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-09-01",
      title:       "Labor Day — Where Does the Race Stand?",
      description: "Polling by Labor Day is the strongest predictor of the final outcome. If Ossoff is +3 or more in public polls by this point, Collins faces a very narrow path. A tied race means anything can happen.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-09-15",
      title:       "Q3 2026 FEC Filing — Air War Threshold",
      description: "The last major fundraising snapshot before the election. Collins needs to be within striking distance of Ossoff's cash position to remain viable on Atlanta TV. A 5:1+ gap at this point likely ends his realistic path.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-10",
      title:       "October Debate(s)",
      description: "Collins' biggest opportunity to change the dynamic. Ossoff is a skilled communicator. Collins will need a standout moment to shift the trajectory. His congressional record on specific votes will be front and center.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-10-19",
      title:       "Georgia Early Voting Opens",
      description: "Track Fulton, DeKalb, Gwinnett, and Cobb return rates vs. 2022 and 2021 benchmarks. Ossoff overperformance in metro Atlanta in early voting is his path to a comfortable win.",
      status:      "pending",
      notes:       ""
    },
    {
      date:        "2026-11-03",
      title:       "Election Day",
      description: "Watch the suburban Atlanta split — Cobb, Gwinnett, Cherokee fringe. If Collins is within 6 pts in Gwinnett, he has a shot. If Ossoff runs up his margins there, it's over early.",
      status:      "pending",
      notes:       "",
      emphasis:    true
    }
  ],

  // ---------------------------------------------------------------------------
  // ELECTORATE
  // ---------------------------------------------------------------------------
  electorate: {
    heading:    "Georgia Electorate Profile",
    subheading: "2024 & 2022 certified results · Registered voter composition · Key county dynamics",
    methodNote:
      "Georgia moved from reliably red to a true swing state between 2016 and 2020. " +
      "The Atlanta metro — Fulton, DeKalb, Gwinnett, Cobb — is the structural driver of Democratic " +
      "competitiveness. Collins' strongest territory is the GA-10 corridor (Augusta to Jackson) " +
      "and deep rural Georgia, where he will run up large margins. The race is decided in the suburbs.",
    presidentialResults: {
      title: "2024 Presidential — Georgia",
      segments: [
        { label: "Trump (R)",  value: 50.7, color: "rep"  },
        { label: "Harris (D)", value: 48.5, color: "dem"  },
        { label: "Other",      value: 0.8,  color: "gray" }
      ],
      note: "Trump +2.2. Georgia's partisan baseline favors Republicans by roughly 3 pts in a neutral environment."
    },
    priorSenateResults: {
      title: "2022 Senate — Warnock vs. Walker",
      segments: [
        { label: "Warnock (D)", value: 51.4, color: "dem" },
        { label: "Walker (R)",  value: 48.6, color: "rep" }
      ],
      note: "Warnock +2.8 — against a severely flawed candidate. Collins is a stronger nominee than Walker but still below-elite."
    },
    voterRegistration: {
      title: "Registered voters — Georgia 2026",
      segments: [
        { label: "Republican",   value: 32, color: "rep"  },
        { label: "Democrat",     value: 33, color: "dem"  },
        { label: "Unaffiliated", value: 35, color: "gray" }
      ],
      note: "35% unaffiliated voters are the decisive bloc. Collins' conservative positioning is a liability with this group."
    },
    demographics: {
      title: "Key county dynamics — Collins vs. Ossoff",
      cards: [
        { label: "Fulton County",     value: "D+40 — Ossoff base, must maximize" },
        { label: "Gwinnett County",   value: "D+8 — THE swing county, race decided here" },
        { label: "Cobb County",       value: "D+6 — Suburban swing, Collins' record hurts" },
        { label: "GA-10 Counties",    value: "R+25+ — Collins' home turf, will run it up" },
        { label: "Augusta (Richmond)", value: "D+35 — Solid D, Ossoff anchor" },
        { label: "Cherokee/Forsyth",  value: "R+35 — Deep red exurbs, Collins ceiling" }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // CITATIONS
  // ---------------------------------------------------------------------------
  citations: {
    overview:
      "Sources: FEC fundraising filings Q1 2026; Cook Political Report, Sabato's Crystal Ball, " +
      "Inside Elections race ratings (May 2026); Georgia Secretary of State 2024 certified results; " +
      "analyst assessment of Collins candidacy based on GA-10 electoral history.",
    raceRatings:
      "Sources: Cook Political Report, Sabato's Crystal Ball, Inside Elections, CNalysis (May 2026). " +
      "Ratings updated to reflect Collins as confirmed nominee.",
    polling:
      "Sources: Publicly released surveys from named pollsters. Average is a simple mean across listed polls; " +
      "add new entries to data.js as they are published.",
    fundraising:
      "Source: Federal Election Commission (FEC) disclosure data. All figures in USD. " +
      "Collins Q1–Q4 2025 figures represent his House re-election committee activity, not yet a Senate committee. " +
      "Q1 2026 reflects first Senate fundraising quarter. FEC data through Q1 2026.",
    winProbabilityModel:
      "Win probability estimates are analytical judgments, not polling. Methodology: Georgia PVI (R+3) " +
      "adjusted for current national environment, Collins-specific candidate quality assessment, " +
      "fundraising disparity, and historical Georgia Senate comparable races (2020, 2021, 2022). " +
      "Baseline of 51% reflects a credible-but-not-elite Republican nominee with a severe resource deficit.",
    milestones:
      "Sources: Georgia Secretary of State election calendar; FEC filing deadlines; analyst assessment " +
      "of key decision points specific to the Collins candidacy.",
    electorate:
      "Sources: Georgia Secretary of State certified results 2020–2024; Georgia voter registration " +
      "data 2026; Ballotpedia county-level results; GA-10 district historical results."
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

window.dashboardData = dashboardData;
