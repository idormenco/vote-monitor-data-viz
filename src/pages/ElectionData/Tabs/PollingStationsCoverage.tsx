import type { FeatureCollection, GIDData } from "@/common/types";

import { GeoMercator } from "@/components/MercatorMap";
import { useMapColors } from "@/hooks/use-map-colors";
import { scaleQuantize } from "@visx/scale";
import { interpolateCividis } from "d3-scale-chromatic";

interface PollingStationsCoverageProps {
  mapFeatures: FeatureCollection;
  gid0Data: GIDData;
  gidData: GIDData[];
}

function PollingStationsCoverage({
  mapFeatures,
  gid0Data,
  gidData,
}: PollingStationsCoverageProps) {
  function getFeatureFillColor(
    data: GIDData | undefined,
    isHovered: boolean
  ): string {
    return interpolateCividis(
      data?.numberOfPollingStations ?? 0 / gid0Data.numberOfPollingStations
    );
  }

  return (
    <div className="w-full h-[calc(80vh)] bg-red-700">
      <GeoMercator
        features={mapFeatures.features}
        data={gidData}
        xAccessor={(d: GIDData) => d.gid}
        yAccessor={(d: GIDData) => d.numberOfPollingStations}
        getFeatureFillColor={getFeatureFillColor}
        name="Elections across the world"
      />
    </div>
  );
}

export default PollingStationsCoverage;
