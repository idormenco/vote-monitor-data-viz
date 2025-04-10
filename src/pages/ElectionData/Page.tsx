import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { electionByIdQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { Route } from "@/routes/elections/$id";
import { useSuspenseQueries } from "@tanstack/react-query";
import ElectionDescription from "./Tabs/ElectionDescription";
import FormSubmissions from "./Tabs/FormSubmissions";
import PollingStationsCoverage from "./Tabs/PollingStationsCoverage";
import ReportedIncidents from "./Tabs/ReportedIncidents";
import { useMemo } from "react";
import type { GIDData } from "@/common/types";

export default function Page() {
  const { id } = Route.useParams();
  const [{ data: electionStatistics }, { data: country }] = useSuspenseQueries({
    queries: [electionByIdQueryOptions(id), mapByCodeQueryOptions(id)],
  });

  const totals = useMemo(() => {
    return electionStatistics.gid0Data
      .filter((g) => g.gid == electionStatistics.gid0Code)
      .reduce(
        (acc, row) => {
          acc.numberOfPollingStations += row.numberOfPollingStations;
          acc.quickReportsSubmitted += row.quickReportsSubmitted;
          acc.formSubmitted += row.formSubmitted;
          acc.psiSubmitted += row.psiSubmitted;
          acc.numberOfQuestionsAnswered += row.numberOfQuestionsAnswered;
          acc.numberOfFlaggedAnswers += row.numberOfFlaggedAnswers;
          acc.observersWithForms += row.observersWithForms;
          acc.observersWithQuickReports += row.observersWithQuickReports;
          acc.observersWithPSI += row.observersWithPSI;
          acc.activeObservers += row.activeObservers;
          acc.visitedPollingStations += row.visitedPollingStations;

          return acc;
        },
        {
          gid: electionStatistics.gid0Code,
          gidName: electionStatistics.gid0Code,
          numberOfPollingStations: 0,
          quickReportsSubmitted: 0,
          formSubmitted: 0,
          psiSubmitted: 0,
          numberOfQuestionsAnswered: 0,
          numberOfFlaggedAnswers: 0,
          observersWithForms: 0,
          observersWithQuickReports: 0,
          observersWithPSI: 0,
          activeObservers: 0,
          visitedPollingStations: 0,
        } as GIDData
      );
  }, [electionStatistics]);

  return (
    <div>
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="ps-covered">Observers in the field</TabsTrigger>
          <TabsTrigger value="forms-submitted">Forms submitted</TabsTrigger>
          <TabsTrigger value="incidents">Reported incidents</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <ElectionDescription election={electionStatistics} />
        </TabsContent>
        <TabsContent value="ps-covered">
          <PollingStationsCoverage
            mapFeatures={country}
            totals={totals}
            gidData={electionStatistics.gid1Data}
          />
        </TabsContent>

        <TabsContent value="forms-submitted">
          <FormSubmissions
            totals={totals}
            gidData={electionStatistics.gid1Data}
          />
        </TabsContent>
        <TabsContent value="incidents">
          <ReportedIncidents
            totals={totals}
            gidData={electionStatistics.gid1Data}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
