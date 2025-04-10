import { queryClient } from "@/main";
import Page from "@/pages/WorldwideData/Page";
import PageSkeleton from "@/pages/WorldwideData/PageSkeleton";
import { electionsQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/")({
  loader: () => [
    queryClient.ensureQueryData(electionsQueryOptions),
    queryClient.ensureQueryData(mapByCodeQueryOptions("world")),
  ],
  component: Page,
  pendingComponent: PageSkeleton,
});
