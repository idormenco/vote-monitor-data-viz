import type { ElectionModel } from "@/common/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useElections } from "@/queries/use-elections";
import { useMemo } from "react";
import { columns } from "./columns";
import { GeoMercator } from "../../components/MercatorMap";
import { DataTable } from "@/components/ui/data-table";
import { CountryElectionsViewSheet } from "./CountryElectionsSheet";
import React from "react";

export interface CountryElections {
  countryCode: string;
  monitoredElections: ElectionModel[];
}

export default function CountriesCoveredMap() {
  const [countryElectionsData, setCountryElectionsData] =
    React.useState<CountryElections | null>(null);

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
              <CardContent>
                <div className="w-full h-[calc(100vh-300px)]">
                  <GeoMercator
                    data={electionsByCountry}
                    xAccessor={(d: CountryElections) => d.countryCode}
                    yAccessor={(d: CountryElections) =>
                      d.monitoredElections.length
                    }
                    tooltipAccessor={(d: CountryElections) =>
                      `${d.countryCode}:${d.monitoredElections.length}`
                    }
                    onCountryClick={setCountryElectionsData}
                    name="Elections across the world"
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
      <CountryElectionsViewSheet
        open={countryElectionsData !== null}
        onOpenChange={() => setCountryElectionsData(null)}
        countryElections={countryElectionsData}
      />
    </>
  );
}
