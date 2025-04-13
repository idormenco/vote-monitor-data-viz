import type { DataLevel, FeatureCollection, GIDData } from "@/common/types";
import GradientLegend from "@/components/GradientLegend";

import { MercatorMap } from "@/components/MercatorMap";
import { useFeatureXAccessor } from "@/hooks/use-feature-x-accesor";
import { percentage, twoDecimalFormat } from "@/lib/utils";
import { scaleLinear } from "@visx/scale";
import { useCallback, useMemo } from "react";

export interface QuickReportsProps {
  level: DataLevel;
  mapFeatures: FeatureCollection;
  gidData: GIDData[];
  totals: GIDData;
}
function QuickReports({
  level,
  mapFeatures,
  totals,
  gidData,
}: QuickReportsProps) {
  const { featureXAccessor } = useFeatureXAccessor(level);

  const getQuickReportsPercentage = useCallback(
    (data: GIDData | undefined) => {
      return data && totals.quickReportsSubmitted > 0
        ? percentage(data.quickReportsSubmitted, totals.quickReportsSubmitted)
        : 0;
    },
    [totals]
  );

  const scale = useMemo(() => {
    const values = gidData.map(getQuickReportsPercentage);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = ["#4b0091", "#f63a48"];

    if (min === max) {
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
    return scale(getQuickReportsPercentage(data));
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
          `${d.gidName} - ${twoDecimalFormat(getQuickReportsPercentage(d))} %`
        }
        name="quick reports"
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

export default QuickReports;
