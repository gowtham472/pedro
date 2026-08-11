import { describe, expect, it } from "vitest";
import { buildCareerReport, classifyDomain } from "./recommendation";
import type { DomainId, DomainScore } from "@/types/entities";

// Fixture values lifted directly from PRD §24's example domain comparison
// table, used as a real-world sanity check on ranking and classification.
function fixture(domainId: DomainId, performance: number, learning: number, engagement: number, preference: number): DomainScore {
  return {
    userId: "u1",
    domainId,
    performanceScore: performance,
    learningScore: learning,
    engagementScore: engagement,
    preferenceScore: preference,
    overallScore: performance * 0.3 + learning * 0.25 + engagement * 0.2 + preference * 0.25,
    confidence: "high",
    evidence: {
      tasksCompleted: 3,
      tasksTotal: 3,
      averageAttempts: 1.5,
      scoreProgression: [performance],
      averageEnjoyment: preference / 20,
      averageCuriosity: preference / 20,
      averageFutureInterest: preference / 20,
      totalActiveSeconds: 1200,
      chosenOnDay7: false,
      highlights: [],
    },
    computedAt: new Date().toISOString(),
  };
}

describe("recommendation engine - PRD §24 example table", () => {
  const scores: DomainScore[] = [
    fixture("software-development", 63, 71, 52, 44),
    fixture("problem-solving", 55, 64, 42, 38),
    fixture("ui-ux-design", 82, 89, 93, 91),
    fixture("data-analytics", 76, 84, 79, 82),
    fixture("cloud-devops", 85, 92, 90, 88),
    fixture("cybersecurity", 71, 77, 82, 76),
  ];

  it("ranks DevOps, Design, and Data as the top three domains", () => {
    const report = buildCareerReport("u1", scores, null);
    const topIds = report.topDomains.map((d) => d.domainId);
    expect(topIds).toEqual(
      expect.arrayContaining(["cloud-devops", "ui-ux-design", "data-analytics"])
    );
    expect(topIds).not.toContain("problem-solving");
  });

  it("orders the full comparison table by overall score descending", () => {
    const report = buildCareerReport("u1", scores, null);
    const ids = report.comparison.map((s) => s.domainId);
    expect(ids[ids.length - 1]).toBe("problem-solving"); // weakest overall
  });

  it("classifies DevOps (high across the board) as a strong candidate", () => {
    const rec = classifyDomain(scores.find((s) => s.domainId === "cloud-devops")!);
    expect(rec.tier).toBe("strong-candidate");
  });

  it("never produces an empty explanation for any tier", () => {
    for (const score of scores) {
      const rec = classifyDomain(score);
      expect(rec.explanation.length).toBeGreaterThan(10);
    }
  });

  it("marks a domain with zero completed tasks as insufficient data regardless of scores", () => {
    const empty = fixture("problem-solving", 0, 0, 0, 0);
    empty.evidence.tasksCompleted = 0;
    const rec = classifyDomain(empty);
    expect(rec.tier).toBe("insufficient-data");
  });

  it("flags high performance + low preference as 'perform but may not enjoy'", () => {
    const score = fixture("cloud-devops", 90, 60, 60, 30);
    const rec = classifyDomain(score);
    expect(rec.tier).toBe("perform-not-enjoy");
  });

  it("never claims certainty - explanations use hedged, non-deterministic language", () => {
    const rec = classifyDomain(scores.find((s) => s.domainId === "cloud-devops")!);
    expect(rec.explanation.toLowerCase()).not.toMatch(/\bdefinitely\b|\bguaranteed\b|\bwill become\b/);
  });
});
