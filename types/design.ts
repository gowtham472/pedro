// Shapes for the Day 3 / Day 7 design canvas submission. Pedro's canvas is a
// constrained, component-based tool (a palette of typed elements) rather
// than a free-form drawing surface - this keeps automated scoring honest and
// matches the PRD's "simplified design canvas" scope for the MVP.

export type DesignElementKind =
  | "heading"
  | "subtext"
  | "email-field"
  | "password-field"
  | "text-field"
  | "button"
  | "card"
  | "image-placeholder"
  | "progress-dots"
  | "nav-bar"
  | "icon"
  | "divider";

export interface DesignElement {
  id: string;
  kind: DesignElementKind;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  background?: string;
  textColor?: string;
}

export interface DesignScene {
  elements: DesignElement[];
  canvasWidth: number;
  canvasHeight: number;
  iterationCount: number;
}
