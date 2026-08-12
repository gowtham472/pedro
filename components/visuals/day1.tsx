"use client";

import { Arrow, Box, Chip, G, Txt, V, VisualStage } from "./VisualStage";

// Day 1 - Software Development: programming fundamentals, visualized.

export function SoftwareAnatomyVisual() {
  const captions = [
    "Every app you've ever used is three parts talking: the app on your device, a server, and a database.",
    "You tap \"Place order\". The app sends a request across the internet to the server...",
    "...the server does the thinking - is this promo code valid? is the restaurant open? - and asks the database to remember the order...",
    "...then a response travels back, and the app shows \"Order confirmed\". Software development is building all three parts - and the conversations between them.",
  ];
  return (
    <VisualStage title="What software is made of" captions={captions}>
      {(step) => {
        const requesting = step === 1;
        const serverThinking = step === 2;
        const responding = step >= 3;
        return (
          <>
            {/* phone / client */}
            <G x={60} y={60} scale={requesting || responding ? 1.04 : 1}>
              <rect width={90} height={140} rx={14} fill={V.panel} stroke={responding ? V.mint : requesting ? V.cyan : V.stroke} strokeWidth={2} style={{ transition: "all .5s" }} />
              <rect x={14} y={16} width={62} height={72} rx={6} fill={V.panelLight} />
              <G x={20} y={100} o={1}>
                <rect width={50} height={22} rx={11} fill={responding ? V.mint : V.cream} style={{ transition: "fill .5s" }} />
                <Txt x={25} y={11} anchor="middle" size={9.5} bold color="#1f1f1f">
                  {responding ? "Done ✓" : "Order"}
                </Txt>
              </G>
              <Txt x={45} y={158} anchor="middle" size={12} color={V.muted}>
                the app
              </Txt>
            </G>

            {/* server */}
            <G x={280} y={72} scale={serverThinking ? 1.05 : 1}>
              <Box w={110} h={116} r={12} stroke={serverThinking ? V.cream : V.stroke} />
              {[0, 1, 2].map((i) => (
                <G key={i} x={14} y={16 + i * 32}>
                  <rect width={82} height={22} rx={5} fill={V.panelLight} />
                  <circle cx={12} cy={11} r={4} fill={serverThinking ? V.cream : V.faint} style={{ transition: "fill .5s" }} />
                </G>
              ))}
              <Txt x={55} y={134} anchor="middle" size={12} color={V.muted}>
                the server
              </Txt>
              {serverThinking && (
                <Txt x={55} y={-14} anchor="middle" size={11.5} color={V.cream}>
                  checks the rules
                </Txt>
              )}
            </G>

            {/* database */}
            <G x={490} y={84} scale={serverThinking ? 1.04 : 1}>
              <ellipse cx={45} cy={12} rx={45} ry={12} fill={V.panelLight} stroke={V.stroke} />
              <path d="M 0 12 v 68 a 45 12 0 0 0 90 0 v -68" fill={V.panel} stroke={V.stroke} />
              <ellipse cx={45} cy={80} rx={45} ry={12} fill={V.panel} stroke={V.stroke} />
              <Txt x={45} y={112} anchor="middle" size={12} color={V.muted}>
                the database
              </Txt>
              {serverThinking && (
                <Txt x={45} y={-12} anchor="middle" size={11.5} color={V.mint}>
                  remembers it
                </Txt>
              )}
            </G>

            {/* request/response arrows */}
            <Arrow x1={158} y1={110} x2={272} y2={110} color={requesting ? V.cyan : V.faint} o={step >= 1 ? 1 : 0.3} />
            <G x={168} y={84} o={requesting ? 1 : 0}>
              <Chip label="request" color={V.cyan} w={72} h={24} />
            </G>
            <Arrow x1={398} y1={110} x2={482} y2={110} color={serverThinking ? V.cream : V.faint} o={step >= 2 ? 1 : 0.3} />
            <Arrow x1={272} y1={150} x2={158} y2={150} color={responding ? V.mint : V.faint} o={responding ? 1 : 0.3} />
            <G x={168} y={162} o={responding ? 1 : 0}>
              <Chip label="response" color={V.mint} w={80} h={24} />
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function ProgramVisual() {
  const captions = [
    "A program is a list of instructions. The computer reads them top to bottom, doing exactly what each line says.",
    "Line 1 runs: put 5 in a box called x. Nothing else happens - just that.",
    "Line 2 runs: put x + 2 in a box called y. The computer doesn't guess what you meant - it does what you wrote.",
    "Line 3 runs: show y. The screen prints 7. That's all programming is - precise instructions, in order.",
  ];
  const lines = ["x = 5", "y = x + 2", "show y"];
  return (
    <VisualStage title="A program runs line by line" captions={captions}>
      {(step) => (
        <>
          {/* instruction list */}
          <G x={90} y={40}>
            <Box w={220} h={160} r={12} />
            {lines.map((line, i) => {
              const active = step === i + 1;
              const done = step > i + 1;
              return (
                <G key={i} x={14} y={20 + i * 44}>
                  <rect
                    x={-6}
                    y={-14}
                    width={204}
                    height={36}
                    rx={8}
                    fill={active ? "#2e3a29" : "transparent"}
                    stroke={active ? V.mint : "transparent"}
                    strokeWidth={1.5}
                    style={{ transition: "all .5s ease" }}
                  />
                  <Txt mono size={14} color={active ? V.mint : done ? V.muted : V.text}>
                    {line}
                  </Txt>
                  {done && (
                    <Txt x={182} size={13} color={V.mint}>
                      ✓
                    </Txt>
                  )}
                </G>
              );
            })}
            <Txt x={110} y={-16} anchor="middle" size={12} color={V.muted}>
              your program
            </Txt>
          </G>

          <Arrow x1={318} y1={120} x2={392} y2={120} o={step >= 1 ? 0.9 : 0.3} color={V.muted} />

          {/* memory boxes */}
          <G x={404} y={46} o={step >= 1 ? 1 : 0.25}>
            <Box w={80} h={54} label={step >= 1 ? "5" : ""} mono fontSize={16} labelColor={V.cyan} />
            <Txt x={40} y={-13} anchor="middle" size={12} mono color={V.mint}>
              x
            </Txt>
          </G>
          <G x={500} y={46} o={step >= 2 ? 1 : 0.25}>
            <Box w={80} h={54} label={step >= 2 ? "7" : ""} mono fontSize={16} labelColor={V.cyan} />
            <Txt x={40} y={-13} anchor="middle" size={12} mono color={V.mint}>
              y
            </Txt>
          </G>

          {/* screen output */}
          <G x={404} y={140} o={step >= 3 ? 1 : 0.25}>
            <Box w={176} h={62} r={10} fill="#1a1a1a" />
            <Txt x={14} y={22} mono size={13} color={V.muted}>
              output
            </Txt>
            {step >= 3 && (
              <Txt x={14} y={44} mono size={15} color={V.mint}>
                7
              </Txt>
            )}
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function VariablesVisual() {
  const captions = [
    "A variable is a named box in memory. This one is called total - right now it holds nothing.",
    "const total = 12 - the value 12 is placed into the box. The name points to the value.",
    "Values have types. Numbers, strings, and booleans are the ones you'll touch most.",
    'let name = "Ada" - boxes declared with let can be given a new value later...',
    "...but a const box is locked. Trying to reassign it is an error - that's the point of const.",
  ];
  return (
    <VisualStage title="Variables" captions={captions}>
      {(s) => (
        <>
          {/* main variable box */}
          <G x={70} y={70}>
            <Box w={120} h={72} label={undefined} />
            <Txt x={60} y={-14} anchor="middle" color={V.mint} mono>
              total
            </Txt>
            <G x={37} y={22} o={s >= 1 ? 1 : 0} scale={s >= 1 ? 1 : 0.5}>
              <Chip label="12" color={V.cyan} />
            </G>
            {/* lock on const */}
            <G x={98} y={-6} o={s >= 4 ? 1 : 0} scale={s >= 4 ? 1 : 0.4}>
              <rect x={0} y={4} width={18} height={13} rx={3} fill={V.cream} />
              <path d="M 3 5 v-3 a 6 6 0 0 1 12 0 v3" stroke={V.cream} strokeWidth={2.5} fill="none" />
            </G>
          </G>
          <G x={130} y={175} o={s >= 1 ? 1 : 0}>
            <Txt anchor="middle" mono size={14} color={s >= 4 ? V.cream : V.muted}>
              const total = 12
            </Txt>
          </G>
          {/* reassignment attempt bouncing off */}
          <G x={44} y={106} o={s >= 4 ? 1 : 0}>
            <Chip label="99" color={V.red} w={40} h={24} />
            <Txt x={20} y={38} anchor="middle" size={12} color={V.red}>
              ✕ locked
            </Txt>
          </G>

          {/* type row */}
          <G x={280} y={52} o={s >= 2 ? 1 : 0}>
            <G x={0} y={0}>
              <Box w={90} h={44} label="12" mono labelColor={V.cyan} />
              <Txt x={45} y={58} anchor="middle" size={11} color={V.muted}>
                number
              </Txt>
            </G>
            <G x={104} y={0}>
              <Box w={90} h={44} label={'"Ada"'} mono labelColor={V.cream} />
              <Txt x={45} y={58} anchor="middle" size={11} color={V.muted}>
                string
              </Txt>
            </G>
            <G x={208} y={0}>
              <Box w={90} h={44} label="true" mono labelColor={V.mint} />
              <Txt x={45} y={58} anchor="middle" size={11} color={V.muted}>
                boolean
              </Txt>
            </G>
          </G>

          {/* let box with swap */}
          <G x={330} y={140} o={s >= 3 ? 1 : 0}>
            <Box w={120} h={72} />
            <Txt x={60} y={-14} anchor="middle" color={V.mint} mono>
              name
            </Txt>
            <G x={37} y={22} o={s === 3 ? 1 : 0} scale={s === 3 ? 1 : 0.6}>
              <Chip label='"Ada"' color={V.cream} w={52} />
            </G>
            <G x={31} y={22} o={s >= 4 ? 1 : 0} scale={s >= 4 ? 1 : 0.6}>
              <Chip label='"Grace"' color={V.cream} w={62} />
            </G>
            <Txt x={60} y={92} anchor="middle" size={12} color={V.muted}>
              let can be updated
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function ConditionsVisual() {
  const captions = [
    "A condition asks a yes/no question about a value, then picks exactly one path.",
    "score is 82. Is score >= 70? Yes - the value flows down the true branch and pass() runs.",
    "Now score is 54. The same question gets a different answer...",
    "...so the false branch runs instead. One question, two paths - never both.",
  ];
  return (
    <VisualStage title="Conditions" captions={captions}>
      {(step) => {
        const val = step >= 2 ? 54 : 82;
        const goesTrue = step === 1;
        const goesFalse = step >= 3;
        return (
          <>
            {/* diamond */}
            <G x={320} y={92}>
              <path d="M 0 -38 L 92 0 L 0 38 L -92 0 Z" fill={V.panel} stroke={V.stroke} strokeWidth={1.5} />
              <Txt anchor="middle" mono size={14} color={V.text}>
                score &gt;= 70 ?
              </Txt>
            </G>
            {/* value chip travelling */}
            <G
              x={goesTrue ? 160 : goesFalse ? 452 : 297}
              y={goesTrue ? 176 : goesFalse ? 176 : 18}
              o={step >= 1 ? 1 : 0.9}
            >
              <Chip label={String(val)} color={goesFalse ? V.red : V.cyan} />
            </G>
            <Arrow x1={320} y1={44} x2={320} y2={56} o={0.9} />
            {/* branches */}
            <Arrow x1={252} y1={116} x2={200} y2={160} color={goesTrue ? V.mint : V.faint} />
            <Txt x={210} y={118} size={12} color={goesTrue ? V.mint : V.muted}>
              true
            </Txt>
            <Arrow x1={388} y1={116} x2={440} y2={160} color={goesFalse ? V.red : V.faint} />
            <Txt x={412} y={118} size={12} color={goesFalse ? V.red : V.muted}>
              false
            </Txt>
            <G x={120} y={162} o={1} scale={goesTrue ? 1.06 : 1}>
              <Box w={128} h={40} label="pass()" mono stroke={goesTrue ? V.mint : V.stroke} labelColor={goesTrue ? V.mint : V.muted} />
            </G>
            <G x={392} y={162} o={1} scale={goesFalse ? 1.06 : 1}>
              <Box w={128} h={40} label="retry()" mono stroke={goesFalse ? V.red : V.stroke} labelColor={goesFalse ? V.red : V.muted} />
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function LoopsVisual() {
  const captions = [
    "for (let i = 0; i < 4; i++) - a loop runs the same block once per value of i.",
    "i = 0: the block runs. Then i increases by one.",
    "i = 1, then i = 2, then i = 3 - each pass is one trip around the loop.",
    "When i reaches 4, the check i < 4 fails, and the loop stops. The block ran 4 times.",
    "Most loop bugs are off-by-one: starting or stopping one step early or late. Watch the boundary.",
  ];
  return (
    <VisualStage title="Loops" captions={captions}>
      {(step) => {
        const i = step === 0 ? 0 : step === 1 ? 0 : step === 2 ? 2 : 4;
        const runs = step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 3 : 4;
        return (
          <>
            {/* track of i values */}
            {[0, 1, 2, 3, 4].map((n) => (
              <G key={n} x={100 + n * 92} y={62} scale={i === n ? 1.15 : 1}>
                <circle
                  r={20}
                  fill={n === 4 ? (step >= 3 ? "#3d2f2e" : V.panel) : runs > n ? "#33402e" : V.panel}
                  stroke={i === n ? (n === 4 ? V.red : V.mint) : V.stroke}
                  strokeWidth={2}
                  style={{ transition: "all 0.5s ease" }}
                />
                <Txt anchor="middle" mono color={n === 4 && step >= 3 ? V.red : V.text}>
                  {n}
                </Txt>
              </G>
            ))}
            <Txt x={100} y={24} size={12} color={V.muted}>
              i
            </Txt>
            <Txt x={468} y={104} size={12} color={step >= 3 ? V.red : V.faint} anchor="middle">
              i &lt; 4 fails → stop
            </Txt>
            {/* block */}
            <G x={196} y={140} scale={step === 1 || step === 2 ? 1.04 : 1}>
              <Box
                w={248}
                h={54}
                label="doSomething(i)"
                mono
                stroke={step === 1 || step === 2 ? V.mint : V.stroke}
                labelColor={step === 1 || step === 2 ? V.mint : V.muted}
              />
            </G>
            <G x={490} y={150} o={step >= 1 ? 1 : 0}>
              <Txt size={13} color={V.muted}>
                ran
              </Txt>
              <G x={34} y={0}>
                <Chip label={`${runs}×`} color={V.mint} w={44} h={26} />
              </G>
            </G>
            {/* off-by-one warning */}
            <G x={196} y={214} o={step >= 4 ? 1 : 0}>
              <Txt size={13} mono color={V.cream}>
                i &lt;= 4 would run 5 times - one too many
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function FunctionsVisual() {
  const captions = [
    "A function is a machine: inputs go in, one output comes back. This one is called double.",
    "Call double(7): the 7 goes in as the parameter n...",
    "...the body returns n * 2, so 14 comes out.",
    "The same machine works for any input - that's the point. Write once, reuse everywhere.",
  ];
  return (
    <VisualStage title="Functions" captions={captions}>
      {(step) => {
        const firstIn = step === 1;
        const firstOut = step >= 2;
        const second = step >= 3;
        return (
          <>
            <G x={230} y={72}>
              <Box w={180} h={96} r={16} fill={V.panel} stroke={V.mint} />
              <Txt x={90} y={30} anchor="middle" mono size={15} color={V.mint}>
                double(n)
              </Txt>
              <Txt x={90} y={62} anchor="middle" mono size={13} color={V.muted}>
                return n * 2
              </Txt>
            </G>
            <Arrow x1={150} y1={120} x2={222} y2={120} o={0.8} />
            <Arrow x1={418} y1={120} x2={492} y2={120} o={0.8} />
            <Txt x={110} y={92} size={12} color={V.muted}>
              input
            </Txt>
            <Txt x={500} y={92} size={12} color={V.muted}>
              output
            </Txt>
            {/* first call */}
            <G x={firstOut ? 500 : firstIn ? 290 : 88} y={106} o={step >= 1 ? 1 : 0}>
              <Chip label={firstOut ? "14" : "7"} color={firstOut ? V.mint : V.cyan} />
            </G>
            {/* second call */}
            <G x={second ? 500 : 88} y={second ? 152 : 152} o={second ? 1 : 0}>
              <Chip label={second ? "42" : "21"} color={second ? V.mint : V.cyan} />
            </G>
            <G x={88} y={152} o={step >= 3 ? 0 : 0}>
              <Chip label="21" color={V.cyan} />
            </G>
            <G x={230} y={206} o={step >= 3 ? 1 : 0}>
              <Txt mono size={13} color={V.muted}>
                double(7) → 14 · double(21) → 42
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function ArraysVisual() {
  const values = [88, 92, 74];
  const captions = [
    "An array is an ordered shelf of values. const scores = [88, 92, 74].",
    "Each slot has an index, counted from 0. scores[0] reads the first value - 88.",
    "scores.length tells you how many slots there are: 3.",
    "Loop over the slots to compute something - here, adding each value into a running sum.",
    "88 + 92 + 74 = 254. Loops plus arrays is how most real computation gets done.",
  ];
  return (
    <VisualStage title="Arrays" captions={captions}>
      {(step) => {
        const summed = step === 3 ? 2 : step >= 4 ? 3 : 0;
        const sum = [0, 88, 180, 254][summed];
        return (
          <>
            <Txt x={96} y={38} mono size={14} color={V.mint}>
              scores
            </Txt>
            {values.map((v, idx) => (
              <G key={idx} x={96 + idx * 110} y={58} scale={step === 1 && idx === 0 ? 1.08 : 1}>
                <Box
                  w={96}
                  h={56}
                  label={String(v)}
                  mono
                  fontSize={17}
                  stroke={step === 1 && idx === 0 ? V.cyan : summed > idx ? V.mint : V.stroke}
                  labelColor={summed > idx ? V.mint : V.text}
                />
                <Txt x={48} y={72} anchor="middle" size={12} color={step >= 1 ? V.cyan : V.faint} mono>
                  [{idx}]
                </Txt>
              </G>
            ))}
            <G x={460} y={58} o={step >= 2 ? 1 : 0}>
              <Box w={120} h={56} fill="transparent" dashed label=".length = 3" mono fontSize={13} labelColor={V.cream} />
            </G>
            <G x={96} y={170} o={step >= 3 ? 1 : 0}>
              <Txt mono size={13} color={V.muted}>
                for (const v of scores) sum += v
              </Txt>
            </G>
            <G x={430} y={156} o={step >= 3 ? 1 : 0}>
              <Txt size={12} color={V.muted}>
                sum
              </Txt>
              <G x={0} y={14}>
                <Box w={110} h={40} label={String(sum)} mono fontSize={16} stroke={step >= 4 ? V.mint : V.stroke} labelColor={step >= 4 ? V.mint : V.text} />
              </G>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function DebuggingVisual() {
  const captions = [
    "Something's wrong: the sum comes out as 0. Time to debug - calmly, and in order.",
    "Step 1: read the error or wrong output first. It usually names the line and the problem.",
    "Step 2: check your assumption where things go wrong. console.log(i) reveals the loop never ran.",
    "The condition was i > 0 instead of i < n - the loop body never executed. Fix it...",
    "...and the sum is right. Debugging is a normal loop: read, check, fix. Not a sign you're failing.",
  ];
  return (
    <VisualStage title="Debugging" captions={captions}>
      {(step) => {
        const fixed = step >= 4;
        return (
          <>
            {/* code panel */}
            <G x={70} y={30}>
              <Box w={310} h={150} r={12} />
              <Txt x={16} y={30} mono size={13} color={V.muted}>
                let sum = 0;
              </Txt>
              <G x={0} y={0}>
                <rect
                  x={8}
                  y={48}
                  width={294}
                  height={26}
                  rx={6}
                  fill={step >= 1 && !fixed ? "#3d2f2e" : fixed ? "#33402e" : "transparent"}
                  style={{ transition: "fill 0.5s ease" }}
                />
                <Txt x={16} y={61} mono size={13} color={fixed ? V.mint : step >= 1 ? V.red : V.text}>
                  {fixed ? "for (let i = 0; i < n; i++)" : "for (let i = 0; i > 0; i++)"}
                </Txt>
              </G>
              <Txt x={16} y={92} mono size={13} color={V.muted}>
                {"  sum += scores[i];"}
              </Txt>
              <G x={16} y={116} o={step >= 2 ? 1 : 0}>
                <Txt mono size={13} color={V.cyan}>
                  console.log(i)
                </Txt>
              </G>
            </G>
            {/* console */}
            <G x={420} y={30} o={step >= 1 ? 1 : 0}>
              <Box w={170} h={150} r={12} fill="#1c1c1c" />
              <Txt x={14} y={24} mono size={12} color={V.muted}>
                console
              </Txt>
              <G o={step >= 1 && !fixed ? 1 : 0} x={14} y={48}>
                <Txt mono size={13} color={V.red}>
                  sum is 0 ?!
                </Txt>
              </G>
              <G o={step >= 2 && !fixed ? 1 : 0} x={14} y={76}>
                <Txt mono size={13} color={V.cyan}>
                  (no output - loop
                </Txt>
              </G>
              <G o={step >= 2 && !fixed ? 1 : 0} x={14} y={94}>
                <Txt mono size={13} color={V.cyan}>
                  never ran)
                </Txt>
              </G>
              <G o={fixed ? 1 : 0} x={14} y={48}>
                <Txt mono size={13} color={V.mint}>
                  sum = 254 ✓
                </Txt>
              </G>
            </G>
            {/* arrow from error to line */}
            <Arrow x1={420} y1={70} x2={330} y2={70} color={V.red} o={step >= 1 && !fixed ? 1 : 0} />
            <G x={70} y={206} o={step >= 4 ? 1 : 0}>
              <Txt size={13} color={V.muted}>
                read the message → check assumptions with a log → fix → re-run
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}
