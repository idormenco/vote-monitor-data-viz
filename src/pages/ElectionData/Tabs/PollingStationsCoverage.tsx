import type {
  FeatureCollection,
  FeatureShapeProperties,
  GIDData,
} from "@/common/types";

import { MercatorMap } from "@/components/MercatorMap";
import { percentage, twoDecimalFormat } from "@/lib/utils";
import { LegendItem, LegendLabel, LegendLinear } from "@visx/legend";
import { scaleLinear } from "@visx/scale";
import { useCallback, useMemo } from "react";

interface PollingStationsCoverageProps {
  mapFeatures: FeatureCollection;
  gidData: GIDData[];
}

function PollingStationsCoverage({
  mapFeatures,
  gidData,
}: PollingStationsCoverageProps) {
  const getPollingStationsCoverage = useCallback(
    (data: GIDData | undefined) => {
      return data
        ? percentage(data.visitedPollingStations, data.numberOfPollingStations)
        : 0;
    },
    []
  );

  const scale = useMemo(
    () =>
      scaleLinear({
        domain: [
          Math.min(...gidData.map(getPollingStationsCoverage)),
          Math.max(...gidData.map(getPollingStationsCoverage)),
        ],
        range: ["#4b0091", "#ffb01d"],
        clamp: true,
      }),
    [gidData]
  );

  function getFeatureFillColor(data: GIDData | undefined, _: boolean): string {
    return scale(getPollingStationsCoverage(data));
  }

  return (
    <div className="w-full h-[calc(80vh)]">
      <MercatorMap
        features={mapFeatures.features}
        data={gidData}
        xAccessor={(d: GIDData) => d.gid}
        featureXAccessor={(p: FeatureShapeProperties) => p.GID_1}
        getFeatureFillColor={getFeatureFillColor}
        tooltipAccessor={(d: GIDData) =>
          `${d.gidName} - ${twoDecimalFormat(getPollingStationsCoverage(d))} %`
        }
        name="polling stations coverage"
      >
        <div className="absolute bottom-8 left-12 flex flex-col gap-y-1">
          <LegendLinear
            scale={scale}
            labelFormat={(d, i) =>
              i % 2 === 0 ? `${twoDecimalFormat(d)} %` : ""
            }
            className="absolute bottom-1"
          >
            {(labels) =>
              labels.map((label, i) => (
                <LegendItem key={`legend-quantile-${i}`}>
                  <svg width={15} height={15} style={{ margin: "2px 0" }}>
                    <circle
                      fill={label.value}
                      r={15 / 2}
                      cx={15 / 2}
                      cy={15 / 2}
                    />
                  </svg>
                  <LegendLabel align="left" margin="0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))
            }
          </LegendLinear>
        </div>
      </MercatorMap>
    </div>
  );
}

export default PollingStationsCoverage;
