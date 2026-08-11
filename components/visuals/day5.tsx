"use client";

import { Arrow, Box, G, Txt, V, VisualStage } from "./VisualStage";

// Day 5 - Cloud & DevOps.

export function LinuxVisual() {
  const captions = [
    "A terminal is a direct conversation with the machine: you type a command, it answers.",
    "ls asks \"what's here?\" - the machine lists the files in the current directory.",
    "cat app.log asks for a file's contents - the machine prints them.",
    "Every command is verb + target. Learn a dozen verbs and you can operate any server.",
  ];
  return (
    <VisualStage title="Linux basics" captions={captions}>
      {(step) => (
        <>
          <G x={90} y={26}>
            <rect width={460} height={200} rx={12} fill="#1a1a1a" stroke={V.stroke} />
            <circle cx={20} cy={16} r={4} fill={V.red} />
            <circle cx={34} cy={16} r={4} fill={V.cream} />
            <circle cx={48} cy={16} r={4} fill={V.mint} />
            <Txt x={18} y={44} mono size={13} color={V.mint}>
              $
            </Txt>
            <G o={step >= 1 ? 1 : 0} x={34} y={44}>
              <Txt mono size={13} color={V.text}>
                ls
              </Txt>
            </G>
            <G o={step >= 1 ? 1 : 0} x={18} y={68}>
              <Txt mono size={13} color={V.muted}>
                app.log &nbsp; config.yml &nbsp; deploy.sh
              </Txt>
            </G>
            <G o={step >= 2 ? 1 : 0} x={18} y={96}>
              <Txt mono size={13} color={V.mint}>
                $ <tspan fill={V.text}>cat app.log</tspan>
              </Txt>
            </G>
            <G o={step >= 2 ? 1 : 0} x={18} y={120}>
              <Txt mono size={12.5} color={V.muted}>
                21:02 INFO server started on :8080
              </Txt>
            </G>
            <G o={step >= 2 ? 1 : 0} x={18} y={140}>
              <Txt mono size={12.5} color={V.muted}>
                21:15 WARN memory climbing
              </Txt>
            </G>
            <G o={step >= 3 ? 1 : 0} x={18} y={172}>
              <Txt mono size={12.5} color={V.cream}>
                verb (ls, cat, kill) + target (file, process)
              </Txt>
            </G>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function ProcessesVisual() {
  const captions = [
    "A process is a running program. A service is a process the system keeps alive on purpose.",
    "The service manager (systemd) watches over services - nginx, postgres, your app.",
    "orderapi crashes. Its status flips to failed - and the log records why.",
    "systemctl restart orderapi asks the manager to bring it back. Green again - and you know where to look next time.",
  ];
  const services = [
    { name: "nginx", x: 90 },
    { name: "postgres", x: 260 },
    { name: "orderapi", x: 430 },
  ];
  return (
    <VisualStage title="Processes and services" captions={captions}>
      {(step) => {
        const crashed = step === 2;
        return (
          <>
            <G x={200} y={28} o={step >= 1 ? 1 : 0}>
              <Box w={240} h={44} r={22} label="systemd - service manager" fontSize={13} stroke={V.cyan} labelColor={V.cyan} />
            </G>
            {services.map((svc) => {
              const isOrder = svc.name === "orderapi";
              const failed = isOrder && crashed;
              return (
                <G key={svc.name} x={svc.x} y={120} scale={failed || (isOrder && step === 3) ? 1.05 : 1}>
                  <Box
                    w={120}
                    h={54}
                    label={svc.name}
                    mono
                    fontSize={13}
                    stroke={failed ? V.red : V.mint}
                    fill={failed ? "#3d2f2e" : "#2e3a29"}
                    labelColor={failed ? V.red : V.mint}
                  />
                  <G x={60} y={70}>
                    <Txt anchor="middle" size={11} mono color={failed ? V.red : V.mint}>
                      {failed ? "● failed" : "● active"}
                    </Txt>
                  </G>
                  {step >= 1 && <Arrow x1={60} y1={-38} x2={60} y2={-8} color={V.faint} o={0.7} />}
                </G>
              );
            })}
            <G x={370} y={216} o={step === 2 ? 1 : 0}>
              <Txt mono size={12} color={V.red}>
                app.log: out of memory, exiting
              </Txt>
            </G>
            <G x={352} y={216} o={step >= 3 ? 1 : 0}>
              <Txt mono size={12} color={V.mint}>
                $ systemctl restart orderapi ✓
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function NetworkingVisual() {
  const captions = [
    "A server has numbered doors called ports. Each listening program claims one.",
    "Requests arrive addressed to a port: web traffic knocks on :80, the database listens on :5432.",
    "Only one program can hold a port. If a stray process already squats on :4000...",
    "...your app can't bind and crashes with EADDRINUSE. Find the squatter (netstat), free the port, restart.",
  ];
  return (
    <VisualStage title="Networking fundamentals" captions={captions}>
      {(step) => (
        <>
          <G x={200} y={26}>
            <Box w={250} h={190} r={16} label={undefined} />
            <Txt x={125} y={-12} anchor="middle" size={12} color={V.muted}>
              server
            </Txt>
          </G>
          {[
            { port: ":80", owner: "nginx", y: 46, ok: true },
            { port: ":5432", owner: "postgres", y: 106, ok: true },
            { port: ":4000", owner: step >= 2 ? "ghost-worker" : "", y: 166, ok: step < 2 },
          ].map((p, i) => (
            <G key={i} x={188} y={p.y}>
              <rect width={24} height={40} rx={6} fill={p.ok || step < 2 ? V.panelLight : "#3d2f2e"} stroke={!p.ok && step >= 2 ? V.red : V.stroke} strokeWidth={1.5} style={{ transition: "all .5s" }} />
              <Txt x={40} y={12} size={12} mono color={V.cyan}>
                {p.port}
              </Txt>
              {p.owner && (
                <Txt x={40} y={30} size={11.5} mono color={!p.ok && step >= 2 ? V.red : V.muted}>
                  {p.owner}
                </Txt>
              )}
            </G>
          ))}
          {/* incoming request */}
          <G x={step >= 1 ? 150 : 60} y={56} o={step >= 1 ? 1 : 0}>
            <circle r={9} fill={V.cyan} />
            <Txt x={-14} y={-16} size={11} mono color={V.cyan} anchor="middle">
              GET
            </Txt>
          </G>
          {/* app trying to bind */}
          <G x={step >= 3 ? 116 : 60} y={176} o={step >= 3 ? 1 : 0}>
            <rect width={64} height={26} rx={13} fill={V.cream} />
            <Txt x={32} y={13} anchor="middle" size={11.5} mono bold color="#1f1f1f">
              orderapi
            </Txt>
            <Txt x={32} y={40} size={11} mono color={V.red} anchor="middle">
              EADDRINUSE ✕
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}

export function DockerVisual() {
  const captions = [
    "\"Works on my machine\" - because your machine has Node 20, that library, that config.",
    "A container packs the app together with everything it needs: runtime, dependencies, config.",
    "The same sealed box runs identically on your laptop, a test server, or the cloud.",
    "Containers turn \"set up a machine\" into \"run this box\" - that's why deploys use them.",
  ];
  return (
    <VisualStage title="Docker & cloud concepts" captions={captions}>
      {(step) => {
        const packed = step >= 1;
        const shipped = step >= 2;
        return (
          <>
            {/* loose pieces -> container */}
            {[
              { label: "app.js", x0: 80, y0: 40 },
              { label: "node 20", x0: 60, y0: 100 },
              { label: "libs", x0: 96, y0: 160 },
              { label: "config", x0: 150, y0: 70 },
            ].map((p, i) => (
              <G key={i} x={packed ? 96 + (i % 2) * 78 : p.x0} y={packed ? 78 + Math.floor(i / 2) * 42 : p.y0}>
                <rect width={70} height={30} rx={8} fill={V.panelLight} stroke={V.stroke} style={{ transition: "all .6s" }} />
                <Txt x={35} y={15} anchor="middle" size={11.5} mono color={V.text}>
                  {p.label}
                </Txt>
              </G>
            ))}
            <G x={80} y={56} o={packed ? 1 : 0}>
              <rect width={188} height={110} rx={14} fill="transparent" stroke={V.cyan} strokeWidth={2} strokeDasharray={packed && !shipped ? "0" : "0"} />
              <Txt x={94} y={-12} anchor="middle" size={12} mono color={V.cyan}>
                container
              </Txt>
            </G>
            {/* destinations */}
            {[
              { label: "laptop", x: 356 },
              { label: "test server", x: 356 },
              { label: "cloud", x: 356 },
            ].map((d, i) => (
              <G key={i} x={380} y={30 + i * 66} o={shipped ? 1 : 0.25}>
                <Box w={170} h={52} r={12} label={d.label} fontSize={12} labelColor={V.muted} />
                <G x={14} y={12} o={shipped ? 1 : 0} scale={shipped ? 0.5 : 0.4}>
                  <rect width={188} height={110} rx={14} fill="#2e3a29" stroke={V.mint} strokeWidth={3} />
                </G>
                {shipped && (
                  <Txt x={148} y={26} size={13} color={V.mint}>
                    ✓
                  </Txt>
                )}
              </G>
            ))}
            <Arrow x1={272} y1={112} x2={370} y2={112} o={shipped ? 1 : 0} color={V.mint} />
          </>
        );
      }}
    </VisualStage>
  );
}

export function CicdVisual() {
  const captions = [
    "CI/CD is an assembly line for code: every change rides the same track to production.",
    "Push a commit → the pipeline builds it and runs every test automatically.",
    "A red test stops the line - broken code never reaches deploy. That's the whole safety model.",
    "Fix the test, push again: build, test, deploy - all green, shipped without a human checklist.",
  ];
  const stages = ["commit", "build", "test", "deploy"];
  return (
    <VisualStage title="CI/CD concepts" captions={captions}>
      {(step) => {
        const failedRun = step === 2;
        const successRun = step === 3;
        const activeUpTo = step === 0 ? -1 : step === 1 ? 2 : 3;
        return (
          <>
            {stages.map((st, i) => {
              const reached = i <= activeUpTo && step >= 1;
              const isFailPoint = failedRun && st === "test";
              const blocked = failedRun && st === "deploy";
              const color = isFailPoint ? V.red : blocked ? V.faint : reached ? V.mint : V.muted;
              return (
                <G key={st} x={70 + i * 140} y={86} scale={isFailPoint ? 1.08 : 1}>
                  <circle cx={30} cy={30} r={30} fill={isFailPoint ? "#3d2f2e" : reached && !blocked ? "#2e3a29" : V.panel} stroke={color} strokeWidth={2} style={{ transition: "all .5s" }} />
                  <Txt x={30} y={30} anchor="middle" size={12} mono color={color}>
                    {st}
                  </Txt>
                  {isFailPoint && (
                    <Txt x={30} y={76} anchor="middle" size={12} color={V.red} mono>
                      1 test failed ✕
                    </Txt>
                  )}
                  {successRun && st === "deploy" && (
                    <Txt x={30} y={76} anchor="middle" size={12} color={V.mint} mono>
                      shipped ✓
                    </Txt>
                  )}
                </G>
              );
            })}
            {stages.slice(0, -1).map((_, i) => (
              <Arrow
                key={i}
                x1={132 + i * 140}
                y1={116}
                x2={168 + i * 140}
                y2={116}
                color={failedRun && i === 2 ? V.red : step >= 1 && i <= activeUpTo - 1 ? V.mint : V.faint}
                dashed={failedRun && i === 2}
              />
            ))}
            <G x={70} y={196} o={step >= 1 ? 1 : 0}>
              <Txt mono size={12.5} color={V.muted}>
                {failedRun ? "pipeline halted - nothing broken ever deploys" : successRun ? "every push takes the same guarded path" : "git push → pipeline starts"}
              </Txt>
            </G>
          </>
        );
      }}
    </VisualStage>
  );
}

export function TroubleshootVisual() {
  const captions = [
    "Something is down. Resist the urge to change things at random - troubleshooting is a loop.",
    "Observe: read the status and the logs. What exactly is failing, and since when?",
    "Hypothesize and test: \"the port is taken\" - check it (netstat). Confirmed or ruled out.",
    "Fix the confirmed cause, verify it's healthy, and note what happened. Round the loop, not around in circles.",
  ];
  const nodes = [
    { label: "observe", angle: -90 },
    { label: "hypothesize", angle: 0 },
    { label: "test", angle: 90 },
    { label: "fix & verify", angle: 180 },
  ];
  return (
    <VisualStage title="Troubleshooting method" captions={captions}>
      {(step) => (
        <>
          <circle cx={320} cy={124} r={78} fill="none" stroke={V.stroke} strokeWidth={1.5} strokeDasharray="4 6" />
          {nodes.map((n, i) => {
            const rad = (n.angle * Math.PI) / 180;
            const x = 320 + 118 * Math.cos(rad);
            const y = 124 + 82 * Math.sin(rad);
            const active = step >= 1 && i === Math.min(step - 1, 3);
            const visited = step >= 1 && i < step - 1;
            return (
              <G key={n.label} x={x - 56} y={y - 20} scale={active ? 1.08 : 1}>
                <Box
                  w={112}
                  h={40}
                  r={20}
                  label={n.label}
                  fontSize={12.5}
                  stroke={active ? V.mint : visited ? V.faint : V.stroke}
                  fill={active ? "#2e3a29" : V.panel}
                  labelColor={active ? V.mint : visited ? V.muted : V.text}
                />
              </G>
            );
          })}
          <G x={276} y={112} o={step >= 1 ? 1 : 0}>
            <Txt size={12} mono color={V.muted}>
              {step <= 1 ? "status: failed" : step === 2 ? "port 4000 in use" : "service restored ✓"}
            </Txt>
          </G>
        </>
      )}
    </VisualStage>
  );
}
