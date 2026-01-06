import type { Position } from "../FieldBox/BoxType";

export type BoxOrientation = "NORMAL" | "ROTATED_90" | "FLIPPED_YZ";

export type FieldBoxState = {
  id: number;
  type: string;
  pos: Position;
  orientation: BoxOrientation;
  role?: "START" | "GOAL";
};
