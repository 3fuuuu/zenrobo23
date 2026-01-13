import type { Sequence } from "./Sequence";

export const pathToSequence = (path: { x: number; y: number }[]): Sequence => ({
  version: 1,
  commands: path.flatMap((p) => [
    { type: "MOVE", x: p.x, y: p.y },
    { type: "WAIT", ms: 200 },
  ]),
});
