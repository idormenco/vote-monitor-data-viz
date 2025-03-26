import * as topojson from "topojson-client";
import { Graticule, Mercator } from "@visx/geo";
import { scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";

import { useTooltip, Tooltip } from "@visx/tooltip";
import { Zoom } from "@visx/zoom";
import { useCallback, useMemo } from "react";
import { localPoint } from "@visx/event";
import { ZoomControls } from "./zoom";
import {
  getDefaultTooltipStyles,
  type InnerChartProps,
  type Margin,
} from "./utils";
import worldJson from "visionscarto-world-atlas/world/110m.json";
import { useTheme } from "next-themes";

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string; a3: string };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const world = topojson.feature(worldJson, worldJson.objects.countries) as {
  type: "FeatureCollection";
  features: FeatureShape[];
};

export interface GeoMercatorProps<T> {
  name: string;
  data: T[];
  margin?: Margin;
  xAccessor: (d: T) => string;
  yAccessor: (d: T) => number;
  tooltipAccessor?: (d: T) => string;
  showZoomControls?: boolean;
  allowZoomAndDrag?: boolean;
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
  showZoomControls = false,
  allowZoomAndDrag = false,
}: GeoMercatorProps<T>) => {
  return (
    <ParentSize>
      {(parent) => (
        <Chart<T>
          name={name}
          data={data}
          width={parent.width}
          height={parent.height}
          margin={margin}
          yAccessor={yAccessor}
          xAccessor={xAccessor}
          allowZoomAndDrag={allowZoomAndDrag}
          showZoomControls={showZoomControls}
          tooltipAccessor={tooltipAccessor}
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
  name,
  allowZoomAndDrag,
  showZoomControls,
}: InnerGeoMercator<T>) => {
  const { resolvedTheme } = useTheme();
  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<T>();

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) * 0.25;

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

  const colorScale = useMemo(
    () =>
      scaleLinear({
        domain: [
          Math.min(...data.map((d) => yAccessor(d))),
          Math.max(...data.map((d) => yAccessor(d))),
        ],
        range: scaleColorRange,
      }),
    [scaleColorRange]
  );

  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGPathElement>
        | React.MouseEvent<SVGPathElement>,
      countryData: T | undefined
    ) => {
      const eventSvgCoords = localPoint(event);

      console.log(eventSvgCoords);

      showTooltip({
        tooltipData: countryData,
        tooltipLeft: eventSvgCoords?.x,
        tooltipTop: eventSvgCoords ? eventSvgCoords.y - 38 : undefined,
      });
    },
    [showTooltip]
  );

  const renderMap = (zoom?: {
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
        cursor:
          allowZoomAndDrag && zoom
            ? zoom.isDragging
              ? "grabbing"
              : "grab"
            : "default",
      }}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={"#f9f9f9"}
        rx={10}
      />
      <Mercator<FeatureShape>
        data={world.features}
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
              stroke="rgba(33,33,33,0.05)"
            />
            {mercator.features.map(({ feature, path }, i) => {
              const countryData = data.find((d) => {
                return xAccessor(d) === feature.properties.a3;
              });

              const fillColor = countryData
                ? colorScale(yAccessor(countryData))
                : "#e9e9e9";

              return (
                <path
                  key={`map-feature-${i}`}
                  d={path || ""}
                  stroke={"#353535"}
                  strokeWidth={0.35}
                  fill={fillColor}
                  onMouseLeave={hideTooltip}
                  onMouseMove={(e) => handleTooltip(e, countryData)}
                  onTouchStart={(e) => handleTooltip(e, countryData)}
                  onTouchMove={(e) => handleTooltip(e, countryData)}
                />
              );
            })}
          </g>
        )}
      </Mercator>
      {allowZoomAndDrag && zoom && (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={14}
          fill="transparent"
          onTouchStart={zoom.dragStart}
          onTouchMove={zoom.dragMove}
          onTouchEnd={zoom.dragEnd}
          onMouseDown={zoom.dragStart}
          onMouseMove={zoom.dragMove}
          onMouseUp={zoom.dragEnd}
          onMouseLeave={() => {
            if (zoom.isDragging) zoom.dragEnd();
          }}
        />
      )}
    </svg>
  );

  return allowZoomAndDrag ? (
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
          {showZoomControls && <ZoomControls zoom={zoom} />}
          {tooltipData && (
            <Tooltip
              top={tooltipTop}
              left={tooltipLeft}
              style={{
                ...getDefaultTooltipStyles(resolvedTheme),
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
  ) : (
    <div style={{ position: "relative" }}>
      {renderMap()}
      {tooltipData && (
        <Tooltip
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...getDefaultTooltipStyles(resolvedTheme),
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
  );
};
