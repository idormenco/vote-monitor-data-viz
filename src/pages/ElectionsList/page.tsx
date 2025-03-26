import type { ElectionModel } from "@/common/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useElections } from "@/hooks/use-elections";
import { useMemo } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { GeoMercator } from "./world-map";

export default function ElectionsList() {
  const { isLoading, isError, data: elections } = useElections();
  const electionsByCountry = useMemo(() => {
    const electionsByCountry = elections?.reduce(
      (acc: Map<string, ElectionModel[]>, election) => {
        const { country } = election;
        if (!acc.has(country)) {
          acc.set(country, []);
        }
        acc.get(country)!.push(election);
        return acc;
      },
      new Map<string, ElectionModel[]>()
    );

    const result = Array.from(electionsByCountry?.entries() ?? []).map(
      ([countryCode, monitoredElections]) => ({
        countryCode,
        monitoredElections,
      })
    );
    return result;
  }, [elections]);

  if (isLoading) return <>loading</>;
  if (isError) return <>error!</>;

  return (
    <>
      {elections?.length ? (
        <Tabs defaultValue="world-map">
          <TabsList>
            <TabsTrigger value="world-map">Vote Monitor on the map</TabsTrigger>
            <TabsTrigger value="data-table">Data </TabsTrigger>
          </TabsList>
          <TabsContent value="world-map">
            <Card>
              <CardHeader>
                <CardTitle>
                  Elections we had monitored accros the world
                </CardTitle>
                <CardDescription>
                  Deploy your new project in one-click.
                </CardDescription>
              </CardHeader>
              <CardContent className="fit-content">
                <div className="w-full h-[calc(100vh-300px)]">
                  <GeoMercator
                    data={electionsByCountry}
                    xAccessor={(d: {
                      countryCode: string;
                      monitoredElections: ElectionModel[];
                    }) => d.countryCode}
                    yAccessor={(d: {
                      countryCode: string;
                      monitoredElections: ElectionModel[];
                    }) => d.monitoredElections.length}
                    tooltipAccessor={(d: {
                      countryCode: string;
                      monitoredElections: ElectionModel[];
                    }) => `${d.countryCode}:${d.monitoredElections.length}`}
                    name="Elections across the world"
                    showZoomControls={true}
                    allowZoomAndDrag={true}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="data-table">
            <DataTable columns={columns} data={elections ?? []} />
          </TabsContent>
        </Tabs>
      ) : (
        <>no data!</>
      )}
    </>
  );
}
