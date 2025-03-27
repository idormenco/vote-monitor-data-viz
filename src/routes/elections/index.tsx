import CountriesCoveredMap from "@/pages/Elections/CountriesCoveredMap";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/")({
  component: CountriesCoveredMap,
});
