import { createFileRoute } from "@tanstack/react-router";
import { GamerNetwork } from "@/components/GamerNetwork";

export const Route = createFileRoute("/")({
  component: GamerHome,
});
function GamerHome() {
  return <GamerNetwork />;
}
