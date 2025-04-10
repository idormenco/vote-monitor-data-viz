import type { FeatureCollection, GIDData } from "@/common/types";

import { GeoMercator } from "@/components/MercatorMap";

interface PollingStationsCoverageProps {
  mapFeatures: FeatureCollection;
  gid0Data: GIDData[];
  gidData: GIDData[];
}

function PollingStationsCoverage({
  mapFeatures,
  gid0Data,
  gidData,
}: PollingStationsCoverageProps) {
  return (
    <div className="w-full h-[calc(80vh)] bg-red-700">
      <GeoMercator
        features={mapFeatures.features}
        data={gidData}
        xAccessor={(d: GIDData) => d.gid}
        yAccessor={(d: GIDData) => d.numberOfPollingStations}
        name="Elections across the world"
      />
    </div>
  );
}

export default PollingStationsCoverage;
