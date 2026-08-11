import type { ScoringWeights } from "@/types/entities";

// Defaults mirror PRD §21: 30% performance, 25% learning velocity,
// 20% engagement, 25% preference. Admin-configurable from there (see
// lib/server/dal/scoring.ts). Deliberately has no Firebase import - this is
// pure data, safe to use from tests or logic that shouldn't need credentials.
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  performance: 0.3,
  learningVelocity: 0.25,
  engagement: 0.2,
  preference: 0.25,
  updatedAt: new Date(0).toISOString(),
};
