import type { GIDData } from "@/common/types";
export interface FormSubmissionsProps {
  totals: GIDData;

  gidData: GIDData[];
}
function FormSubmissions({ totals, gidData }: FormSubmissionsProps) {
  return <div className="h-full">FormSubmissions</div>;
}

export default FormSubmissions;
