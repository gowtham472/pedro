import { Suspense } from "react";
import { PedroShell } from "@/components/pedro";
import { PathExplorer } from "./PathExplorer";

export default function PathsPage() {
  return (
    <Suspense
      fallback={
        <PedroShell>
          <div className="h-96 animate-pulse rounded-pd-lg bg-surface" />
        </PedroShell>
      }
    >
      <PathExplorer />
    </Suspense>
  );
}
