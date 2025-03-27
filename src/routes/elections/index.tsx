import ElectionsList from "@/pages/ElectionsList/Page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/")({
  component: ElectionsList,
});
