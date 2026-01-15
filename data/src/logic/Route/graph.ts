import type { FieldBoxState } from "../../components/types/FieldBoxState";
import { BOX_SPECS } from "../../components/FieldBox/BoxType";
import { getFootprintSizeMm } from "../../components/FieldBox/utils";
import { canPath } from "./canPath";

export type Graph = Map<number, number[]>;

export const buildGraph = (boxes: FieldBoxState[]): Graph => {
  const graph: Graph = new Map();

  boxes.forEach((a) => {
    graph.set(a.id, []);

    const sa = getFootprintSizeMm(
      BOX_SPECS[a.type as keyof typeof BOX_SPECS],
      a.orientation
    );

    boxes.forEach((b) => {
      if (a.id === b.id) return;

      const sb = getFootprintSizeMm(
        BOX_SPECS[b.type as keyof typeof BOX_SPECS],
        b.orientation
      );

      if (
        canPath(
          { x: a.pos.x, y: a.pos.y, w: sa.w, h: sa.h },
          { x: b.pos.x, y: b.pos.y, w: sb.w, h: sb.h }
        )
      ) {
        graph.get(a.id)!.push(b.id);
      }
    });
  });

  return graph;
};
