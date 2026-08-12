"use client";

import clsx from "clsx";
import {
  siReact,
  siVuedotjs,
  siSvelte,
  siNextdotjs,
  siNodedotjs,
  siExpress,
  siPython,
  siDjango,
  siFastapi,
  siSpring,
  siGo,
  siFlutter,
  siDart,
  siKotlin,
  siSwift,
  siHtml5,
  siCss,
  siJavascript,
  siTypescript,
  siFigma,
  siSketch,
  siFramer,
  siDocker,
  siKubernetes,
  siTerraform,
  siGithubactions,
  siJenkins,
  siSplunk,
  siWireshark,
  siKalilinux,
  siBurpsuite,
  siOwasp,
  siMetasploit,
  siTryhackme,
  siHackthebox,
  siLeetcode,
  siCodeforces,
  siHackerrank,
  siCplusplus,
  siOpenjdk,
  siPandas,
  siScikitlearn,
  siTensorflow,
  siPytorch,
  siApachespark,
  siApacheairflow,
  siSnowflake,
  siLooker,
  siPostgresql,
  siMysql,
  siGooglecloud,
  siGrafana,
  siPrometheus,
  siAnsible,
  siGit,
  siGithub,
  siExpo,
  siAndroidstudio,
  siXcode,
  siLinux,
  siGnubash,
  siVercel,
} from "simple-icons";

// Real brand logos rendered inline from simple-icons SVG path data (no
// network fetches). A handful of brands (AWS, Azure, Tableau, Power BI,
// Nmap) removed their icons from the set for trademark reasons - those fall
// back to a brand-colored monogram chip.

interface SimpleIcon {
  title: string;
  hex: string;
  path: string;
}

const ICONS: Record<string, SimpleIcon> = {
  react: siReact,
  vue: siVuedotjs,
  svelte: siSvelte,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  express: siExpress,
  python: siPython,
  django: siDjango,
  fastapi: siFastapi,
  spring: siSpring,
  go: siGo,
  flutter: siFlutter,
  dart: siDart,
  kotlin: siKotlin,
  swift: siSwift,
  html5: siHtml5,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  figma: siFigma,
  sketch: siSketch,
  framer: siFramer,
  docker: siDocker,
  kubernetes: siKubernetes,
  terraform: siTerraform,
  githubactions: siGithubactions,
  jenkins: siJenkins,
  splunk: siSplunk,
  wireshark: siWireshark,
  kalilinux: siKalilinux,
  burpsuite: siBurpsuite,
  owasp: siOwasp,
  metasploit: siMetasploit,
  tryhackme: siTryhackme,
  hackthebox: siHackthebox,
  leetcode: siLeetcode,
  codeforces: siCodeforces,
  hackerrank: siHackerrank,
  cplusplus: siCplusplus,
  java: siOpenjdk,
  pandas: siPandas,
  scikitlearn: siScikitlearn,
  tensorflow: siTensorflow,
  pytorch: siPytorch,
  spark: siApachespark,
  airflow: siApacheairflow,
  snowflake: siSnowflake,
  looker: siLooker,
  postgresql: siPostgresql,
  mysql: siMysql,
  googlecloud: siGooglecloud,
  grafana: siGrafana,
  prometheus: siPrometheus,
  ansible: siAnsible,
  git: siGit,
  github: siGithub,
  expo: siExpo,
  androidstudio: siAndroidstudio,
  xcode: siXcode,
  linux: siLinux,
  bash: siGnubash,
  vercel: siVercel,
};

/** Brands without a simple-icons entry: brand-colored monogram chips. */
const MONOGRAMS: Record<string, { label: string; hex: string }> = {
  aws: { label: "AWS", hex: "FF9900" },
  azure: { label: "Az", hex: "0078D4" },
  tableau: { label: "Tb", hex: "E97627" },
  powerbi: { label: "PBI", hex: "F2C811" },
  nmap: { label: "N", hex: "2C5E8A" },
  excel: { label: "XL", hex: "217346" },
  sql: { label: "SQL", hex: "336791" },
};

export function hasTechLogo(id: string): boolean {
  return id in ICONS || id in MONOGRAMS;
}

interface TechLogoProps {
  id: string;
  /** Chip box size in px. The glyph is scaled to ~52% of it. */
  size?: number;
  /** Circular badge (for the trail / inventory) vs rounded square (default). */
  shape?: "square" | "circle";
  className?: string;
}

export function TechLogo({ id, size = 40, shape = "square", className }: TechLogoProps) {
  const icon = ICONS[id];
  const glyph = Math.round(size * 0.52);
  const radius = shape === "circle" ? "rounded-full" : "rounded-[10px]";

  if (icon) {
    return (
      <span
        className={clsx(
          "inline-flex shrink-0 items-center justify-center border border-black/10 bg-white shadow-sm",
          radius,
          className
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" width={glyph} height={glyph} role="img" aria-label={icon.title}>
          <path d={icon.path} fill={`#${icon.hex}`} />
        </svg>
      </span>
    );
  }

  const mono = MONOGRAMS[id];
  if (mono) {
    const fontSize = Math.max(9, Math.round(size * 0.28));
    return (
      <span
        className={clsx("inline-flex shrink-0 items-center justify-center border border-black/10 shadow-sm", radius, className)}
        style={{ width: size, height: size, background: `#${mono.hex}` }}
        aria-hidden
      >
        <span className="font-bold text-white" style={{ fontSize, textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>
          {mono.label}
        </span>
      </span>
    );
  }

  return null;
}
