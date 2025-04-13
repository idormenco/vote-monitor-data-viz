import type { DataLevel, FeatureCollection, GIDData } from "@/common/types";
import GradientLegend from "@/components/GradientLegend";

import { MercatorMap } from "@/components/MercatorMap";
import { useFeatureXAccessor } from "@/hooks/use-feature-x-accesor";
import { percentage, twoDecimalFormat } from "@/lib/utils";
import { scaleLinear } from "@visx/scale";
import { useCallback, useMemo } from "react";

interface PollingStationsCoverageProps {
  level: DataLevel;
  mapFeatures: FeatureCollection;
  gidData: GIDData[];
}

function PollingStationsCoverage({
  level,
  mapFeatures,
  gidData,
}: PollingStationsCoverageProps) {
  const { featureXAccessor } = useFeatureXAccessor(level);

  const getPollingStationsCoverage = useCallback(
    (data: GIDData | undefined) => {
      return data
        ? percentage(data.visitedPollingStations, data.numberOfPollingStations)
        : 0;
    },
    []
  );

  const scale = useMemo(() => {
    const values = gidData.map(getPollingStationsCoverage);
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
    return scale(getPollingStationsCoverage(data));
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
          `${d.gidName} - ${twoDecimalFormat(getPollingStationsCoverage(d))} %`
        }
        name="polling stations coverage"
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

export default PollingStationsCoverage;
