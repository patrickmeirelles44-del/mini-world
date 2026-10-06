import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MiniWorld } from "@/components/MiniWorld";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="mini-loading">Preparando seu pequeno mundo…</div>;
  return <MiniWorld />;
}
