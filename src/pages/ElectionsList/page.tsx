import { useElections } from "@/hooks/use-elections";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import WorldMap from "./world-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ElectionsList() {
  const { data, isLoading, isError } = useElections();
  if (isLoading) return <>loading</>;
  if (isError) return <>error!</>;

  return (
    <Tabs defaultValue="world-map">
      <TabsList>
        <TabsTrigger value="world-map">World map</TabsTrigger>
        <TabsTrigger value="data-table">Data </TabsTrigger>
      </TabsList>
      <TabsContent value="world-map">
        <WorldMap />
      </TabsContent>
      <TabsContent value="data-table">
        <DataTable columns={columns} data={data} />
      </TabsContent>
    </Tabs>
  );
}
