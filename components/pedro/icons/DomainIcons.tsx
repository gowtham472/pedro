import type { SVGProps } from "react";
import type { DomainId } from "@/types/content";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 22, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Software Development - simplified code brackets. */
export function SoftwareIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 6 3 12l5 6" />
      <path d="M16 6l5 6-5 6" />
    </IconBase>
  );
}

/** Problem Solving / DSA - a small branching decision tree. */
export function ProblemSolvingIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M12 7.2v3.3M12 10.5 7.2 16M12 10.5l4.8 5.5" />
    </IconBase>
  );
}

/** UI/UX Design - a frame with a placed component. */
export function DesignIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="4" width="17" height="16" rx="3" />
      <rect x="7" y="8" width="7" height="4.5" rx="1.4" />
      <path d="M7 15.5h10" />
    </IconBase>
  );
}

/** Data & Analytics - a simple bar chart. */
export function DataIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
      <path d="M4 20h16" />
    </IconBase>
  );
}

/** Cloud & DevOps - a rounded cloud outline. */
export function DevOpsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.2 8.1 4 4 0 0 1 16.5 16H7Z" />
    </IconBase>
  );
}

/** Cybersecurity - a shield. */
export function SecurityIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5 5 6v5.2c0 4.4 3 7.7 7 9.3 4-1.6 7-4.9 7-9.3V6l-7-2.5Z" />
    </IconBase>
  );
}

/** Independent Build - two modular blocks, echoing the brand mark. */
export function BuildIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="3.5" width="8" height="8" rx="2.5" />
      <rect x="12.5" y="12.5" width="8" height="8" rx="2.5" />
      <path d="M11.5 7.5h2M14.5 11.5v2" strokeOpacity={0.6} />
    </IconBase>
  );
}

export const DOMAIN_ICON_MAP: Record<DomainId, (props: IconProps) => React.JSX.Element> = {
  "software-development": SoftwareIcon,
  "problem-solving": ProblemSolvingIcon,
  "ui-ux-design": DesignIcon,
  "data-analytics": DataIcon,
  "cloud-devops": DevOpsIcon,
  cybersecurity: SecurityIcon,
};
