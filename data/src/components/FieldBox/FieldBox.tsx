import { Box } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import type { BoxSpec, Position } from "./BoxType";

type Props = {
  spec: BoxSpec;
  position: Position;
  scale: number;
  fieldSize_mm: number;
  onMove: (pos: Position) => void;
};

export const FieldBox = ({
  spec,
  position,
  scale,
  fieldSize_mm,
  onMove,
}: Props) => {
  const sizePx_x = spec.sizeMm.x * scale;
  const sizePx_y = spec.sizeMm.y * scale;

  const leftPx = position.x * scale;
  const bottomPx = position.y * scale;

  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setDragging(true);
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;

      const field = e.currentTarget.parentElement as HTMLDivElement;
      const rect = field.getBoundingClientRect();

      const x_px = e.clientX - rect.left;
      const y_px = rect.bottom - e.clientY;

      const x_mm = Math.max(
        0,
        Math.min(fieldSize_mm - spec.sizeMm.x, x_px / scale)
      );
      const y_mm = Math.max(
        0,
        Math.min(fieldSize_mm - spec.sizeMm.y, y_px / scale)
      );

      onMove({ x: x_mm, y: y_mm });
    },
    [dragging, fieldSize_mm, scale, spec, onMove]
  );

  const onPointerUp = () => setDragging(false);

  return (
    <Box
      position="absolute"
      left={leftPx}
      bottom={bottomPx}
      w={sizePx_x}
      h={sizePx_y}
      bg="orange"
      border="2px solid white"
      opacity={0.9}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {spec.type}
    </Box>
  );
};
