import type { BoxSpec } from "./BoxType";
import type { BoxOrientation } from "../types/FieldBoxState";
export const getFootprintSizeMm = (
  spec: BoxSpec,
  orientation: BoxOrientation
): { w: number; h: number } => {
  switch (orientation) {
    case "NORMAL":
      return { w: spec.sizeMm.x, h: spec.sizeMm.y };
    case "ROTATED_90":
      return { w: spec.sizeMm.y, h: spec.sizeMm.x };
    case "FLIPPED_YZ":
      return { w: spec.sizeMm.x, h: spec.sizeMm.z };
    default: {
      const _exhaustive: never = orientation;
      throw new Error(`Unknown orientation: ${_exhaustive}`);
    }
  }
};
