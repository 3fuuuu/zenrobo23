export const GAP_MM = 20;

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const canPath = (a: Rect, b: Rect): boolean => {
  const aRight = a.x + a.w;
  const aTop = a.y + a.h;
  const bRight = b.x + b.w;
  const bTop = b.y + b.h;

  const horizontalGap =
    Math.abs(aRight - b.x) <= GAP_MM || Math.abs(bRight - a.x) <= GAP_MM;

  const verticalOverlap = !(aTop < b.y || a.y > bTop);

  const verticalGap =
    Math.abs(aTop - b.y) <= GAP_MM || Math.abs(bTop - a.y) <= GAP_MM;

  const horizontalOverlap = !(aRight < b.x || a.x > bRight);

  return (
    (horizontalGap && verticalOverlap) || (verticalGap && horizontalOverlap)
  );
};
