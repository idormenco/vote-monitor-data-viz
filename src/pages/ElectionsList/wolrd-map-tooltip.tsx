import { cn } from "@/lib/utils";

interface MapTooltipProps {
  name: string;
  label?: React.ReactNode;
  x: number;
  y: number;
}

export const WorldMapTooltip = ({ name, label, x, y }: MapTooltipProps) => (
  <div
    className={cn(
      "absolute",
      "z-50",
      "p-2",
      "translate-x-2",
      "translate-y-2",
      "pointer-events-none",
      "rounded-sm",
      "bg-white",
      "dark:bg-gray-800",
      "shadow",
      "dark:border-gray-850",
      "dark:text-gray-200",
      "dark:shadow-gray-850",
      "shadow-gray-200"
    )}
    style={{
      left: x,
      top: y,
    }}
  >
    <div className="font-semibold">{name}</div>
    {label && <>{label}</>}
  </div>
);
