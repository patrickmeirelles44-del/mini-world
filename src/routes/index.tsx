import { createFileRoute } from "@tanstack/react-router";
import { GamerNetwork } from "@/components/GamerNetwork";
import { AuthGate } from "@/components/AuthGate";

export const Route = createFileRoute("/")({ component: Home });
function Home() {
  return <AuthGate><GamerNetwork /></AuthGate>;
}