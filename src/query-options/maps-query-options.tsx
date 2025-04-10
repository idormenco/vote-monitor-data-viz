import type { FeatureCollection } from "@/common/types";
import { queryOptions } from "@tanstack/react-query";

export const mapByCodeQueryOptions = (countryCode: string) =>
  queryOptions({
    queryKey: ["map", countryCode],
    queryFn: async (): Promise<FeatureCollection> => {
      const response = await fetch(`/maps/${countryCode}.json`);
      return await response.json();
    },
  });
