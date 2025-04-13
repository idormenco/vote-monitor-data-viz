import { Graticule, Mercator } from "@visx/geo";
import { ParentSize } from "@visx/responsive";

import type { FeatureShape, FeatureShapeProperties } from "@/common/types";
import { useMapColors } from "@/hooks/use-map-colors";
import { localPoint } from "@visx/event";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { geoMercator, geoPath } from "@visx/vendor/d3-geo";
import { Zoom } from "@visx/zoom";
import { useCallback, useMemo, useState, type ReactNode } from "react";
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

export interface MercatorMapProps<T> {
  children?: ReactNode | undefined;
  features: FeatureShape[];
  name: string;
  data: T[];
  margin?: Margin;
  xAccessor: (data: T) => string;
  featureXAccessor: (properties: FeatureShapeProperties) => string;
  getFeatureFillColor: (data: T | undefined, isHovered: boolean) => string;
  tooltipAccessor?: (data: T) => string;
  onFeatureClick?: (data: T) => void;
}

type InnerMercatorMap<T> = InnerChartProps & MercatorMapProps<T>;
const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 };
export const MercatorMap = <T,>({
  features,
  data,
  xAccessor,
  featureXAccessor,
  name,
  margin = defaultMargin,
  tooltipAccessor,
  onFeatureClick,
  getFeatureFillColor,
  children,
}: MercatorMapProps<T>) => {
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
          xAccessor={xAccessor}
          featureXAccessor={featureXAccessor}
          tooltipAccessor={tooltipAccessor}
          getFeatureFillColor={getFeatureFillColor}
          onFeatureClick={onFeatureClick}
          children={children}
        />
      )}
    </ParentSize>
  );
};

const Chart = <T,>({
  features,
  width,
  height,
  xAccessor,
  featureXAccessor,
  data,
  tooltipAccessor,
  onFeatureClick,
  name,
  getFeatureFillColor,
  children,
}: InnerMercatorMap<T>) => {
  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<T>();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
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

  const initialTransform = useMemo(() => {
    const projection = geoMercator().scale(1).translate([0, 0]);
    const path = geoPath().projection(projection);
    const bounds = path.bounds({
      type: "FeatureCollection",
      features: features.filter(
        (feature) =>
          data.find((d) => {
            return xAccessor(d) === featureXAccessor(feature.properties);
          }) !== null
      ),
    });
    // Compute scale and translate to fit the bounds into the viewport
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;

    // Optional padding around the features

    // Compute scale (same for x and y to preserve aspect ratio)
    const scale = Math.min((width - 2) / dx, (height - 2) / dy);

    return {
      scaleX: scale,
      scaleY: scale,
      translateX: width / 2 - scale * x,
      translateY: height / 2 - scale * y,
      skewX: 0,
      skewY: 0,
    };
  }, [width, height, features, data, featureXAccessor, xAccessor]);

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
      ref={zoom.containerRef}
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
        scale={zoom.transformMatrix.scaleX}
        translate={[
          zoom.transformMatrix.translateX,
          zoom.transformMatrix.translateY,
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
                return xAccessor(d) === featureXAccessor(feature.properties);
              });

              const isHovered =
                hoveredCountry === featureXAccessor(feature.properties);

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
                    setHoveredCountry(featureXAccessor(feature.properties));
                  }}
                  onTouchStart={(e) => {
                    handleTooltip(e, featureData);
                    setHoveredCountry(featureXAccessor(feature.properties));
                  }}
                  onTouchMove={(e) => {
                    handleTooltip(e, featureData);
                    setHoveredCountry(featureXAccessor(feature.properties));
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
      initialTransformMatrix={initialTransform}
    >
      {(zoom) => (
        <div style={{ position: "relative" }}>
          {renderMap(zoom)}
          <ZoomControls zoom={zoom} />
          {tooltipData && tooltipAccessor && (
            <Tooltip
              top={tooltipTop}
              left={tooltipLeft}
              style={{
                ...tooltipStyles,
                textAlign: "center",
                transform: "translate(-50%)",
              }}
            >
              {tooltipAccessor(tooltipData)}
            </Tooltip>
          )}

          {children}
        </div>
      )}
    </Zoom>
  );
};
