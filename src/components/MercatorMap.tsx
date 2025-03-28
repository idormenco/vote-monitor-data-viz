import { Graticule, Mercator } from "@visx/geo";
import { ParentSize } from "@visx/responsive";
import * as topojson from "topojson-client";

import type { FeatureShape } from "@/common/types";
import { useMapColors } from "@/hooks/use-map-colors";
import { localPoint } from "@visx/event";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { Zoom } from "@visx/zoom";
import { useCallback, useState } from "react";
import worldJson from "visionscarto-world-atlas/world/110m.json";

import { ZoomControls } from "../pages/Elections/zoom";

export interface ChartProps {
  /// Unique identifier for the chart
  name: string;
  showGrid?: boolean;
  axisXLabel?: string;
  axisYLabel?: string;
  showAxisX?: boolean;
  showAxisY?: boolean;
}

export interface InnerChartProps extends ChartProps {
  width: number;
  height: number;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const world = topojson.feature(worldJson, worldJson.objects.countries) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

// We hide Antarctica because there will not be validators there:
const HIDDEN_REGIONS = ["Antarctica"];
const filteredLand = world.features.filter(
  (feature) => !HIDDEN_REGIONS.includes(feature.properties.name)
);

export interface GeoMercatorProps<T> {
  name: string;
  data: T[];
  margin?: Margin;
  xAccessor: (d: T) => string;
  yAccessor: (d: T) => number;
  tooltipAccessor?: (d: T) => string;
  onCountryClick?: (d: T) => void;
}

type InnerGeoMercator<T> = InnerChartProps & GeoMercatorProps<T>;
const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 };
export const GeoMercator = <T,>({
  data,
  yAccessor,
  xAccessor,
  name,
  margin = defaultMargin,
  tooltipAccessor,
  onCountryClick,
}: GeoMercatorProps<T>) => {
  return (
    <ParentSize>
      {(parent) => (
        <Chart<T>
          name={name}
          data={data}
          width={parent.width || 900}
          height={parent.height || 600}
          margin={margin}
          yAccessor={yAccessor}
          xAccessor={xAccessor}
          tooltipAccessor={tooltipAccessor}
          onCountryClick={onCountryClick}
        />
      )}
    </ParentSize>
  );
};

const Chart = <T,>({
  width,
  height,
  yAccessor,
  xAccessor,
  data,
  tooltipAccessor,
  onCountryClick,
  name,
}: InnerGeoMercator<T>) => {
  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<T>();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const centerX = width / 2;
  const centerY = height * 0.7;
  const scale = Math.min(width, height) * 0.5;
  const { worldMapColors, tooltipStyles } = useMapColors();

  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGPathElement>
        | React.MouseEvent<SVGPathElement>,
      countryData: T | undefined
    ) => {
      const eventSvgCoords = localPoint(event);

      showTooltip({
        tooltipData: countryData,
        tooltipLeft: eventSvgCoords?.x,
        tooltipTop: eventSvgCoords ? eventSvgCoords.y - 38 : undefined,
      });
    },
    [showTooltip]
  );

  const renderMap = (zoom: {
    containerRef: React.RefObject<SVGSVGElement>;
    isDragging: boolean;
    dragStart: any;
    dragMove: any;
    dragEnd: any;
    transformMatrix: { scaleX: number; translateX: number; translateY: number };
  }) => (
    <svg
      id={name}
      name={name}
      width={width}
      height={height}
      ref={zoom?.containerRef}
      style={{
        touchAction: "none",
        // cursor: zoom.isDragging ? "grabbing" : "grab",
      }}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={worldMapColors.waterColor}
      />
      <Mercator<FeatureShape>
        data={filteredLand}
        scale={zoom?.transformMatrix.scaleX || scale}
        translate={[
          zoom?.transformMatrix.translateX || centerX,
          zoom?.transformMatrix.translateY || centerY,
        ]}
      >
        {(mercator) => (
          <g>
            <Graticule
              graticule={(g) => mercator.path(g) || ""}
              stroke={worldMapColors.landStrokeColor}
            />
            {mercator.features.map(({ feature, path }, i) => {
              const countryData = data.find((d) => {
                return xAccessor(d) === feature.properties.a3;
              });

              const isHovered = hoveredCountry === feature.properties.a3;

              const fillColor = countryData
                ? isHovered
                  ? worldMapColors.coveredCountryHooverColor
                  : worldMapColors.coveredCountryColor
                : worldMapColors.landColor;

              return (
                <path
                  key={`map-feature-${i}`}
                  d={path || ""}
                  stroke={worldMapColors.landStrokeColor}
                  cursor={countryData ? "pointer" : "default"}
                  fill={fillColor}
                  onMouseLeave={() => {
                    hideTooltip();
                    setHoveredCountry(null);
                  }}
                  onMouseMove={(e) => {
                    handleTooltip(e, countryData);
                    setHoveredCountry(feature.properties.a3);
                  }}
                  onTouchStart={(e) => {
                    handleTooltip(e, countryData);
                    setHoveredCountry(feature.properties.a3);
                  }}
                  onTouchMove={(e) => {
                    handleTooltip(e, countryData);
                    setHoveredCountry(feature.properties.a3);
                  }}
                  onClick={() => countryData && onCountryClick?.(countryData)}
                />
              );
            })}
          </g>
        )}
      </Mercator>
    </svg>
  );

  return (
    <Zoom<SVGSVGElement>
      width={width}
      height={height}
      scaleXMin={100}
      scaleXMax={1000}
      scaleYMin={100}
      scaleYMax={1000}
      initialTransformMatrix={{
        scaleX: scale,
        scaleY: scale,
        translateX: centerX,
        translateY: centerY,
        skewX: 0,
        skewY: 0,
      }}
    >
      {(zoom) => (
        <div style={{ position: "relative" }}>
          {renderMap(zoom)}
          <ZoomControls zoom={zoom} />
          {tooltipData && (
            <Tooltip
              top={tooltipTop}
              left={tooltipLeft}
              style={{
                ...tooltipStyles,
                textAlign: "center",
                transform: "translate(-50%)",
              }}
            >
              {tooltipAccessor
                ? tooltipAccessor(tooltipData)
                : `${xAccessor(tooltipData)}: ${yAccessor(tooltipData)}`}
            </Tooltip>
          )}
        </div>
      )}
    </Zoom>
  );
};
