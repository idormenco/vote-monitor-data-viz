import ElectionData from "@/pages/ElectionData";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/$id")({
  component: ElectionData,
});
