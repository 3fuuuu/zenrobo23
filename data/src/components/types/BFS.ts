import type { FieldBoxState } from "../types/FieldBoxState";
import { buildGraph } from "../Route/graph";
import { BOX_SPECS } from "../FieldBox/BoxType";
import { getFootprintSizeMm } from "../FieldBox/utils";

type Node = {
  x: number;
  y: number;
};

export const bfs = (boxes: FieldBoxState[]): Node[] => {
  const start = boxes.find((b) => b.role === "START");
  const goal = boxes.find((b) => b.role === "GOAL");
  if (!start || !goal) return [];

  const graph = buildGraph(boxes);

  const queue: number[] = [start.id];
  const visited = new Set<number>([start.id]);
  const prev = new Map<number, number | null>();

  prev.set(start.id, null);

  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === goal.id) break;

    for (const next of graph.get(cur) ?? []) {
      if (visited.has(next)) continue;
      visited.add(next);
      prev.set(next, cur);
      queue.push(next);
    }
  }

  // 経路復元（Box ID）
  const pathIds: number[] = [];
  let cur: number | null = goal.id;

  while (cur !== null) {
    pathIds.unshift(cur);
    cur = prev.get(cur) ?? null;
  }

  // Box 中心座標（mm）へ変換
  return pathIds.map((id) => {
    const b = boxes.find((x) => x.id === id)!;
    const spec = BOX_SPECS[b.type];
    const size = getFootprintSizeMm(spec, b.orientation);

    return {
      x: b.pos.x + size.w / 2,
      y: b.pos.y + size.h / 2,
    };
  });
};
