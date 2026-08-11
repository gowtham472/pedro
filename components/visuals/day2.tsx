"use client";

import { Arrow, Box, G, Txt, V, VisualStage } from "./VisualStage";

// Day 2 - Problem Solving & DSA.

export function AlgorithmicThinkingVisual() {
  const captions = [
    "An algorithm is just a precise plan: steps so exact that a computer could follow them.",
    "\"Find the largest number\" feels vague until you pin it down...",
    "...as concrete steps: assume the first is largest, compare against each of the rest, keep the winner.",
    "Once the plan is precise, the code is almost a translation. Thinking first beats typing first.",
  ];
  return (
    <VisualStage title="Algorithmic thinking" captions={captions}>
      {(step) => (
        <>
          {/* fuzzy problem cloud */}
          <G x={80} y={70} o={step >= 1 ? 1 : 0.9} scale={step >= 2 ? 0.9 : 1}>
            <ellipse cx={70} cy={40} rx={74} ry={40} fill={V.panel} stroke={V.stroke} strokeDasharray="6 5" strokeWidth={1.5} />
            <Txt x={70} y={32} anchor="middle" size={13} color={V.cream}>
              &quot;find the
            </Txt>
            <Txt x={70} y={50} anchor="middle" size={13} color={V.cream}>
              largest&quot;
            </Txt>
          </G>
          <Arrow x1={232} y1={110} x2={288} y2={110} o={step >= 2 ? 1 : 0} color={V.mint} />
          {/* precise steps */}
          {["1. best = first item", "2. compare best to each item", "3. keep whichever is bigger", "4. return best"].map((t, i) => (
            <G key={i} x={300} y={34 + i * 48} o={step >= 2 ? 1 : 0}>
              <Box w={270} h={38} label={t} mono fontSize={12.5} stroke={step >= 3 ? V.mint : V.stroke} labelColor={step >= 3 ? V.text : V.muted} />
            </G>
          ))}
        </>
      )}
    </VisualStage>
  );
}

export function DecomposeVisual() {
  const captions = [
    "Big problems refuse to be solved all at once. \"Find duplicate values\" - where do you even start?",
    "Split it: (a) count how often each value appears...",
    "...(b) collect the values whose count is above one, (c) sort the result.",
    "Each piece is small enough to solve on its own - and solving all three solves the whole thing.",
  ];
  return (
    <VisualStage title="Breaking a problem into steps" captions={captions}>
      {(step) => {
        const split = step >= 1;
        const parts = [
          { label: "count occurrences", y: 30, on: step >= 1 },
          { label: "keep counts > 1", y: 96, on: step >= 2 },
          { label: "sort the result", y: 162, on: step >= 2 },
        ];
        return (
          <>
            <G x={70} y={split ? 88 : 74} scale={split ? 0.92 : 1}>
              <Box w={200} h={74} r={14} label="find duplicates" fontSize={14} stroke={step >= 3 ? V.mint : V.stroke} />
            </G>
            {parts.map((p, i) => (
              <G key={i} x={360} y={p.y} o={p.on ? 1 : 0}>
                <Box w={210} h={48} label={p.label} fontSize={13} stroke={step >= 3 ? V.mint : V.stroke} labelColor={step >= 3 ? V.mint : V.text} />
                {step >= 3 && (
                  <G x={222} y={24} o={1}>
                    <Txt color={V.mint} size={15}>
                      ✓
                    </Txt>
                  </G>
                )}
              </G>
            ))}
            {parts.map((p, i) => (
              <Arrow key={i} x1={272} y1={125} x2={352} y2={p.y + 24} o={p.on ? 0.8 : 0} color={V.muted} />
            ))}
          </>
        );
      }}
    </VisualStage>
  );
}

export function SearchSortVisual() {
  const bars = [34, 76, 22, 58, 91, 45];
  const sorted = [...bars].sort((a, b) => a - b);
  const captions = [
    "Six values in no particular order. To find one, linear search checks each in turn.",
    "Scanning left to right: is it 58? Check each bar until you hit it - up to n checks.",
    "Sorting rearranges the values into order...",
    "...and order unlocks faster tricks: in a sorted list, binary search jumps to the middle, halving what's left each time.",
  ];
  return (
    <VisualStage title="Arrays, searching, and sorting" captions={captions}>
      {(step) => {
        const arrangement = step >= 2 ? sorted : bars;
        const scanIdx = step === 1 ? 3 : -1;
        const midIdx = step >= 3 ? 2 : -1;
        return (
          <>
            {arrangement.map((v, i) => {
              const isTarget = v === 58;
              const highlight = (step === 1 && i <= scanIdx) || (step >= 3 && i === midIdx);
              return (
                <G key={`${v}`} x={110 + i * 76} y={190 - v * 1.35}>
                  <rect
                    width={52}
                    height={v * 1.35}
                    rx={8}
                    fill={isTarget && step === 1 ? V.mint : highlight ? V.cyan : V.panelLight}
                    stroke={V.stroke}
                    style={{ transition: "fill 0.5s ease" }}
                  />
                  <Txt x={26} y={-12} anchor="middle" size={12} mono color={V.muted}>
                    {v}
                  </Txt>
                </G>
              );
            })}
            <G x={110} y={216} o={step === 1 ? 1 : 0}>
              <Txt size={12.5} color={V.cyan}>
                check → check → check → found 58 (4 checks)
              </Txt>
            </G>
            <G x={110} y={216} o={step >= 3 ? 1 : 0}>
              <Txt size={12.5} color={V.cyan}>
                sorted + binary search: middle first → half the list is gone in one step
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function ComplexityVisual() {
  const captions = [
    "Two ways to solve the same problem can differ wildly in work. Complexity is that intuition.",
    "One loop over n = 8 items: 8 operations. Work grows in step with n.",
    "Nested loops - every pair of items: 28 operations for the same 8 items. Grows like n².",
    "At n = 1000, that's 1,000 vs ~500,000 operations. The shape of your loops matters more than the speed of your computer.",
  ];
  return (
    <VisualStage title="Complexity intuition" captions={captions}>
      {(step) => {
        const singleOps = step >= 1 ? 8 : 0;
        const nestedOps = step >= 2 ? 28 : 0;
        return (
          <>
            <Txt x={100} y={30} size={13} color={V.mint} mono>
              one loop - O(n)
            </Txt>
            {Array.from({ length: 8 }, (_, i) => (
              <G key={i} x={100 + i * 24} y={44} o={i < singleOps ? 1 : 0.12}>
                <rect width={16} height={16} rx={4} fill={V.mint} />
              </G>
            ))}
            <G x={310} y={52} o={step >= 1 ? 1 : 0}>
              <Txt size={13} mono color={V.mint}>
                = 8 ops
              </Txt>
            </G>

            <Txt x={100} y={96} size={13} color={V.red} mono>
              nested loops - O(n²)
            </Txt>
            {Array.from({ length: 28 }, (_, i) => (
              <G key={i} x={100 + (i % 14) * 24} y={110 + Math.floor(i / 14) * 24} o={i < nestedOps ? 1 : 0.12}>
                <rect width={16} height={16} rx={4} fill={V.red} />
              </G>
            ))}
            <G x={454} y={130} o={step >= 2 ? 1 : 0}>
              <Txt size={13} mono color={V.red}>
                = 28 ops
              </Txt>
            </G>

            <G x={100} y={196} o={step >= 3 ? 1 : 0}>
              <Txt size={13} color={V.cream} mono>
                n = 1000 → 1,000 ops vs ~500,000 ops
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}
