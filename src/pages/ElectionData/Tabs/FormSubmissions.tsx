import type { DataLevel, FeatureCollection, GIDData } from "@/common/types";

import GradientLegend from "@/components/GradientLegend";
import { MercatorMap } from "@/components/MercatorMap";
import { useFeatureXAccessor } from "@/hooks/use-feature-x-accesor";
import { percentage, twoDecimalFormat } from "@/lib/utils";
import { scaleLinear } from "@visx/scale";
import { useCallback, useMemo } from "react";

export interface FormSubmissionsProps {
  level: DataLevel;
  mapFeatures: FeatureCollection;
  gidData: GIDData[];
  totals: GIDData;
}
function FormSubmissions({
  level,
  totals,
  gidData,
  mapFeatures,
}: FormSubmissionsProps) {
  const { featureXAccessor } = useFeatureXAccessor(level);

  const getFormSubmissionsPercentage = useCallback(
    (data: GIDData | undefined) => {
      return totals.formSubmitted > 0
        ? percentage(data?.formSubmitted || 0, totals.formSubmitted)
        : 0;
    },
    [totals]
  );

  const scale = useMemo(() => {
    const values = gidData.map(getFormSubmissionsPercentage);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = ["#4b0091", "#ffb01d"];

    if (min === max) {
      return scaleLinear({
        domain: [0, max],
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
    return scale(getFormSubmissionsPercentage(data));
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
            getFormSubmissionsPercentage(d)
          )} %`
        }
        name="form submissions"
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

export default FormSubmissions;
