import { BOX_SPECS } from "../FieldBox/BoxType";
import { getFootprintSizeMm } from "../FieldBox/utils";
import type { Graph } from "../Route/graph";
import type { FieldBoxState } from "../types/FieldBoxState";

export type PathNode = {
  x: number;
  y: number;
};

export const bfs = (
  graph: Graph,
  boxes: FieldBoxState[],
  startId: number,
  goalId: number
): PathNode[] => {
  const queue: number[] = [startId];
  const prev = new Map<number, number | null>();
  prev.set(startId, null);

  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === goalId) break;

    for (const next of graph.get(cur) ?? []) {
      if (!prev.has(next)) {
        prev.set(next, cur);
        queue.push(next);
      }
    }
  }

  if (!prev.has(goalId)) return [];

  const path: PathNode[] = [];
  let cur: number | null = goalId;

  while (cur !== null) {
    const box = boxes.find((b) => b.id === cur)!;
    const spec = BOX_SPECS[box.type];
    const size = getFootprintSizeMm(spec, box.orientation);

    path.push({
      x: box.pos.x + size.w / 2,
      y: box.pos.y + size.h / 2,
    });

    cur = prev.get(cur)!;
  }

  return path.reverse();
};
