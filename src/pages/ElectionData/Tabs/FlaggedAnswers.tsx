import type { DataLevel, FeatureCollection, GIDData } from "@/common/types";
import GradientLegend from "@/components/GradientLegend";

import { MercatorMap } from "@/components/MercatorMap";
import { useFeatureXAccessor } from "@/hooks/use-feature-x-accesor";
import { percentage, twoDecimalFormat } from "@/lib/utils";
import { scaleLinear } from "@visx/scale";
import { useCallback, useMemo } from "react";

export interface FlaggedAnswersProps {
  level: DataLevel;
  mapFeatures: FeatureCollection;
  gidData: GIDData[];
}
function FlaggedAnswers({ level, mapFeatures, gidData }: FlaggedAnswersProps) {
  const { featureXAccessor } = useFeatureXAccessor(level);

  const getFlaggedAnwersToAnswersPercentage = useCallback(
    (data: GIDData | undefined) => {
      return data && data.numberOfQuestionsAnswered > 0
        ? percentage(
            data.numberOfFlaggedAnswers,
            data.numberOfQuestionsAnswered
          )
        : 0;
    },
    []
  );

  const scale = useMemo(() => {
    const values = gidData.map(getFlaggedAnwersToAnswersPercentage);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = ["#4b0091", "#f63a48"];

    if (min === max) {
      // return base color
      return scaleLinear({
        domain: [0, 100],
        range,
        clamp: true,
      });
    }

    return scaleLinear({
      domain: [min, max],
      range,
      clamp: true,
    });
  }, [gidData]);

  function getFeatureFillColor(data: GIDData | undefined, _: boolean): string {
    return scale(getFlaggedAnwersToAnswersPercentage(data));
  }

  return (
    <div className="w-full h-[calc(80vh)]">
      <MercatorMap
        features={mapFeatures.features}
        data={gidData}
        xAccessor={(d: GIDData) => d.gid}
        featureXAccessor={featureXAccessor}
        getFeatureFillColor={getFeatureFillColor}
        tooltipAccessor={(d: GIDData) =>
          `${d.gidName} - ${twoDecimalFormat(
            getFlaggedAnwersToAnswersPercentage(d)
          )} %`
        }
        name="flagged answers"
      >
        <div className="absolute bottom-8 left-12 flex flex-col gap-y-1">
          <GradientLegend
            scale={scale}
            legendTextFormatter={(v) => `${twoDecimalFormat(v)} %`}
          />
        </div>
      </MercatorMap>
    </div>
  );
}

export default FlaggedAnswers;
