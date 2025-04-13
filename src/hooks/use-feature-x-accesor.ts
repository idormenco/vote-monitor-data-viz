import type { DataLevel, FeatureShapeProperties } from "@/common/types";
import React from "react";

export function useFeatureXAccessor(level: DataLevel) {
  const featureXAccessor = React.useMemo(() => {
    if (level === "level0") return (p: FeatureShapeProperties) => p.GID_0;
    if (level === "level1") return (p: FeatureShapeProperties) => p.GID_1;
    if (level === "level2") return (p: FeatureShapeProperties) => p.GID_2;
    if (level === "level3") return (p: FeatureShapeProperties) => p.GID_3;
    if (level === "level4") return (p: FeatureShapeProperties) => p.GID_4;

    throw new Error("Unmapped level received!");
  }, [level]);

  return {
    featureXAccessor,
  };
}
