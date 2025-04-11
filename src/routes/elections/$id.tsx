import { queryClient } from "@/main";
import Page from "@/pages/ElectionData/Page";
import PageSkeleton from "@/pages/ElectionData/PageSkeleton";
import { electionByIdQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/$id")({
  loader: async ({ params: { id } }) => {
    const electionData = await queryClient.ensureQueryData(
      electionByIdQueryOptions(id)
    );
    await queryClient.ensureQueryData(
      mapByCodeQueryOptions(electionData.mapCode)
    );
  },
  component: Page,
  pendingComponent: PageSkeleton,
});
