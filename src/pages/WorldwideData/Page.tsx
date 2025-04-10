import type { ElectionModel } from "@/common/types";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { electionsQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { useSuspenseQueries } from "@tanstack/react-query";
import React from "react";
import { columns } from "./columns";
import { CountryElectionsViewSheet } from "./CountryElectionsSheet";
import WorldMap from "./Tabs/WorldMap";

export default function Page() {
  const [{ data: elections }] = useSuspenseQueries({
    queries: [electionsQueryOptions, mapByCodeQueryOptions("world")],
  });

  const [countryElectionsData, setCountryElectionsData] = React.useState<
    ElectionModel[] | null
  >(null);

  return (
    <>
      {elections?.length ? (
        <Tabs defaultValue="world-map">
          <TabsList>
            <TabsTrigger value="world-map">Vote Monitor on the map</TabsTrigger>
            <TabsTrigger value="data-table">Data </TabsTrigger>
          </TabsList>
          <TabsContent value="world-map">
            <WorldMap onCountryClick={setCountryElectionsData} />
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
