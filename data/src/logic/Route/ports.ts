import type { FieldBoxState } from "../../components/types/FieldBoxState";
import { BOX_SPECS } from "../../components/FieldBox/BoxType";
import { getFootprintSizeMm } from "../../components/FieldBox/utils";

export const getCenter = (b: FieldBoxState) => {
  const s = getFootprintSizeMm(BOX_SPECS[b.type], b.orientation);
  return { x: b.pos.x + s.w / 2, y: b.pos.y + s.h / 2 };
};
