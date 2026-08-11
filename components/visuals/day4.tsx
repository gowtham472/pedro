"use client";

import { G, Txt, V, VisualStage } from "./VisualStage";

// Day 4 - Data & Analytics. Rows are the actors; queries reshape them.

const ROWS = [
  { city: "Rivertown", value: 42, rating: 4.6 },
  { city: "Lakeside", value: 28, rating: 3.8 },
  { city: "Rivertown", value: 35, rating: 4.2 },
  { city: "Hillcrest", value: 19, rating: 4.9 },
];

function RowRect({ w = 250, highlightCols }: { w?: number; highlightCols?: boolean }) {
  return (
    <>
      <rect width={w} height={26} rx={6} fill={V.panel} stroke={V.stroke} />
      {highlightCols && <rect x={4} y={3} width={102} height={20} rx={5} fill="#33402e" style={{ transition: "opacity .5s" }} />}
    </>
  );
}

export function SelectVisual() {
  const captions = [
    "A table is rows of records with named columns - here: city, order_value, rating.",
    "SELECT city, order_value picks columns. The query names what you want, not how to get it.",
    "Only the selected columns come back, for every row - that's your result set.",
    "SELECT is the verb of SQL: every query starts by choosing what to look at.",
  ];
  return (
    <VisualStage title="Tables and SELECT" captions={captions}>
      {(step) => (
        <>
          <Txt x={70} y={26} mono size={12} color={V.muted}>
            orders
          </Txt>
          <G x={70} y={38}>
            <Txt x={6} y={10} size={11} mono color={V.cyan}>
              city
            </Txt>
            <Txt x={112} y={10} size={11} mono color={V.cyan}>
              order_value
            </Txt>
            <Txt x={206} y={10} size={11} mono color={step >= 1 ? V.faint : V.cyan}>
              rating
            </Txt>
          </G>
          {ROWS.map((r, i) => (
            <G key={i} x={70} y={60 + i * 34}>
              <RowRect highlightCols={step >= 1} />
              <Txt x={10} y={13} size={12} mono color={V.text}>
                {r.city}
              </Txt>
              <Txt x={126} y={13} size={12} mono color={V.text}>
                {r.value}
              </Txt>
              <Txt x={206} y={13} size={12} mono color={step >= 1 ? V.faint : V.muted}>
                {r.rating}
              </Txt>
            </G>
          ))}
          <G x={368} y={30} o={step >= 1 ? 1 : 0}>
            <Txt mono size={13} color={V.cream}>
              SELECT city, order_value
            </Txt>
            <Txt y={18} mono size={13} color={V.cream}>
              FROM orders
            </Txt>
          </G>
          {/* result set */}
          {ROWS.map((r, i) => (
            <G key={i} x={step >= 2 ? 400 : 70} y={step >= 2 ? 92 + i * 32 : 60 + i * 34} o={step >= 2 ? 1 : 0}>
              <rect width={170} height={24} rx={6} fill="#33402e" stroke={V.mint} strokeWidth={1} />
              <Txt x={10} y={12} size={12} mono color={V.text}>
                {r.city}
              </Txt>
              <Txt x={120} y={12} size={12} mono color={V.text}>
                {r.value}
              </Txt>
            </G>
          ))}
          <G x={400} y={78} o={step >= 2 ? 1 : 0}>
            <Txt size={11} color={V.mint}>
              result set
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function WhereVisual() {
  const captions = [
    "All four rows head toward the result - but this query only wants highly-rated orders.",
    "WHERE rating >= 4.5 is a gate. Every row is tested against the condition, one by one.",
    "Rows that fail the test are filtered out - they never reach the result.",
    "Two rows pass. WHERE doesn't change rows; it decides which ones exist for the rest of the query.",
  ];
  return (
    <VisualStage title="Filtering with WHERE" captions={captions}>
      {(step) => (
        <>
          {/* gate */}
          <G x={300} y={40}>
            <rect width={8} height={64} rx={4} fill={step >= 1 ? V.cream : V.stroke} style={{ transition: "fill .5s" }} />
            <rect y={106} width={8} height={64} rx={4} fill={step >= 1 ? V.cream : V.stroke} style={{ transition: "fill .5s" }} />
            <Txt x={4} y={88} anchor="middle" size={11} mono color={step >= 1 ? V.cream : V.muted}>
              WHERE
            </Txt>
          </G>
          <G x={238} y={218} o={step >= 1 ? 1 : 0}>
            <Txt mono size={12.5} color={V.cream}>
              rating &gt;= 4.5
            </Txt>
          </G>
          {ROWS.map((r, i) => {
            const passes = r.rating >= 4.5;
            const gone = step >= 2 && !passes;
            const through = step >= 2 && passes;
            return (
              <G
                key={i}
                x={through ? 380 : step >= 1 ? 120 : 60}
                y={through ? 74 + (r.city === "Rivertown" ? 0 : 44) : 40 + i * 44}
                o={gone ? 0.12 : 1}
              >
                <rect width={190} height={30} rx={7} fill={through ? "#33402e" : V.panel} stroke={through ? V.mint : gone ? V.faint : V.stroke} style={{ transition: "all .5s" }} />
                <Txt x={10} y={15} size={12} mono color={gone ? V.faint : V.text}>
                  {r.city}
                </Txt>
                <Txt x={130} y={15} size={12} mono color={gone ? V.faint : passes && step >= 1 ? V.mint : V.muted}>
                  {r.rating}
                </Txt>
                {gone && (
                  <Txt x={200} y={15} size={13} color={V.red}>
                    ✕
                  </Txt>
                )}
              </G>
            );
          })}
          <G x={380} y={52} o={step >= 2 ? 1 : 0}>
            <Txt size={11} color={V.mint}>
              passed the gate
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function GroupByVisual() {
  const captions = [
    "Four separate orders - but the question is about cities, not orders.",
    "GROUP BY city drops each row into a bucket that shares its city value.",
    "Rivertown gets two rows; the others one each. Buckets, not rows, are now the unit.",
    "An aggregate collapses each bucket to one number: SUM(order_value) → 77, 28, 19.",
    "GROUP BY + aggregate answers \"per-something\" questions: revenue per city, orders per category.",
  ];
  const buckets = [
    { city: "Rivertown", x: 90, sum: 77, members: [0, 2] },
    { city: "Lakeside", x: 280, sum: 28, members: [1] },
    { city: "Hillcrest", x: 470, sum: 19, members: [3] },
  ];
  return (
    <VisualStage title="Aggregation and GROUP BY" captions={captions}>
      {(step) => (
        <>
          {buckets.map((b) => (
            <G key={b.city} x={b.x} y={110} o={step >= 1 ? 1 : 0}>
              <path d={`M 0 0 L 10 76 L 120 76 L 130 0`} fill="none" stroke={V.stroke} strokeWidth={2} />
              <Txt x={65} y={94} anchor="middle" size={12} mono color={V.cyan}>
                {b.city}
              </Txt>
              {/* collapsed sum */}
              <G x={35} y={30} o={step >= 3 ? 1 : 0} scale={step >= 3 ? 1 : 0.5}>
                <rect width={60} height={30} rx={15} fill={V.mint} />
                <Txt x={30} y={15} anchor="middle" size={13} mono bold color="#1f1f1f">
                  {b.sum}
                </Txt>
              </G>
            </G>
          ))}
          {ROWS.map((r, i) => {
            const bucket = buckets.find((b) => b.city === r.city)!;
            const slot = bucket.members.indexOf(i);
            const inBucket = step >= 2;
            const collapsed = step >= 3;
            return (
              <G
                key={i}
                x={inBucket ? bucket.x + 22 + slot * 6 : 90 + i * 130}
                y={inBucket ? 150 - slot * 24 : 34}
                o={collapsed ? 0 : 1}
              >
                <rect width={86} height={22} rx={6} fill={V.panel} stroke={V.stroke} />
                <Txt x={8} y={11} size={10.5} mono color={V.text}>
                  {r.city.slice(0, 5)} · {r.value}
                </Txt>
              </G>
            );
          })}
          <G x={200} y={30} o={step >= 3 ? 1 : 0}>
            <Txt mono size={13} color={V.cream}>
              SELECT city, SUM(order_value) ... GROUP BY city
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function JoinVisual() {
  const captions = [
    "Two tables that know different things: orders knows amounts, cities knows regions.",
    "They share a key - the city name. A JOIN matches rows on that key...",
    "...and each match produces a combined row with columns from both sides.",
    "JOIN answers questions no single table can: \"total orders per region\".",
  ];
  const left = [
    { city: "Rivertown", value: 42 },
    { city: "Lakeside", value: 28 },
  ];
  const right = [
    { city: "Rivertown", region: "North" },
    { city: "Lakeside", region: "South" },
  ];
  return (
    <VisualStage title="Basic JOIN concepts" captions={captions}>
      {(step) => (
        <>
          <Txt x={80} y={24} mono size={12} color={V.muted}>
            orders
          </Txt>
          {left.map((r, i) => (
            <G key={i} x={80} y={40 + i * 40}>
              <rect width={150} height={28} rx={7} fill={V.panel} stroke={V.stroke} />
              <Txt x={10} y={14} size={12} mono color={step >= 1 ? V.cyan : V.text}>
                {r.city}
              </Txt>
              <Txt x={108} y={14} size={12} mono color={V.muted}>
                {r.value}
              </Txt>
            </G>
          ))}
          <Txt x={410} y={24} mono size={12} color={V.muted}>
            cities
          </Txt>
          {right.map((r, i) => (
            <G key={i} x={410} y={40 + i * 40}>
              <rect width={150} height={28} rx={7} fill={V.panel} stroke={V.stroke} />
              <Txt x={10} y={14} size={12} mono color={step >= 1 ? V.cyan : V.text}>
                {r.city}
              </Txt>
              <Txt x={104} y={14} size={12} mono color={V.muted}>
                {r.region}
              </Txt>
            </G>
          ))}
          {/* match lines */}
          {[0, 1].map((i) => (
            <line
              key={i}
              x1={232}
              y1={54 + i * 40}
              x2={408}
              y2={54 + i * 40}
              stroke={V.cyan}
              strokeWidth={2}
              strokeDasharray="6 5"
              opacity={step >= 1 && step < 3 ? 1 : step >= 3 ? 0.25 : 0}
              style={{ transition: "opacity .5s" }}
            />
          ))}
          {/* merged rows */}
          {left.map((r, i) => (
            <G key={i} x={150} y={step >= 2 ? 156 + i * 38 : 100} o={step >= 2 ? 1 : 0}>
              <rect width={330} height={28} rx={7} fill="#33402e" stroke={V.mint} />
              <Txt x={12} y={14} size={12} mono color={V.text}>
                {r.city} · {r.value} · {right[i].region}
              </Txt>
            </G>
          ))}
          <G x={150} y={140} o={step >= 2 ? 1 : 0}>
            <Txt size={11} color={V.mint}>
              joined rows
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function ChartsVisual() {
  const data = [
    { label: "Rivertown", v: 77 },
    { label: "Lakeside", v: 28 },
    { label: "Hillcrest", v: 19 },
  ];
  const captions = [
    "A result set is exact but slow to read - which city leads, and by how much?",
    "The same numbers as bars: each value becomes a height.",
    "Now the answer is instant: Rivertown dominates, and you can see the gap, not just compute it.",
    "Charts don't add information - they move it from your head's math to your eyes.",
  ];
  return (
    <VisualStage title="Charts" captions={captions}>
      {(step) => (
        <>
          {/* table */}
          {data.map((d, i) => (
            <G key={i} x={70} y={44 + i * 34} o={step >= 1 ? 0.45 : 1}>
              <rect width={140} height={26} rx={6} fill={V.panel} stroke={V.stroke} />
              <Txt x={10} y={13} size={12} mono color={V.text}>
                {d.label}
              </Txt>
              <Txt x={104} y={13} size={12} mono color={V.muted}>
                {d.v}
              </Txt>
            </G>
          ))}
          {/* bars */}
          {data.map((d, i) => {
            const h = step >= 1 ? d.v * 1.9 : 0;
            const lead = step >= 2 && i === 0;
            return (
              <G key={i} x={300 + i * 100} y={196 - h}>
                <rect
                  width={64}
                  height={h}
                  rx={8}
                  fill={lead ? V.mint : V.panelLight}
                  stroke={lead ? V.mint : V.stroke}
                  style={{ transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
                <Txt x={32} y={-12} anchor="middle" size={12} mono color={lead ? V.mint : V.muted}>
                  {step >= 1 ? d.v : ""}
                </Txt>
                <Txt x={32} y={h + 14} anchor="middle" size={10.5} color={V.muted}>
                  {d.label}
                </Txt>
              </G>
            );
          })}
          <line x1={290} y1={196} x2={580} y2={196} stroke={V.stroke} strokeWidth={1.5} />
        </>
      )}
    </VisualStage>
  );
}
