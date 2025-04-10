import type { FeatureCollection, GIDData } from "@/common/types";

import { GeoMercator } from "@/components/MercatorMap";
import { interpolateCividis } from "d3-scale-chromatic";

interface PollingStationsCoverageProps {
  mapFeatures: FeatureCollection;
  totals: GIDData;
  gidData: GIDData[];
}

function PollingStationsCoverage({
  mapFeatures,
  totals,
  gidData,
}: PollingStationsCoverageProps) {
  function getFeatureFillColor(data: GIDData | undefined, _: boolean): string {
    return interpolateCividis(
      data?.visitedPollingStations ?? 0 / totals.numberOfPollingStations
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
