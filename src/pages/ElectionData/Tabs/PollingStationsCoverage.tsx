import type {
  FeatureCollection,
  FeatureShapeProperties,
  GIDData,
} from "@/common/types";

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
  console.log(totals);
  function getFeatureFillColor(data: GIDData | undefined, _: boolean): string {
    debugger;
    return interpolateCividis(
      (data?.visitedPollingStations ?? 0) / (data?.numberOfPollingStations ?? 1)
    );
  }

  return (
    <div className="w-full h-[calc(80vh)">
      <GeoMercator
        features={mapFeatures.features}
        data={gidData}
        xAccessor={(d: GIDData) => d.gid}
        yAccessor={(d: GIDData) =>
          (d.visitedPollingStations ?? 0) / (d.numberOfPollingStations ?? 1)
        }
        featureXAccessor={(p: FeatureShapeProperties) => p.GID_1}
        getFeatureFillColor={getFeatureFillColor}
        name="Elections across the world"
      />
    </div>
  );
}

export default PollingStationsCoverage;
