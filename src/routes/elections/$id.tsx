import { queryClient } from "@/main";
import Page from "@/pages/ElectionData/Page";
import PageSkeleton from "@/pages/ElectionData/PageSkeleton";
import { electionByIdQueryOptions } from "@/query-options/elections-query-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/$id")({
  loader: async ({ params: { id } }) => {
    await queryClient.ensureQueryData(electionByIdQueryOptions(id));
  },
  component: Page,
  pendingComponent: PageSkeleton,
});
