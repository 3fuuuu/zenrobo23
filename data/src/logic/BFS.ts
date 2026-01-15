import type { Graph } from "./Route/graph";
import type { FieldBoxState } from "../components/types/FieldBoxState";
import { BOX_SPECS } from "../components/FieldBox/BoxType";
import { getFootprintSizeMm } from "../components/FieldBox/utils";

export type PathNode = { x: number; y: number };

export const bfs = (
  graph: Graph,
  boxes: FieldBoxState[],
  startId: number,
  goalId: number
): PathNode[] => {
  const q = [startId];
  const prev = new Map<number, number | null>();
  prev.set(startId, null);

  while (q.length) {
    const cur = q.shift()!;
    if (cur === goalId) break;
    for (const n of graph.get(cur) ?? []) {
      if (!prev.has(n)) {
        prev.set(n, cur);
        q.push(n);
      }
    }
  }

  if (!prev.has(goalId)) return [];

  const path: PathNode[] = [];
  let cur: number | null = goalId;

  while (cur !== null) {
    const b = boxes.find((x) => x.id === cur)!;
    const size = getFootprintSizeMm(
      BOX_SPECS[b.type as keyof typeof BOX_SPECS],
      b.orientation
    );
    path.push({ x: b.pos.x + size.w / 2, y: b.pos.y + size.h / 2 });
    cur = prev.get(cur)!;
  }

  return path.reverse();
};
