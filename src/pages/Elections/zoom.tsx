import { Button } from "@/components/ui/button";
import type { ProvidedZoom } from "@visx/zoom/lib/types";
import { Plus as ZoomInIcon, Minus as ZoomOutIcon } from "lucide-react";
import { type FC } from "react";

interface ZoomControlsProps {
  zoom: ProvidedZoom<SVGSVGElement>;
}

export const ZoomControls: FC<ZoomControlsProps> = ({ zoom }) => {
  return (
    <div className="absolute bottom-8 right-12 flex flex-col items-end gap-y-1">
      <Button
        type="button"
        size="icon"
        aria-label="zoom in"
        onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
      >
        <ZoomInIcon />
      </Button>
      <Button
        type="button"
        size="icon"
        aria-label="zoom out"
        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
      >
        <ZoomOutIcon />
      </Button>
      <Button type="button" size="sm" onClick={() => zoom.reset()}>
        Reset
      </Button>
    </div>
  );
};
