import { createFileRoute } from "@tanstack/react-router";
import { MiniWorld } from "@/components/MiniWorld";

export const Route = createFileRoute("/")({
  // The Mini World is a browser/canvas experience. Do not SSR the route:
  // SSR + hydration was leaving the client-only loading shell on screen.
  ssr: false,
  pendingComponent: MiniWorldPending,
  component: MiniWorldPage,
});

function MiniWorldPending() {
  return <div className="mini-loading">Preparando seu pequeno mundo…</div>;
}

function MiniWorldPage() {
  return <MiniWorld />;
}
