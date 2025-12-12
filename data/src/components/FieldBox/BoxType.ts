export type Position = { x: number; y: number };

export type BoxSpec = {
  type: string;
  sizeMm: { x: number; y: number; z: number };
};

export const BOX_SPECS: Record<string, BoxSpec> = {
  A: { type: "A", sizeMm: { x: 300, y: 300, z: 300 } },
  B: { type: "B", sizeMm: { x: 400, y: 400, z: 400 } },
  C: { type: "C", sizeMm: { x: 500, y: 500, z: 500 } },
  D: { type: "D", sizeMm: { x: 200, y: 800, z: 200 } },
  E: { type: "E", sizeMm: { x: 300, y: 1000, z: 300 } },
};
