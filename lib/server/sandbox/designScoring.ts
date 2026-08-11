import "server-only";

import type { DesignTaskConfig } from "@/types/content";
import type { DesignElement, DesignScene } from "@/types/design";
import type { EvaluationBreakdownItem, EvaluationDetail } from "@/types/entities";

const ALIGNMENT_TOLERANCE_PX = 4;

function kindCount(elements: DesignElement[], kind: DesignElement["kind"]): number {
  return elements.filter((e) => e.kind === kind).length;
}

function hasAlignedLayout(elements: DesignElement[]): boolean {
  if (elements.length < 2) return false;
  let aligned = 0;
  for (const el of elements) {
    const hasPartner = elements.some(
      (other) =>
        other.id !== el.id &&
        (Math.abs(other.x - el.x) <= ALIGNMENT_TOLERANCE_PX || Math.abs(other.y - el.y) <= ALIGNMENT_TOLERANCE_PX)
    );
    if (hasPartner) aligned++;
  }
  return aligned / elements.length >= 0.6;
}

function hasConsistentSpacing(elements: DesignElement[]): boolean {
  if (elements.length < 3) return false;
  const sorted = [...elements].sort((a, b) => a.y - b.y);
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    gaps.push(sorted[i].y - (sorted[i - 1].y + sorted[i - 1].height));
  }
  const positiveGaps = gaps.filter((g) => g > 0);
  if (positiveGaps.length < 2) return false;
  const mean = positiveGaps.reduce((s, g) => s + g, 0) / positiveGaps.length;
  if (mean <= 0) return false;
  const variance = positiveGaps.reduce((s, g) => s + (g - mean) ** 2, 0) / positiveGaps.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;
  return coefficientOfVariation < 0.6;
}

/** Checks a single checklist item against the submitted scene. See the ids
 * used in lib/content/domains/ui-ux-design.ts and independent-build.ts. */
function checklistItemSatisfied(itemId: string, scene: DesignScene, minElements: number): boolean {
  switch (itemId) {
    case "has-heading":
      return kindCount(scene.elements, "heading") >= 1;
    case "has-subtext":
      return kindCount(scene.elements, "subtext") >= 1;
    case "has-email-field":
      return kindCount(scene.elements, "email-field") >= 1;
    case "has-password-field":
      return kindCount(scene.elements, "password-field") >= 1;
    case "has-submit-button":
    case "has-cta":
      return kindCount(scene.elements, "button") >= 1;
    case "has-header":
    case "has-nav":
      return kindCount(scene.elements, "nav-bar") >= 1;
    case "has-two-cards":
      return kindCount(scene.elements, "card") >= 2;
    case "has-illustration":
      return kindCount(scene.elements, "image-placeholder") >= 1;
    case "has-progress":
      return kindCount(scene.elements, "progress-dots") >= 1;
    case "aligned-layout":
      return hasAlignedLayout(scene.elements);
    case "consistent-spacing":
      return hasConsistentSpacing(scene.elements);
    default:
      if (/^uses-[\w-]+-elements$/.test(itemId)) return scene.elements.length >= minElements;
      return false;
  }
}

export function evaluateDesignTask(config: DesignTaskConfig, scene: DesignScene): EvaluationDetail {
  const breakdown: EvaluationBreakdownItem[] = config.checklist.map((item) => ({
    label: item.label,
    passed: checklistItemSatisfied(item.id, scene, config.minElements),
  }));

  breakdown.push({
    label: `Uses at least ${config.minElements} elements`,
    passed: scene.elements.length >= config.minElements,
    detail: `${scene.elements.length} elements placed`,
  });

  const passedCount = breakdown.filter((b) => b.passed).length;
  const passed = passedCount >= Math.ceil(breakdown.length * 0.7);

  return {
    summary: passed
      ? "Solid layout - it covers what this screen needs."
      : `${passedCount}/${breakdown.length} checks passed. This score is advisory: design is subjective, and submitting is what matters for your progress.`,
    passed,
    breakdown,
  };
}
