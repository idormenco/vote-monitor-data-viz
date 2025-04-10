import { Graticule, Mercator } from "@visx/geo";
import { ParentSize } from "@visx/responsive";

import type { FeatureShape } from "@/common/types";
import { useMapColors } from "@/hooks/use-map-colors";
import { localPoint } from "@visx/event";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { Zoom } from "@visx/zoom";
import { useCallback, useState } from "react";
import { ZoomControls } from "./ZoomControls";

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

export interface GeoMercatorProps<T> {
  features: FeatureShape[];
  name: string;
  data: T[];
  margin?: Margin;
  xAccessor: (data: T) => string;
  yAccessor: (data: T) => number;
  getFeatureFillColor: (data: T | undefined, isHovered: boolean) => string;
  tooltipAccessor?: (data: T) => string;
  onFeatureClick?: (data: T) => void;
}

type InnerGeoMercator<T> = InnerChartProps & GeoMercatorProps<T>;
const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 };
export const GeoMercator = <T,>({
  features,
  data,
  yAccessor,
  xAccessor,
  name,
  margin = defaultMargin,
  tooltipAccessor,
  onFeatureClick,
  getFeatureFillColor,
}: GeoMercatorProps<T>) => {
  return (
    <ParentSize>
      {(parent) => (
        <Chart<T>
          features={features}
          name={name}
          data={data}
          width={parent.width || 900}
          height={parent.height || 600}
          margin={margin}
          yAccessor={yAccessor}
          xAccessor={xAccessor}
          tooltipAccessor={tooltipAccessor}
          getFeatureFillColor={getFeatureFillColor}
          onFeatureClick={onFeatureClick}
        />
      )}
    </ParentSize>
  );
};

const Chart = <T,>({
  features,
  width,
  height,
  yAccessor,
  xAccessor,
  data,
  tooltipAccessor,
  onFeatureClick,
  name,
  getFeatureFillColor,
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
    transformMatrix: {
      scaleX: number;
      translateX: number;
      translateY: number;
    };
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
        data={features}
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
              const featureData = data.find((d) => {
                return xAccessor(d) === feature.properties.a3;
              });

              const isHovered = hoveredCountry === feature.properties.a3;

              return (
                <path
                  key={`map-feature-${i}`}
                  d={path || ""}
                  stroke={worldMapColors.landStrokeColor}
                  cursor={featureData ? "pointer" : "default"}
                  fill={getFeatureFillColor(featureData, isHovered)}
                  onMouseLeave={() => {
                    hideTooltip();
                    setHoveredCountry(null);
                  }}
                  onMouseMove={(e) => {
                    handleTooltip(e, featureData);
                    setHoveredCountry(feature.properties.a3);
                  }}
                  onTouchStart={(e) => {
                    handleTooltip(e, featureData);
                    setHoveredCountry(feature.properties.a3);
                  }}
                  onTouchMove={(e) => {
                    handleTooltip(e, featureData);
                    setHoveredCountry(feature.properties.a3);
                  }}
                  onClick={() => featureData && onFeatureClick?.(featureData)}
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
