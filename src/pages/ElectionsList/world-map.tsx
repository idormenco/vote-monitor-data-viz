import type { ElectionModel } from "@/common/types";
import { useElections } from "@/hooks/use-elections";
import { cn } from "@/lib/utils";
import * as d3 from "d3";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as topojson from "topojson-client";
import worldJson from "visionscarto-world-atlas/world/110m.json";
import { WorldMapTooltip } from "./wolrd-map-tooltip";

const width = 920;
const height = 600;

type WorldJsonCountryData = { properties: { name: string; a3: string } };

const WorldMap = () => {
  const { resolvedTheme } = useTheme();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    hoveredCountryAlpha3Code: string | null;
  }>({ x: 0, y: 0, hoveredCountryAlpha3Code: null });

  const {
    data: { electionsByCountry, maxValue },
  } = useElections((elections) => {
    const electionsByCountry = elections.reduce(
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

    // Convert Map values (arrays of elections) to an array, then find the max length
    const maxValue = Math.max(
      ...Array.from(electionsByCountry.values()).map((e) => e.length),
      0
    );

    return { electionsByCountry, maxValue };
  });

  const onCountryClick = useCallback(
    (d: WorldJsonCountryData) => {
      const electionsInCountry = electionsByCountry.get(d.properties.a3);
      const clickable = electionsInCountry && electionsInCountry.length;

      if (clickable) {
        console.log("clicked on", electionsInCountry);
      }
    },
    [electionsByCountry]
  );

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const svg = drawInteractiveCountries(svgRef.current, setTooltip);

    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const palette = colorScales[resolvedTheme ?? "dark"];

      const getColorForValue = d3
        .scaleLinear<string>()
        .domain([0, maxValue])
        .range(palette);

      colorInCountriesWithValues(
        svgRef.current,
        getColorForValue,
        electionsByCountry
      ).on("click", (_event, countryPath) => {
        onCountryClick(countryPath as unknown as WorldJsonCountryData);
      });
    }
  }, [resolvedTheme, maxValue, electionsByCountry, onCountryClick]);

  const hoveredCountryData =
    tooltip.hoveredCountryAlpha3Code &&
    electionsByCountry.get(tooltip.hoveredCountryAlpha3Code)
      ? {
          country: tooltip.hoveredCountryAlpha3Code,
          missions: electionsByCountry.get(tooltip.hoveredCountryAlpha3Code),
        }
      : undefined;

  return (
    <div className="flex flex-col relative">
      <div
        ref={containerRef}
        className="relative mx-auto w-full min-h=[380"
        style={{ height: height, width: width }}
      >
        <svg ref={svgRef} style={{ height: height, width: width }} />
        {!!hoveredCountryData && (
          <WorldMapTooltip
            x={tooltip.x}
            y={tooltip.y}
            name={hoveredCountryData.country}
            label={
              <>
                Number of missions: {hoveredCountryData.missions?.length ?? 0}
              </>
            }
          />
        )}
      </div>
      {/* <MoreLink
        list={data?.results ?? []}
        linkProps={{
          path: countriesRoute.path,
          search: (search: Record<string, unknown>) => search,
        }}
        className={undefined}
        onClick={undefined}
      /> */}
    </div>
  );
};

const colorScales: { [colorSchema: string]: string[] } = {
  ["dark"]: ["#2e3954", "#6366f1"],
  ["light"]: ["#f3ebff", "#a779e9"],
};

const sharedCountryClass = cn("transition-colors");

const countryClass = cn(
  sharedCountryClass,
  "fill-[#f8fafc]",
  "stroke-[#dae1e7]",
  "dark:fill-[#2d3747]",
  "dark:stroke-[#1f2937]"
);

const highlightedCountryClass = cn(
  sharedCountryClass,
  "fill-[#f5f5f5]",
  "stroke-[#a779e9]",
  "dark:fill-[#374151]",
  "dark:stroke-[#4f46e5]"
);

/**
 * Used to color the countries
 * @returns the svg elements represeting countries
 */
function colorInCountriesWithValues(
  element: SVGSVGElement,
  getColorForValue: d3.ScaleLinear<string, string, never>,
  dataByCountryCode: Map<string, ElectionModel[]>
) {
  function getCountryByCountryPath(countryPath: unknown) {
    return dataByCountryCode.get(
      (countryPath as unknown as WorldJsonCountryData).properties.a3
    );
  }

  const svg = d3.select(element);

  return svg
    .selectAll("path")
    .style("fill", (countryPath) => {
      const electionsInCountry = getCountryByCountryPath(countryPath);
      if (!electionsInCountry?.length) {
        return null;
      }
      return getColorForValue(electionsInCountry.length);
    })
    .style("cursor", (countryPath) => {
      const country = getCountryByCountryPath(countryPath);
      if (!country?.length) {
        return null;
      }
      return "pointer";
    });
}

/** @returns the d3 selected svg element */
function drawInteractiveCountries(
  element: SVGSVGElement,
  setTooltip: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      hoveredCountryAlpha3Code: string | null;
    }>
  >
) {
  const path = setupProjetionPath();
  const data = parseWorldTopoJsonToGeoJsonFeatures();
  const svg = d3.select(element);

  svg
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("class", countryClass)
    .attr("d", path as never)

    .on("mouseover", function (event, country) {
      const [x, y] = d3.pointer(event, svg.node()?.parentNode);
      setTooltip({ x, y, hoveredCountryAlpha3Code: country.properties.a3 });
      // brings country to front
      this.parentNode?.appendChild(this);
      d3.select(this).attr("class", highlightedCountryClass);
    })

    .on("mousemove", function (event) {
      const [x, y] = d3.pointer(event, svg.node()?.parentNode);
      setTooltip((currentState) => ({ ...currentState, x, y }));
    })

    .on("mouseout", function () {
      setTooltip({ x: 0, y: 0, hoveredCountryAlpha3Code: null });
      d3.select(this).attr("class", countryClass);
    });

  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", (event) => {
      svg.selectAll("path").attr("transform", event.transform);
    });

  svg.call(zoom as any);

  return svg;
}

function setupProjetionPath() {
  const projection = d3.geoMercator();

  const path = d3.geoPath().projection(projection);
  return path;
}

function parseWorldTopoJsonToGeoJsonFeatures(): Array<WorldJsonCountryData> {
  const collection = topojson.feature(
    // @ts-expect-error strings in worldJson not recongizable as the enum values declared in library
    worldJson,
    worldJson.objects.countries
  );
  // @ts-expect-error topojson.feature return type incorrectly inferred as not a collection
  // exclude ATA
  return collection.features.filter((f) => f.id !== "010");
}

export default WorldMap;
