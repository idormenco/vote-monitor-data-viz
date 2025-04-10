import type { GIDData } from "@/common/types";
export interface ReportedIncidentsProps {
  totals: GIDData;
  gidData: GIDData[];
}
function ReportedIncidents({ totals, gidData }: ReportedIncidentsProps) {
  return <div>ReportedIncidents</div>;
}

export default ReportedIncidents;
