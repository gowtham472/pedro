import { jsPDF } from "jspdf";
import type { CareerReport } from "@/types/entities";

const DOMAIN_NAMES: Record<string, string> = {
  "software-development": "Software Development",
  "problem-solving": "Problem Solving & DSA",
  "ui-ux-design": "UI/UX Design",
  "data-analytics": "Data & Analytics",
  "cloud-devops": "Cloud & DevOps",
  cybersecurity: "Cybersecurity",
};

const MARGIN = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export function generateReportPdf(report: CareerReport, userName: string): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function ensureSpace(needed: number) {
    if (y + needed > 280) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function heading(text: string, size = 16) {
    ensureSpace(size / 2 + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.text(text, MARGIN, y);
    y += size / 2 + 4;
  }

  function body(text: string, size = 10.5) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH) as string[];
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, MARGIN, y);
      y += 5.5;
    }
    y += 2;
  }

  function rule() {
    ensureSpace(6);
    doc.setDrawColor(200);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 6;
  }

  heading("Pedro - Your Exploration Report", 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`${userName} · Generated ${new Date(report.generatedAt).toLocaleDateString()}`, MARGIN, y);
  doc.setTextColor(0);
  y += 10;
  rule();

  heading("Executive summary", 13);
  body(report.narrative.executiveSummary);
  body(report.narrative.workingStyle);

  heading("Your strongest signals", 13);
  report.topDomains.forEach((d, i) => {
    body(`${i + 1}. ${DOMAIN_NAMES[d.domainId] ?? d.domainId} - ${d.score}/100 (${d.confidence} confidence)`);
  });

  rule();
  heading("Why these ranked highly", 13);
  for (const domain of report.topDomains) {
    const narrative = report.narrative.domainNarratives[domain.domainId];
    if (!narrative) continue;
    body(DOMAIN_NAMES[domain.domainId] ?? domain.domainId, 11.5);
    body(narrative, 9.5);
  }

  rule();
  heading("Domain comparison", 13);
  for (const s of report.comparison) {
    body(
      `${DOMAIN_NAMES[s.domainId] ?? s.domainId} - Performance ${s.performanceScore} · Learning ${s.learningScore} · Engagement ${s.engagementScore} · Preference ${s.preferenceScore} · Confidence: ${s.confidence}`,
      9.5
    );
  }

  rule();
  heading("Strength profile", 13);
  for (const s of report.strengthProfile) body(`• ${s}`);

  heading("Growth areas", 13);
  for (const g of report.growthAreas) body(`• ${g}`);

  rule();
  heading("Your next 30 days", 13);
  body(`Primary: ${report.explorationPath.primary}`);
  body(`Secondary: ${report.explorationPath.secondary}`);
  body(`Explore: ${report.explorationPath.explore}`);
  body(`Improve: ${report.explorationPath.improve}`);

  rule();
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120);
  body(
    "This report is an exploration result, not a guaranteed career prediction. You are encouraged to test the domain further before making a career decision."
  );

  doc.save("pedro-exploration-report.pdf");
}
