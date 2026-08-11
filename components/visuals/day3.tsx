"use client";

import { Box, G, Txt, V, VisualStage } from "./VisualStage";

// Day 3 - UI/UX Design. The stage itself becomes a tiny screen being designed.

export function SpacingVisual() {
  const captions = [
    "Six elements dropped on a screen with even, meaningless gaps. Nothing reads as related.",
    "One rule does most of the work: related things sit close, unrelated things get space.",
    "The title hugs its subtitle. The two fields pull together. The button stands apart.",
    "Same elements, zero decoration added - grouping alone made it feel designed.",
  ];
  return (
    <VisualStage title="Layout & spacing" captions={captions}>
      {(step) => {
        const grouped = step >= 2;
        const rows: { w: number; h: number; y0: number; y1: number; label: string; accent?: boolean }[] = [
          { w: 200, h: 22, y0: 20, y1: 26, label: "Title" },
          { w: 150, h: 12, y0: 56, y1: 52, label: "" },
          { w: 240, h: 30, y0: 92, y1: 92, label: "Email" },
          { w: 240, h: 30, y0: 128, y1: 128, label: "Password" },
          { w: 120, h: 34, y0: 164, y1: 186, label: "Sign in", accent: true },
        ];
        return (
          <>
            <G x={200} y={4}>
              <rect width={240} height={242} rx={14} fill="#1e1e1e" stroke={V.stroke} />
            </G>
            {rows.map((r, i) => (
              <G key={i} x={200 + (240 - r.w) / 2} y={grouped ? r.y1 : r.y0}>
                <rect
                  width={r.w}
                  height={r.h}
                  rx={r.h / 2 > 12 ? 8 : r.h / 2}
                  fill={r.accent ? V.mint : i < 2 ? V.panelLight : V.panel}
                  stroke={i >= 2 && i <= 3 ? V.stroke : "transparent"}
                  style={{ transition: "all 0.6s ease" }}
                />
                {r.label && (
                  <Txt x={r.accent ? r.w / 2 : 10} y={r.h / 2} size={11} anchor={r.accent ? "middle" : "start"} color={r.accent ? "#1f1f1f" : V.muted}>
                    {r.label}
                  </Txt>
                )}
              </G>
            ))}
            {/* group brackets */}
            <G x={452} y={30} o={step >= 2 ? 1 : 0}>
              <Txt size={12} color={V.cyan}>
                ← heading group
              </Txt>
            </G>
            <G x={452} y={106} o={step >= 2 ? 1 : 0}>
              <Txt size={12} color={V.cyan}>
                ← form group
              </Txt>
            </G>
            <G x={452} y={200} o={step >= 2 ? 1 : 0}>
              <Txt size={12} color={V.cyan}>
                ← action, apart
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function TypographyVisual() {
  const captions = [
    "Every line the same size: your eye has no idea where to start. Nothing is more important than anything else.",
    "A screen needs only 2-3 text sizes. Make the heading big and bold...",
    "...keep body text comfortable, and captions small and quiet.",
    "Bigger + bolder = more important. That single gradient is typographic hierarchy.",
  ];
  return (
    <VisualStage title="Typography" captions={captions}>
      {(step) => {
        const styled = step >= 1;
        const full = step >= 2;
        return (
          <>
            <G x={120} y={50}>
              <Txt size={styled ? 26 : 14} bold={styled} color={V.text}>
                Weekly progress report
              </Txt>
            </G>
            <G x={120} y={styled ? 96 : 84}>
              <Txt size={14} color={full ? V.text : V.text}>
                Your study streak reached twelve days this week.
              </Txt>
            </G>
            <G x={120} y={styled ? 122 : 118}>
              <Txt size={14} color={V.text}>
                Three new topics were completed across two domains.
              </Txt>
            </G>
            <G x={120} y={styled ? 160 : 152}>
              <Txt size={full ? 11 : 14} color={full ? V.muted : V.text}>
                Updated 5 minutes ago · data from your journey
              </Txt>
            </G>
            <G x={460} y={44} o={step >= 3 ? 1 : 0}>
              <Txt size={12} color={V.mint}>
                heading
              </Txt>
            </G>
            <G x={460} y={106} o={step >= 3 ? 1 : 0}>
              <Txt size={12} color={V.mint}>
                body
              </Txt>
            </G>
            <G x={460} y={158} o={step >= 3 ? 1 : 0}>
              <Txt size={12} color={V.mint}>
                caption
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function ColorVisual() {
  const captions = [
    "A structure of neutral grays - perfectly usable, but nothing invites action.",
    "Beginner mistake: color everywhere. When everything shouts, nothing is heard.",
    "The fix: one dominant neutral for structure, one accent - spent only on the action you want taken.",
    "Color used everywhere signals nothing. Color used once is a signpost.",
  ];
  return (
    <VisualStage title="Color" captions={captions}>
      {(step) => {
        const noisy = step === 1;
        const focused = step >= 2;
        const items = [
          { x: 150, y: 30, w: 160, h: 20, noisyColor: V.cyan },
          { x: 150, y: 62, w: 320, h: 14, noisyColor: V.cream },
          { x: 150, y: 86, w: 280, h: 14, noisyColor: V.red },
          { x: 150, y: 122, w: 150, h: 44, noisyColor: V.cream, isCard: true },
          { x: 320, y: 122, w: 150, h: 44, noisyColor: V.cyan, isCard: true },
        ];
        return (
          <>
            {items.map((it, i) => (
              <G key={i} x={it.x} y={it.y}>
                <rect
                  width={it.w}
                  height={it.h}
                  rx={8}
                  fill={noisy ? it.noisyColor : V.panelLight}
                  opacity={noisy ? 0.85 : 1}
                  style={{ transition: "fill 0.6s ease" }}
                />
              </G>
            ))}
            <G x={150} y={190}>
              <rect
                width={130}
                height={36}
                rx={18}
                fill={noisy ? V.red : focused ? V.mint : V.panelLight}
                style={{ transition: "fill 0.6s ease" }}
              />
              <Txt x={65} y={18} anchor="middle" size={13} bold color={focused || noisy ? "#1f1f1f" : V.muted}>
                Continue
              </Txt>
            </G>
            <G x={300} y={208} o={focused ? 1 : 0}>
              <Txt size={12.5} color={V.mint}>
                ← the only color on screen = the only action that matters
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function HierarchyVisual() {
  const captions = [
    "Hierarchy is the order your eye travels a screen. Size, weight, color, and position all steer it.",
    "First stop: the biggest, boldest thing - the heading.",
    "Second: the supporting image or content block below it.",
    "Third: the action button, set apart and accented. 1 → 2 → 3, by design - not by luck.",
  ];
  return (
    <VisualStage title="Hierarchy" captions={captions}>
      {(step) => (
        <>
          <G x={210} y={8}>
            <rect width={220} height={234} rx={14} fill="#1e1e1e" stroke={V.stroke} />
          </G>
          {/* heading */}
          <G x={230} y={28} scale={step === 1 ? 1.03 : 1}>
            <rect width={180} height={26} rx={7} fill={step >= 1 ? V.panelLight : V.panel} stroke={step === 1 ? V.cyan : "transparent"} strokeWidth={2} style={{ transition: "all .5s ease" }} />
          </G>
          {/* image */}
          <G x={230} y={68} scale={step === 2 ? 1.03 : 1}>
            <rect width={180} height={104} rx={10} fill={V.panel} stroke={step === 2 ? V.cyan : V.stroke} strokeWidth={step === 2 ? 2 : 1} style={{ transition: "all .5s ease" }} />
            <path d="M 20 84 l 40 -36 l 30 26 l 24 -18 l 46 36" stroke={V.faint} strokeWidth={3} fill="none" strokeLinecap="round" />
          </G>
          {/* button */}
          <G x={252} y={188} scale={step === 3 ? 1.05 : 1}>
            <rect width={136} height={34} rx={17} fill={step >= 3 ? V.mint : V.panelLight} stroke={step === 3 ? V.cyan : "transparent"} strokeWidth={2} style={{ transition: "all .5s ease" }} />
            <Txt x={68} y={17} anchor="middle" size={12.5} bold color={step >= 3 ? "#1f1f1f" : V.muted}>
              Get started
            </Txt>
          </G>
          {/* numbered eye path */}
          {[
            { n: 1, x: 168, y: 41, on: step >= 1 },
            { n: 2, x: 168, y: 120, on: step >= 2 },
            { n: 3, x: 168, y: 205, on: step >= 3 },
          ].map((p) => (
            <G key={p.n} x={p.x} y={p.y} o={p.on ? 1 : 0} scale={p.on ? 1 : 0.5}>
              <circle r={15} fill={V.cyan} />
              <Txt anchor="middle" bold size={14} color="#1f1f1f">
                {p.n}
              </Txt>
            </G>
          ))}
        </>
      )}
    </VisualStage>
  );
}

export function ComponentsVisual() {
  const captions = [
    "Every button on this screen was styled by hand - four shapes, four sizes, four opinions.",
    "A component is the reusable piece: define the button once...",
    "...and stamp the same component everywhere a button is needed.",
    "Consistency isn't decoration - reusing components is what makes an interface feel coherent.",
  ];
  return (
    <VisualStage title="Components" captions={captions}>
      {(step) => {
        const unified = step >= 2;
        const mess = [
          { x: 110, y: 40, w: 120, h: 34, r: 6 },
          { x: 260, y: 36, w: 90, h: 42, r: 21 },
          { x: 380, y: 44, w: 140, h: 26, r: 2 },
          { x: 150, y: 100, w: 100, h: 30, r: 15 },
        ];
        return (
          <>
            {mess.map((b, i) => (
              <G key={i} x={unified ? 110 + i * 108 : b.x} y={unified ? 176 : b.y} o={step >= 1 && !unified ? 0.45 : 1}>
                <rect
                  width={unified ? 96 : b.w}
                  height={unified ? 34 : b.h}
                  rx={unified ? 17 : b.r}
                  fill={unified ? V.mint : V.panelLight}
                  stroke={V.stroke}
                  style={{ transition: "all 0.7s ease" }}
                />
                <Txt x={(unified ? 96 : b.w) / 2} y={(unified ? 34 : b.h) / 2} anchor="middle" size={12} bold={unified} color={unified ? "#1f1f1f" : V.muted}>
                  Action
                </Txt>
              </G>
            ))}
            {/* the master component */}
            <G x={252} y={86} o={step >= 1 ? 1 : 0} scale={step >= 1 ? 1 : 0.6}>
              <Box w={136} h={54} dashed fill="transparent" stroke={V.cyan} r={14} />
              <G x={20} y={10}>
                <rect width={96} height={34} rx={17} fill={V.mint} />
                <Txt x={48} y={17} anchor="middle" size={12} bold color="#1f1f1f">
                  Action
                </Txt>
              </G>
              <Txt x={68} y={-12} anchor="middle" size={11} color={V.cyan} mono>
                &lt;Button /&gt;
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}
