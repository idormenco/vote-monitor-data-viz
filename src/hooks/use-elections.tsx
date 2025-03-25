import type { ElectionModel } from "@/common/types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const useElections = <TResult = Array<ElectionModel>,>(
  select?: (elections: Array<ElectionModel>) => TResult
) => {
  return useSuspenseQuery({
    queryKey: ["elections"],

    queryFn: async () => {
      const response = await fetch(`/elections.json`);
      return await response.json();
    },
    select,
  });
};

export function useElectionById(electionId: string) {
  return useQuery({
    queryKey: ["elections", electionId],
    queryFn: async (): Promise<Array<ElectionModel>> => {
      const response = await fetch(`/elections-data/${electionId}.json`);
      return await response.json();
    },
  });
}
