import type { ElectionDetailsModel } from "@/common/types";

export interface ElectionDescriptionProps {
  election: ElectionDetailsModel;
}
function ElectionDescription({ election }: ElectionDescriptionProps) {
  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {election.englishTitle}
      </h1>

      <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {election.title}
      </h2>
    </div>
  );
}

export default ElectionDescription;
