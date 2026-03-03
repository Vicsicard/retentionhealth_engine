// ============================================================================
// PATIENT TEMPLATE GENERATOR - CLIENT-SIDE ONLY
// ============================================================================
// Stateless template generation based on cycle day, nausea, and protein
// No PHI, no tracking, no persistence
// ============================================================================

export interface GeneratedSummary {
  header: string;
  subtext: string;
  normalization: string; // "What you're feeling is normal"
  todayGoal: string; // "What today is about"
  focus: string[];
  nausea_guidance: {
    title: string;
    bullets: string[];
  } | null;
  safety_line: string | null;
  protein_modifier: {
    title: string;
    bullets: string[];
  };
  protein_examples: string[];
  encouragement: string;
  phase: string;
}

// Phase mapping by cycle day
const basePhaseByCycleDay: Record<number, { phase: string; intensity: string }> = {
  0: { phase: "Suppression Init", intensity: "moderate" },
  1: { phase: "Peak Suppression", intensity: "high" },
  2: { phase: "Peak Suppression", intensity: "high" },
  3: { phase: "Adjustment", intensity: "moderate" },
  4: { phase: "Adjustment", intensity: "moderate" },
  5: { phase: "Stabilization", intensity: "controlled" },
  6: { phase: "Stabilization", intensity: "controlled" },
};

export function getPhase(cycleDay: number): string {
  return basePhaseByCycleDay[cycleDay]?.phase || "Adjustment";
}

// Base guidance by cycle day (0-6)
function baseCopy(cycleDay: number) {
  switch (cycleDay) {
    case 0:
      return {
        header: "Day 0 Post-Injection",
        subtext: "Appetite shifts and mild changes are common during early dose escalation.",
        normalization: "Early appetite changes are a normal part of GLP-1 treatment.",
        todayGoal: "Today's goal is gentle stabilization — moderate intake, steady hydration, and protein support.",
        focus: ["Moderate portions", "Prioritize protein first", "Eat slowly and mindfully", "Keep food choices simple"],
      };
    case 1:
      return {
        header: "Day 1 Post-Injection",
        subtext: "Appetite shifts and mild discomfort are common during the early phase of GLP-1 treatment.",
        normalization: "What you're experiencing is a normal part of medication adaptation.",
        todayGoal: "Today's goal is gentle stabilization — small intake, steady hydration, and easy-to-digest protein.",
        focus: ["Smaller, structured meals", "Prioritize protein first", "Keep food choices simple", "Hydrate steadily throughout the day"],
      };
    case 2:
      return {
        header: "Day 2 Post-Injection",
        subtext: "Continued appetite changes are expected during this phase.",
        normalization: "Ongoing appetite fluctuation is normal as your body adjusts.",
        todayGoal: "Today's focus is maintaining consistency — simple meals, protein priority, and steady hydration.",
        focus: ["Maintain smaller portions", "Choose simple protein options", "Keep meals light", "Hydrate consistently"],
      };
    case 3:
      return {
        header: "Day 3 Post-Injection",
        subtext: "Appetite patterns often begin to stabilize during this phase.",
        normalization: "Gradual stabilization is a positive sign of medication adaptation.",
        todayGoal: "Today's goal is maintaining structured intake as appetite begins to normalize.",
        focus: ["Resume structured portions", "Maintain protein priority", "Eat balanced meals", "Stay consistent with hydration"],
      };
    case 4:
      return {
        header: "Day 4 Post-Injection",
        subtext: "Maintaining structure helps reinforce positive eating patterns.",
        normalization: "Consistent intake supports your body's adaptation to the medication.",
        todayGoal: "Today's focus is maintaining balanced, structured meals with protein priority.",
        focus: ["Balanced portions", "Protein first", "Eat regular meals", "Hydrate steadily"],
      };
    case 5:
      return {
        header: "Day 5 Post-Injection",
        subtext: "Structured eating patterns help maintain medication effectiveness.",
        normalization: "Continued structure supports long-term success with GLP-1 treatment.",
        todayGoal: "Today's goal is reinforcing balanced intake and protein-first habits.",
        focus: ["Balanced meals", "Protein priority", "Eat mindfully", "Maintain steady intake"],
      };
    case 6:
    default:
      return {
        header: "Day 6 Post-Injection",
        subtext: "Maintaining structure prepares you for the next treatment cycle.",
        normalization: "Consistent patterns help optimize medication response over time.",
        todayGoal: "Today's focus is maintaining the structured habits you've built this week.",
        focus: ["Maintain structured portions", "Protein first", "Eat balanced meals", "Hydrate consistently"],
      };
  }
}

// Nausea override (0-3)
// Nausea wins - modifies or suppresses base guidance
function applyNauseaOverride(nausea: number, base: { focus: string[] }) {
  if (nausea === 0) {
    return {
      focus: base.focus,
      guidance: null,
      safetyLine: null,
    };
  }

  if (nausea === 1) {
    return {
      focus: base.focus,
      guidance: {
        title: "If Mild Discomfort Occurs",
        bullets: ["Choose lighter protein sources", "Keep portions slightly smaller", "Avoid greasy or heavy foods"],
      },
      safetyLine: null,
    };
  }

  if (nausea === 2) {
    const focus = base.focus.map((f) =>
      f.toLowerCase().includes("balanced") ? "Smaller, more frequent intake" : f
    );
    return {
      focus,
      guidance: {
        title: "If Discomfort Increases",
        bullets: ["Choose soft protein options", "Keep meals light and simple", "Sip fluids steadily", "Separate liquids from solid foods"],
      },
      safetyLine: null,
    };
  }

  // nausea === 3 - Emergency threshold
  return {
    focus: [],
    guidance: {
      title: "If Discomfort Is High",
      bullets: [
        "Choose soft or liquid protein options",
        "Eat very small portions",
        "Avoid heavy or high-fat foods",
        "Sip fluids consistently",
        "Pause larger meals until symptoms settle",
      ],
    },
    safetyLine: "If symptoms are severe, persistent, or worsening, contact your provider for guidance.",
  };
}

// Protein modifier (0-2)
function applyProteinModifier(protein: number) {
  if (protein === 2) {
    return {
      title: "Protein Continuity",
      bullets: ["Continue prioritizing protein at each meal — you're building strong habits."],
    };
  }
  if (protein === 1) {
    return {
      title: "Protein Support",
      bullets: ["Start with protein at your first meal", "Add a simple protein snack mid-day if tolerated"],
    };
  }
  // protein === 0
  return {
    title: "Protein Options That Are Easy to Tolerate",
    bullets: ["Start with protein at your first meal", "Choose easy-to-digest options", "Keep portions small and increase gradually if tolerated"],
  };
}

// Protein examples (hardcoded)
export const proteinExamples = ["Greek yogurt", "Protein shake", "Egg whites", "Cottage cheese", "Soft tofu"];

// Main generator - combines all layers
export function generateSummary(cycleDay: number, nausea: number, protein: number): GeneratedSummary {
  const base = baseCopy(cycleDay);
  const nauseaLayer = applyNauseaOverride(nausea, base);
  const proteinLayer = applyProteinModifier(protein);
  const phase = getPhase(cycleDay);

  return {
    header: base.header,
    subtext: base.subtext,
    normalization: base.normalization,
    todayGoal: base.todayGoal,
    focus: nauseaLayer.focus.length ? nauseaLayer.focus : base.focus,
    nausea_guidance: nauseaLayer.guidance,
    safety_line: nauseaLayer.safetyLine,
    protein_modifier: proteinLayer,
    protein_examples: proteinExamples,
    encouragement: "Small daily adjustments improve medication tolerance and help maintain progress.",
    phase,
  };
}
