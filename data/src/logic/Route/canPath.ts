export const GAP_MM = 60;

export type Rect = { x: number; y: number; w: number; h: number };

export const canPath = (a: Rect, b: Rect): boolean => {
  const ax2 = a.x + a.w;
  const ay2 = a.y + a.h;
  const bx2 = b.x + b.w;
  const by2 = b.y + b.h;

  const horizontal =
    (Math.abs(ax2 - b.x) <= GAP_MM || Math.abs(bx2 - a.x) <= GAP_MM) &&
    !(ay2 < b.y || a.y > by2);

  const vertical =
    (Math.abs(ay2 - b.y) <= GAP_MM || Math.abs(by2 - a.y) <= GAP_MM) &&
    !(ax2 < b.x || a.x > bx2);

  return horizontal || vertical;
};
