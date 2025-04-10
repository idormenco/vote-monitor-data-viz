import { queryClient } from "@/main";
import ElectionData from "@/pages/ElectionData";
import ElectionDataSkeleton from "@/pages/ElectionDataSkeleton";
import { electionByIdQueryOptions } from "@/query-options/elections-query-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/$id")({
  loader: ({ params: { id } }) =>
    queryClient.ensureQueryData(electionByIdQueryOptions(id)),
  component: ElectionData,
  pendingComponent: ElectionDataSkeleton,
});
