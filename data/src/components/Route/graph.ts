import type { FieldBoxState } from "../types/FieldBoxState";
import { BOX_SPECS } from "../FieldBox/BoxType";
import { getFootprintSizeMm } from "../FieldBox/utils";
import { canPath } from "./canPath";

export type Graph = Map<number, number[]>;

export const buildGraph = (boxes: FieldBoxState[]): Graph => {
  const graph: Graph = new Map();

  boxes.forEach((a) => {
    graph.set(a.id, []);

    const specA = BOX_SPECS[a.type];
    const sizeA = getFootprintSizeMm(specA, a.orientation);

    const rectA = {
      x: a.pos.x,
      y: a.pos.y,
      w: sizeA.w,
      h: sizeA.h,
    };

    boxes.forEach((b) => {
      if (a.id === b.id) return;

      const specB = BOX_SPECS[b.type];
      const sizeB = getFootprintSizeMm(specB, b.orientation);

      const rectB = {
        x: b.pos.x,
        y: b.pos.y,
        w: sizeB.w,
        h: sizeB.h,
      };

      if (canPath(rectA, rectB)) {
        graph.get(a.id)!.push(b.id);
      }
    });
  });

  return graph;
};
