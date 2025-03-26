import type { ElectionModel } from "@/common/types";
import { useElections } from "@/hooks/use-elections";
import { useTheme } from "next-themes";
import { useParentSize } from "@visx/responsive";
import { scaleQuantize } from "@visx/scale";
import { Mercator, Graticule } from "@visx/geo";
import * as topojson from "topojson-client";
import worldJson from "visionscarto-world-atlas/world/110m.json";
import { useMemo } from "react";

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string; a3: string };
}

// @ts-expect-error
const world = topojson.feature(worldJson, worldJson.objects.countries) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

const WorldMap = () => {
  const { resolvedTheme } = useTheme();
  const { parentRef, width, height } = useParentSize({ debounceTime: 150 });

  const backgroundColor = useMemo(
    () => (resolvedTheme === "light" ? "#f9f7e8" : "#111111"),
    [resolvedTheme]
  );

  const { data: electionsByCountry } = useElections((elections) => {
    const electionsByCountry = elections?.reduce(
      (acc: Map<string, ElectionModel[]>, election) => {
        const { country } = election;
        if (!acc.has(country)) {
          acc.set(country, []);
        }
        acc.get(country)!.push(election);
        return acc;
      },
      new Map<string, ElectionModel[]>()
    );

    return electionsByCountry;
  });

  const scaleColorRange = useMemo(
    () =>
      resolvedTheme === "light"
        ? [
            "#ffb01d",
            "#ffa020",
            "#ff9221",
            "#ff8424",
            "#ff7425",
            "#fc5e2f",
            "#f94b3a",
            "#f63a48",
          ]
        : [
            "#ffb01d",
            "#ffa020",
            "#ff9221",
            "#ff8424",
            "#ff7425",
            "#fc5e2f",
            "#f94b3a",
            "#f63a48",
          ],
    [resolvedTheme]
  );

  const color = useMemo(
    () =>
      scaleQuantize({
        domain: [
          0,
          Math.max(
            ...Array.from(electionsByCountry?.values() ?? []).map(
              (e) => e.length
            ),
            0
          ),
        ],
        range: scaleColorRange,
      }),
    [electionsByCountry, scaleColorRange]
  );

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;

  return (
    <div
      ref={parentRef}
      className="relative w-full h-[calc(100vh-200px)] bg-red-400"
    >
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={backgroundColor}
        />
        <Mercator<FeatureShape>
          data={world.features.filter((f) => f.id !== "010")}
          scale={scale}
          translate={[centerX, centerY + 50]}
        >
          {(mercator) => (
            <g>
              <Graticule
                graticule={(g) => mercator.path(g) || ""}
                stroke="rgba(33,33,33,0.05)"
              />
              {mercator.features.map(({ feature, path }, i) => (
                <path
                  key={`map-feature-${i}`}
                  d={path || ""}
                  fill={color(
                    electionsByCountry?.get(feature.properties.a3)?.length ?? 0
                  )}
                  stroke={backgroundColor}
                  strokeWidth={0.5}
                  onClick={() => {
                    console.log(feature);
                  }}
                />
              ))}
            </g>
          )}
        </Mercator>
      </svg>
    </div>
  );
};

export default WorldMap;
