import { Box, Text } from "@chakra-ui/react";
import { useState, useCallback, useRef } from "react";
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

  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: rect.bottom - e.clientY,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || e.buttons !== 1) return;

      const field = e.currentTarget.parentElement as HTMLDivElement;
      const fieldRect = field.getBoundingClientRect();

      const x_px = e.clientX - fieldRect.left - offsetRef.current.x;
      const y_px = fieldRect.bottom - e.clientY - offsetRef.current.y;

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

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

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
      cursor="grab"
      userSelect="none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Text fontWeight="bold" textAlign="center">
        {spec.type}
      </Text>

      {dragging && (
        <Box
          position="absolute"
          bottom="2px"
          left="2px"
          bg="rgba(0,0,0,0.6)"
          color="white"
          fontSize="10px"
          px={1}
          borderRadius="sm"
        >
          x:{position.x.toFixed(0)} mm
          <br />
          y:{position.y.toFixed(0)} mm
        </Box>
      )}
    </Box>
  );
};
