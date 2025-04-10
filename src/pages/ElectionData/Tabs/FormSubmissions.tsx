import type { GIDData } from "@/common/types";
export interface FormSubmissionsProps {
  gid0Data: GIDData[];
  gidData: GIDData[];
}
function FormSubmissions({}: FormSubmissionsProps) {
  return <div className="h-full">FormSubmissions</div>;
}

export default FormSubmissions;
