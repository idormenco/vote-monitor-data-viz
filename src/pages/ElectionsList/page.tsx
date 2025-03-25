import { useElections } from "@/hooks/use-elections";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function ElectionsList() {
  const { data, isLoading, isError } = useElections();
  if (isLoading) return <>loading</>;
  if (isError) return <>error!</>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
