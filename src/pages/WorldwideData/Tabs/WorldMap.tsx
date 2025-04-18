import type { ElectionModel, FeatureShapeProperties } from "@/common/types";
import { MercatorMap } from "@/components/MercatorMap";
import { HIDDEN_REGIONS } from "@/config/site";
import { useMapColors } from "@/hooks/use-map-colors";
import { electionsQueryOptions } from "@/query-options/elections-query-options";
import { mapByCodeQueryOptions } from "@/query-options/maps-query-options";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useMemo } from "react";

interface CountryElections {
  countryCode: string;
  countryShortName: string;
  monitoredElections: ElectionModel[];
}

export interface WorldMapProps {
  onCountryClick: (data: ElectionModel[]) => void;
}

function WorldMap({ onCountryClick }: WorldMapProps) {
  const [{ data: elections }, { data: world }] = useSuspenseQueries({
    queries: [electionsQueryOptions, mapByCodeQueryOptions("world")],
  });

  const filteredLand = useMemo(
    () =>
      world.features.filter(
        (feature) => !HIDDEN_REGIONS.includes(feature.properties.name)
      ),
    [world]
  );
  const { worldMapColors } = useMapColors();

  const electionsByCountry = useMemo(() => {
    const electionsByCountry = elections?.reduce(
      (acc: Map<string, ElectionModel[]>, election) => {
        const { countryCode } = election;
        if (!acc.has(countryCode)) {
          acc.set(countryCode, []);
        }
        acc.get(countryCode)!.push(election);
        return acc;
      },
      new Map<string, ElectionModel[]>()
    );

    const result = Array.from(electionsByCountry?.entries() ?? []).map(
      ([countryCode, monitoredElections]) => ({
        countryCode,
        countryShortName: monitoredElections[0].countryShortName,
        monitoredElections,
      })
    );
    return result;
  }, [elections]);

  function getFeatureFillColor(
    data: CountryElections | undefined,
    isHovered: boolean
  ): string {
    const fillColor = data
      ? isHovered
        ? worldMapColors.coveredCountryHooverColor
        : worldMapColors.coveredCountryColor
      : worldMapColors.landColor;

    return fillColor;
  }

  return (
    <div className="w-full h-[calc(100vh-300px)]">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Elections we had monitored accros the world
      </h2>

      <MercatorMap
        features={filteredLand}
        data={electionsByCountry}
        xAccessor={(d: CountryElections) => d.countryCode}
        featureXAccessor={(p: FeatureShapeProperties) => p.a3}
        getFeatureFillColor={getFeatureFillColor}
        tooltipAccessor={(d: CountryElections) =>
          `In ${d.countryShortName} we monitored ${d.monitoredElections.length} elections`
        }
        onFeatureClick={(d) => onCountryClick(d.monitoredElections)}
        name="Elections across the world"
      />
    </div>
  );
}

export default WorldMap;
