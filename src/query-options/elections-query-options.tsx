import type { ElectionDetailsModel, ElectionModel } from "@/common/types";
import { queryOptions } from "@tanstack/react-query";

export const electionsQueryOptions = queryOptions({
  queryKey: ["elections"],
  placeholderData: [],
  queryFn: async (): Promise<ElectionModel[]> => {
    const response = await fetch(`/elections-data/all.json`);
    return await response.json();
  },
});

export const electionByIdQueryOptions = (electionId: string) =>
  queryOptions({
    queryKey: ["elections", electionId],
    queryFn: async (): Promise<ElectionDetailsModel> => {
      const response = await fetch(`/elections-data/${electionId}.json`);
      return await response.json();
    },
  });
