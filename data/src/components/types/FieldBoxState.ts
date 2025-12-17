import type { Position } from "../FieldBox/BoxType";
import type { BOX_SPECS } from "../FieldBox/BoxType";

export type Orientation = "XY" | "XZ";

export type FieldBoxState = {
  id: number;
  type: keyof typeof BOX_SPECS;
  pos: Position;
  rotation: 0 | 90 | 180 | 270;
  orientation: Orientation;
};
