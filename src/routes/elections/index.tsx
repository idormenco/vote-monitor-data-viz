import ElectionsList from "@/pages/ElectionsList/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/")({
  component: ElectionsList,
});
