"use client";

import { Arrow, Box, G, Txt, V, VisualStage } from "./VisualStage";

// Day 6 - Cybersecurity.

export function AuthVisual() {
  const captions = [
    "Two different questions guard every system - and mixing them up causes real breaches.",
    "Authentication: WHO are you? The login door checks your identity - password, token, fingerprint.",
    "Authorization: WHAT may you do? A second door checks your permissions for each thing you touch.",
    "A logged-in user is not an authorized user. Alice authenticates fine - but Bob's records must still be off-limits.",
  ];
  return (
    <VisualStage title="Authentication vs. authorization" captions={captions}>
      {(step) => {
        const atDoor1 = step === 1;
        const atDoor2 = step >= 2;
        return (
          <>
            {/* user */}
            <G x={atDoor2 ? 306 : atDoor1 ? 148 : 56} y={104}>
              <circle cx={16} cy={10} r={10} fill={V.cyan} />
              <path d="M 0 44 a 16 14 0 0 1 32 0" fill={V.cyan} />
              <Txt x={16} y={62} anchor="middle" size={11.5} color={V.cyan}>
                alice
              </Txt>
            </G>
            {/* door 1 - authn */}
            <G x={200} y={62}>
              <rect width={14} height={120} rx={6} fill={atDoor1 ? V.mint : V.panelLight} stroke={V.stroke} style={{ transition: "fill .5s" }} />
              <Txt x={7} y={-16} anchor="middle" size={12} color={atDoor1 ? V.mint : V.muted}>
                who are you?
              </Txt>
              <G x={-24} y={132} o={step >= 1 ? 1 : 0}>
                <Txt size={11.5} mono color={atDoor1 || step > 1 ? V.mint : V.muted}>
                  authentication ✓
                </Txt>
              </G>
            </G>
            {/* door 2 - authz */}
            <G x={392} y={62}>
              <rect width={14} height={120} rx={6} fill={atDoor2 ? V.cream : V.panelLight} stroke={V.stroke} style={{ transition: "fill .5s" }} />
              <Txt x={7} y={-16} anchor="middle" size={12} color={atDoor2 ? V.cream : V.muted}>
                what may you do?
              </Txt>
              <G x={-22} y={132} o={step >= 2 ? 1 : 0}>
                <Txt size={11.5} mono color={V.cream}>
                  authorization
                </Txt>
              </G>
            </G>
            {/* resources */}
            <G x={470} y={64} o={step >= 2 ? 1 : 0.4}>
              <Box w={120} h={40} r={10} label="alice's data" fontSize={12} stroke={step >= 3 ? V.mint : V.stroke} labelColor={step >= 3 ? V.mint : V.muted} />
              {step >= 3 && (
                <Txt x={132} y={20} size={13} color={V.mint}>
                  ✓
                </Txt>
              )}
            </G>
            <G x={470} y={140} o={step >= 2 ? 1 : 0.4}>
              <Box w={120} h={40} r={10} label="bob's data" fontSize={12} stroke={step >= 3 ? V.red : V.stroke} labelColor={step >= 3 ? V.red : V.muted} />
              {step >= 3 && (
                <Txt x={132} y={20} size={13} color={V.red}>
                  ✕
                </Txt>
              )}
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function HttpVisual() {
  const captions = [
    "Every click is a conversation: the browser sends a request, the server sends a response.",
    "A request = method + path: GET /products asks to read, POST /login submits data.",
    "The response carries a status code: 200 means OK - here's what you asked for.",
    "401: you're not authenticated. 404: that doesn't exist. 500: the server itself broke. Codes are the log's vocabulary.",
  ];
  return (
    <VisualStage title="HTTP basics" captions={captions}>
      {(step) => (
        <>
          <G x={60} y={70}>
            <Box w={120} h={90} r={12} label="browser" fontSize={13} />
          </G>
          <G x={460} y={70}>
            <Box w={120} h={90} r={12} label="server" fontSize={13} />
          </G>
          {/* request */}
          <Arrow x1={186} y1={96} x2={452} y2={96} color={step >= 1 ? V.cyan : V.faint} />
          <G x={step >= 1 ? 250 : 200} y={72} o={step >= 1 ? 1 : 0}>
            <rect width={150} height={24} rx={12} fill={V.cyan} />
            <Txt x={75} y={12} anchor="middle" size={12} mono bold color="#1f1f1f">
              GET /products
            </Txt>
          </G>
          {/* response */}
          <Arrow x1={452} y1={136} x2={186} y2={136} color={step >= 2 ? V.mint : V.faint} />
          <G x={step >= 2 ? 268 : 380} y={140} o={step >= 2 ? 1 : 0}>
            <rect width={110} height={24} rx={12} fill={V.mint} />
            <Txt x={55} y={12} anchor="middle" size={12} mono bold color="#1f1f1f">
              200 OK
            </Txt>
          </G>
          {/* status code legend */}
          <G x={92} y={196} o={step >= 3 ? 1 : 0}>
            {[
              { code: "200", meaning: "OK", color: V.mint },
              { code: "401", meaning: "not signed in", color: V.cream },
              { code: "404", meaning: "not found", color: V.cyan },
              { code: "500", meaning: "server error", color: V.red },
            ].map((c, i) => (
              <G key={c.code} x={i * 120} y={0}>
                <rect width={44} height={22} rx={11} fill={c.color} />
                <Txt x={22} y={11} anchor="middle" size={11.5} mono bold color="#1f1f1f">
                  {c.code}
                </Txt>
                <Txt x={52} y={11} size={11} color={V.muted}>
                  {c.meaning}
                </Txt>
              </G>
            ))}
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function LogsVisual() {
  const lines = [
    { t: "10:01", ip: "198.51.7.20", req: "GET /products", code: "200", bad: false },
    { t: "10:02", ip: "203.0.113.55", req: "POST /admin/login", code: "401", bad: true },
    { t: "10:02", ip: "203.0.113.55", req: "POST /admin/login", code: "401", bad: true },
    { t: "10:03", ip: "198.51.7.99", req: "GET /cart", code: "200", bad: false },
    { t: "10:03", ip: "203.0.113.55", req: "POST /admin/login", code: "200", bad: true },
  ];
  const captions = [
    "A server log: one line per request. Individually boring - the story is in the pattern.",
    "Group mentally by IP. One address keeps hammering the same login endpoint...",
    "...repeated 401s from a single IP - failed guesses. That shape is a brute-force attempt.",
    "Then the pattern's worst ending: after many 401s, a 200. A guess succeeded - this is now an incident.",
  ];
  return (
    <VisualStage title="Reading logs" captions={captions}>
      {(step) => (
        <>
          <G x={70} y={22}>
            <rect width={500} height={172} rx={12} fill="#1a1a1a" stroke={V.stroke} />
          </G>
          {lines.map((l, i) => {
            const highlight = step >= 1 && l.bad;
            const success = l.code === "200" && l.bad;
            const alarm = step >= 3 && success;
            return (
              <G key={i} x={84} y={40 + i * 30}>
                <rect
                  x={-6}
                  y={-11}
                  width={478}
                  height={26}
                  rx={6}
                  fill={alarm ? "#3d2f2e" : highlight && step >= 2 ? "#332e26" : "transparent"}
                  style={{ transition: "fill .5s" }}
                />
                <Txt mono size={12} color={V.faint}>
                  {l.t}
                </Txt>
                <Txt x={52} mono size={12} color={highlight ? V.cream : V.muted}>
                  {l.ip}
                </Txt>
                <Txt x={168} mono size={12} color={highlight && step >= 2 ? V.cream : V.text}>
                  {l.req}
                </Txt>
                <Txt x={330} mono size={12} bold color={alarm ? V.red : l.code === "401" && step >= 2 ? V.cream : V.mint}>
                  {l.code}
                </Txt>
                {alarm && (
                  <Txt x={372} mono size={12} color={V.red}>
                    ← break-in
                  </Txt>
                )}
              </G>
            );
          })}
          <G x={84} y={210} o={step >= 2 ? 1 : 0}>
            <Txt size={12.5} mono color={step >= 3 ? V.red : V.cream}>
              {step >= 3 ? "many 401s → one 200 from the same IP = successful brute force" : "same IP, same endpoint, repeated failures"}
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function MistakesVisual() {
  const captions = [
    "This login code builds its SQL query by gluing user input straight into the string.",
    "A normal user types ada - the query looks exactly as the developer imagined.",
    "An attacker types ' OR '1'='1 - the input BREAKS OUT of the quotes and becomes part of the query logic.",
    "'1'='1' is always true: the WHERE clause now matches every user. Login bypassed.",
    "The fix: parameterized queries keep input as data, never as code. Input can't rewrite the sentence it's quoted in.",
  ];
  return (
    <VisualStage title="Common security mistakes" captions={captions}>
      {(step) => {
        const attack = step >= 2;
        const fixed = step >= 4;
        return (
          <>
            {/* input box */}
            <G x={80} y={36}>
              <Txt size={11.5} color={V.muted}>
                username input
              </Txt>
              <G y={12}>
                <rect width={190} height={32} rx={8} fill={V.panel} stroke={attack && !fixed ? V.red : V.stroke} strokeWidth={1.5} style={{ transition: "stroke .5s" }} />
                <Txt x={10} y={16} mono size={12.5} color={attack ? V.red : V.text}>
                  {attack ? "' OR '1'='1" : step >= 1 ? "ada" : ""}
                </Txt>
              </G>
            </G>
            {/* query assembly */}
            <G x={80} y={116}>
              <rect
                width={480}
                height={54}
                rx={10}
                fill={attack && !fixed ? "#3d2f2e" : V.panel}
                stroke={attack && !fixed ? V.red : V.stroke}
                style={{ transition: "all .5s" }}
              />
              {!fixed ? (
                <Txt x={14} y={27} mono size={12.5} color={V.text}>
                  <tspan fill={V.muted}>...WHERE name = &apos;</tspan>
                  <tspan fill={attack ? V.red : V.cyan}>{attack ? "' OR '1'='1" : step >= 1 ? "ada" : "____"}</tspan>
                  <tspan fill={V.muted}>&apos;</tspan>
                </Txt>
              ) : (
                <Txt x={14} y={27} mono size={12.5} color={V.text}>
                  <tspan fill={V.muted}>...WHERE name = </tspan>
                  <tspan fill={V.mint}>?</tspan>
                  <tspan fill={V.muted}> &nbsp;+ [input as data]</tspan>
                </Txt>
              )}
            </G>
            {/* consequence */}
            <G x={80} y={196} o={step >= 3 && !fixed ? 1 : 0}>
              <Txt mono size={12.5} color={V.red}>
                &apos;1&apos;=&apos;1&apos; is always true → every row matches → logged in as anyone
              </Txt>
            </G>
            <G x={80} y={196} o={fixed ? 1 : 0}>
              <Txt mono size={12.5} color={V.mint}>
                parameterized: the quote is just a character again ✓
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}
