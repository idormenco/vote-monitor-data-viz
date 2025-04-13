import { useMapColors } from "@/hooks/use-map-colors";
import { LinearGradient } from "@visx/gradient";
import { LegendLinear } from "@visx/legend";
import { scaleLinear, type ScaleLinear } from "@visx/vendor/d3-scale";
import { useMemo } from "react";

export interface GradientLegendProps {
  scale: ScaleLinear<string, string, never>;
  width?: number;
  height?: number;
  legendTextFormatter?: (value: number) => string;
}

const GradientLegend = ({
  scale,
  width = 280,
  legendTextFormatter,
}: GradientLegendProps) => {
  const { worldMapColors } = useMapColors();

  const min = useMemo(() => scale.domain()[0], [scale]);
  const max = useMemo(() => scale.domain()[1], [scale]);

  const xScale = useMemo(
    () => scaleLinear().range([0, width]).domain([0, max]),
    [width, max]
  );

  return (
    <div className="relative bottom-1">
      {/* Gradient Bar */}
      <svg width={width + 60} height={24 + 40}>
        <LinearGradient
          id="legend-gradient"
          from={scale(min)}
          to={scale(max)}
          vertical={false}
        />

        {/* Gradient bar */}
        <rect
          x={20}
          y={0}
          width={width}
          height={24}
          fill="url(#legend-gradient)"
        />

        <LegendLinear
          scale={scale}
          labelFormat={(d) =>
            legendTextFormatter ? legendTextFormatter(d.valueOf()) : d
          }
          className="absolute bottom-1"
        >
          {(labels) =>
            labels.map((tick, index) => {
              return (
                <g key={index}>
                  <line
                    x1={xScale(tick.datum.valueOf()) + 20}
                    x2={xScale(tick.datum.valueOf()) + 20}
                    y1={0}
                    y2={24 + 10}
                    stroke={worldMapColors.labelTextColor}
                    strokeWidth={2}
                  />
                  <text
                    x={xScale(tick.datum.valueOf()) + 20}
                    y={24 + 24}
                    fontSize={12}
                    textAnchor="middle"
                    fill={worldMapColors.labelTextColor}
                  >
                    {legendTextFormatter
                      ? legendTextFormatter(tick.datum.valueOf())
                      : tick.datum.valueOf()}
                  </text>
                </g>
              );
            })
          }
        </LegendLinear>

        {}
      </svg>
    </div>
  );
};

export default GradientLegend;
