import "server-only";

import type { CareerReport, DomainId, DomainScore } from "@/types/entities";
import { getDomainById } from "@/lib/content";

const HIGH = 70;
const LOW = 45;

export type RecommendationTier =
  | "strong-candidate"
  | "perform-not-enjoy"
  | "growth-potential"
  | "weaker-fit"
  | "insufficient-data";

export interface DomainRecommendation {
  domainId: DomainId;
  tier: RecommendationTier;
  explanation: string;
}

/** Rule-based classification per PRD §23 - transparent and auditable, never a black box. */
export function classifyDomain(score: DomainScore): DomainRecommendation {
  const { performanceScore: perf, learningScore: vel, engagementScore: eng, preferenceScore: pref } = score;

  if (score.evidence.tasksCompleted === 0) {
    return {
      domainId: score.domainId,
      tier: "insufficient-data",
      explanation: "Not enough evidence was collected in this domain yet.",
    };
  }

  const highVel = vel >= HIGH;
  const highEng = eng >= HIGH;
  const highPref = pref >= HIGH;
  const highPerf = perf >= HIGH;
  const lowPerf = perf < LOW;
  const lowPref = pref < LOW;
  const lowEng = eng < LOW;
  const adequatePerf = perf >= LOW;

  if (highVel && highEng && highPref && adequatePerf) {
    return {
      domainId: score.domainId,
      tier: "strong-candidate",
      explanation:
        "This domain appears to be a strong fit based on your exploration - you learned quickly, stayed engaged, and reported enjoying the work.",
    };
  }
  if (highPerf && highVel && highPref) {
    // Strong everywhere except sustained engagement (e.g. worked fast) -
    // still a positive result, not "mixed".
    return {
      domainId: score.domainId,
      tier: "strong-candidate",
      explanation:
        "You performed strongly, learned quickly, and reported enjoying this work. Testing it over longer, deeper projects is the natural next step.",
    };
  }
  if (highPerf && lowPref) {
    return {
      domainId: score.domainId,
      tier: "perform-not-enjoy",
      explanation: "You perform well here, but may not enjoy it as much as your other strongest domains.",
    };
  }
  if (lowPerf && highVel && highPref) {
    return {
      domainId: score.domainId,
      tier: "growth-potential",
      explanation:
        "You may have strong growth potential here - performance is still developing, but you're learning fast and enjoying the work.",
    };
  }
  if (lowPerf && lowPref && lowEng) {
    return {
      domainId: score.domainId,
      tier: "weaker-fit",
      explanation: "Currently appears to be a weaker fit compared to your other results.",
    };
  }
  return {
    domainId: score.domainId,
    tier: "growth-potential",
    explanation: "Your signals here are mixed - worth exploring further before drawing a conclusion.",
  };
}

function domainName(domainId: DomainId): string {
  return getDomainById(domainId)?.name ?? domainId;
}

function average(nums: number[]): number {
  return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
}

function deriveStrengthProfile(scores: DomainScore[]): string[] {
  if (scores.length === 0) return [];
  const strengths: string[] = [];
  const avgVel = average(scores.map((s) => s.learningScore));
  const avgEng = average(scores.map((s) => s.engagementScore));
  const avgPerf = average(scores.map((s) => s.performanceScore));
  const avgAttempts = average(scores.map((s) => s.evidence.averageAttempts));

  if (avgVel >= 65) strengths.push("Rapid learning after feedback");
  if (avgEng >= 65) strengths.push("Persistent, engaged problem solving");
  if (avgAttempts >= 1.8) strengths.push("Willingness to retry rather than give up");
  if (avgPerf >= 65) strengths.push("Consistent task performance across domains");

  const topCuriosity = [...scores].sort((a, b) => b.evidence.averageCuriosity - a.evidence.averageCuriosity)[0];
  if (topCuriosity && topCuriosity.evidence.averageCuriosity >= 4) {
    strengths.push(`High curiosity in ${domainName(topCuriosity.domainId)}`);
  }

  return strengths.length ? strengths.slice(0, 5) : ["Completed a full seven-day exploration - a strong signal on its own"];
}

function deriveGrowthAreas(scores: DomainScore[]): string[] {
  if (scores.length === 0) return [];
  const areas: string[] = [];
  const weakestPerf = [...scores].sort((a, b) => a.performanceScore - b.performanceScore)[0];
  if (weakestPerf && weakestPerf.performanceScore < 55) areas.push(`Core fundamentals in ${domainName(weakestPerf.domainId)}`);

  const weakestVel = [...scores].sort((a, b) => a.learningScore - b.learningScore)[0];
  if (weakestVel && weakestVel.learningScore < 55) areas.push(`Iterating from feedback in ${domainName(weakestVel.domainId)}`);

  if (scores.some((s) => s.evidence.averageAttempts < 1.3)) {
    areas.push("Spending more time retrying before moving on from a stuck point");
  }

  return areas.length ? areas.slice(0, 4) : ["No major growth areas stood out - keep exploring to build a fuller picture"];
}

const NEXT_STEPS: Record<DomainId, { topics: string[]; suggestedProject: string }> = {
  "software-development": {
    topics: ["Data structures fundamentals", "Version control (Git)", "Testing basics", "A second language"],
    suggestedProject: "Build a small CLI tool or script that automates something you do repeatedly.",
  },
  "problem-solving": {
    topics: ["Arrays & strings", "Recursion", "Time complexity", "Practice platforms"],
    suggestedProject: "Solve one structured problem set per week, focusing on explaining your approach out loud first.",
  },
  "ui-ux-design": {
    topics: ["Design systems", "Prototyping tools", "Typography", "User research basics"],
    suggestedProject: "Redesign a screen from an app you use daily, and write down why you made each change.",
  },
  "data-analytics": {
    topics: ["SQL joins", "Spreadsheet modeling", "A charting library", "Statistics fundamentals"],
    suggestedProject: "Find a public dataset you're curious about and publish a short written analysis of it.",
  },
  "cloud-devops": {
    topics: ["Linux", "Networking", "Docker", "A cloud provider's free tier", "CI/CD"],
    suggestedProject: "Deploy a simple web application and set up an automated deployment pipeline for it.",
  },
  cybersecurity: {
    topics: ["Web security fundamentals (OWASP Top 10)", "Networking basics", "A beginner-friendly CTF platform"],
    suggestedProject: "Work through a beginner capture-the-flag style challenge set designed for learning.",
  },
};

export function getNextSteps(domainId: DomainId) {
  return NEXT_STEPS[domainId];
}

export function buildCareerReport(
  userId: string,
  domainScores: DomainScore[],
  day7Choice: DomainId | null
): CareerReport {
  const sorted = [...domainScores].sort((a, b) => b.overallScore - a.overallScore);
  const top3 = sorted.slice(0, 3);

  const recommendations = domainScores.map(classifyDomain);
  const domainNarratives: Record<string, string> = {};
  for (const score of sorted) {
    const rec = recommendations.find((r) => r.domainId === score.domainId)!;
    const highlightText = score.evidence.highlights.join("; ");
    const day7Note =
      day7Choice === score.domainId ? " This is also the domain you voluntarily chose to build on Day 7." : "";
    domainNarratives[score.domainId] =
      `${rec.explanation} Evidence: ${highlightText}. Based on ${score.evidence.tasksCompleted}/${score.evidence.tasksTotal} tasks completed.${day7Note}`;
  }

  const primary = top3[0];
  const secondary = top3[1];
  const explore = top3[2];
  const improve = [...sorted].sort((a, b) => a.performanceScore - b.performanceScore)[0];

  const topNames = top3.map((s) => domainName(s.domainId));
  const executiveSummary =
    top3.length > 0
      ? `Your seven-day exploration suggests that ${topNames.slice(0, 2).join(" and ")}${
          topNames.length > 2 ? `, along with ${topNames[2]},` : ""
        } currently fit your working style most strongly.`
      : "Complete more of your seven-day exploration to generate a summary.";

  const avgEngagement = average(domainScores.map((s) => s.engagementScore));
  const avgVelocity = average(domainScores.map((s) => s.learningScore));
  const workingStyle =
    avgEngagement >= 65 && avgVelocity >= 65
      ? "You showed strong persistence across tasks and improved quickly after receiving feedback - a pattern that shows up in hands-on, iterative work."
      : avgVelocity >= 65
        ? "You picked up new concepts quickly once you saw an example, even in domains you hadn't tried before."
        : "Your results were mixed across domains - that's expected in seven days, and worth reading as a starting point rather than a verdict.";

  return {
    userId,
    generatedAt: new Date().toISOString(),
    topDomains: top3.map((s) => ({ domainId: s.domainId, score: s.overallScore, confidence: s.confidence })),
    comparison: sorted,
    strengthProfile: deriveStrengthProfile(domainScores),
    growthAreas: deriveGrowthAreas(domainScores),
    explorationPath: {
      primary: primary ? domainName(primary.domainId) : "Keep exploring",
      secondary: secondary ? domainName(secondary.domainId) : "-",
      explore: explore ? domainName(explore.domainId) : "-",
      improve: improve ? domainName(improve.domainId) : "-",
    },
    narrative: { executiveSummary, workingStyle, domainNarratives },
  };
}
