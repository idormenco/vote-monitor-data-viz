import { queryClient } from "@/main";
import CountriesCoveredMap from "@/pages/Elections/CountriesCoveredMap";
import CountriesCoveredMapSkeleton from "@/pages/Elections/CountriesCoveredMapSkeleton";
import { electionsQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/elections/")({
  loader: () => [
    queryClient.ensureQueryData(electionsQueryOptions),
    queryClient.ensureQueryData(mapByCodeQueryOptions("world")),
  ],
  component: CountriesCoveredMap,
  pendingComponent: CountriesCoveredMapSkeleton,
});
