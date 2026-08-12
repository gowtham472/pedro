import type { DomainId } from "./content";

// ---------------------------------------------------------------------------
// Career-path explorer: a branching decision tree per domain. The learner
// makes a sequence of choices (app dev vs web dev, then which framework...),
// and each choice reveals the next set of options until they reach a leaf -
// a concrete role with a validated learning roadmap and resources.
// ---------------------------------------------------------------------------

/** A single technology/tool shown on a choice card or in the tech map. */
export interface TechRef {
  /** Logo id - see components/paths/TechLogo.tsx for the supported set. */
  id: string;
  name: string;
}

export interface LearningResource {
  label: string;
  /** e.g. "Docs", "Course", "Practice", "Video", "Book" */
  kind: string;
  url: string;
  free?: boolean;
}

export interface RoadmapStep {
  title: string;
  detail: string;
}

/** A terminal node: the concrete career destination the path leads to. */
export interface PathOutcome {
  role: string;
  /** One or two sentences: what this person actually does day to day. */
  summary: string;
  /** Why this fits the choices made - shown as validation of the path. */
  whyThisFits: string;
  /** The main technologies this role centers on. */
  coreTech: TechRef[];
  /** Ordered learning roadmap - the "build the path with the user" payload. */
  roadmap: RoadmapStep[];
  resources: LearningResource[];
  /** Rough market signal, kept honest and non-promissory. */
  demandNote?: string;
}

/** One selectable option at a decision point. */
export interface PathChoice {
  id: string;
  label: string;
  /** Short line explaining what this option means, shown on the card. */
  tagline: string;
  /** Optional logo shown on the choice card. */
  tech?: TechRef;
  /** Longer "what is this, really?" explanation revealed on the card. */
  whatIsIt?: string;
  /** Either more choices (another decision point) or a terminal outcome. */
  next?: PathStage;
  outcome?: PathOutcome;
}

/** A decision point: a question plus the options that answer it. */
export interface PathStage {
  /** The question posed to the learner at this step. */
  question: string;
  /** Short helper text under the question. */
  hint?: string;
  choices: PathChoice[];
}

export interface DomainCareerMap {
  domainId: DomainId;
  /** Framing shown before the first decision. */
  intro: string;
  /** Every technology under this domain, for the "these belong here" map. */
  techMap: TechRef[];
  root: PathStage;
}
