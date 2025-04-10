import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { electionByIdQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { Route } from "@/routes/elections/$id";
import { useSuspenseQueries } from "@tanstack/react-query";
import ElectionDescription from "./Tabs/ElectionDescription";
import FormSubmissions from "./Tabs/FormSubmissions";
import PollingStationsCoverage from "./Tabs/PollingStationsCoverage";
import ReportedIncidents from "./Tabs/ReportedIncidents";

export default function Page() {
  const { id } = Route.useParams();
  const [{ data: election }, { data: country }] = useSuspenseQueries({
    queries: [electionByIdQueryOptions(id), mapByCodeQueryOptions(id)],
  });

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
          <ElectionDescription election={election} />
        </TabsContent>
        <TabsContent value="ps-covered">
          <PollingStationsCoverage
            mapFeatures={country}
            gid0Data={election.gid0Data}
            gidData={election.gid1Data}
          />
        </TabsContent>

        <TabsContent value="forms-submitted">
          <FormSubmissions
            gid0Data={election.gid0Data}
            gidData={election.gid1Data}
          />
        </TabsContent>
        <TabsContent value="incidents">
          <ReportedIncidents
            gid0Data={election.gid0Data}
            gidData={election.gid1Data}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
