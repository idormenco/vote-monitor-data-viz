import type { ElectionModel } from "@/common/types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export function useElections() {
  return useSuspenseQuery({
    queryKey: ["elections"],
    queryFn: async (): Promise<Array<ElectionModel>> => {
      const response = await fetch(`/elections.json`);
      return await response.json();
    },
    refetchOnMount: false,
  });
}

export function useElectionById(electionId: string) {
  return useQuery({
    queryKey: ["elections", electionId],
    queryFn: async (): Promise<Array<ElectionModel>> => {
      const response = await fetch(`/elections-data/${electionId}`);
      return await response.json();
    },
  });
}
