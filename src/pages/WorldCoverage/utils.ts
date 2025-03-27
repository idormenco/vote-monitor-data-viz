import type { ElectionModel } from "@/common/types";
import { defaultStyles } from "@visx/tooltip";

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

export interface CountryElections {
  countryCode: string;
  monitoredElections: ElectionModel[];
}

export const getDefaultTooltipStyles = (theme: string | undefined = "light") =>
  theme === "light"
    ? {
        ...defaultStyles,
        background: "#f9f9f9",
        border: `1px solid #353535`,
        borderRadius: "0.25rem",
        color: "#030303",
        fontSize: "1.2rem",
      }
    : {
        ...defaultStyles,
        background: "#080808",
        border: `1px solid #353535`,
        borderRadius: "0.25rem",
        color: "#c2c2c2",
        fontSize: "1.2rem",
      };
