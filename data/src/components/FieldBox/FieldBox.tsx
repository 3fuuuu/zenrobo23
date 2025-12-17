import { Box, Text } from "@chakra-ui/react";
import { useState, useCallback, useRef } from "react";
import type { BoxSpec, Position } from "./BoxType";
import type { BoxOrientation } from "../FieldLayout/FieldLayout";
import { getFootprintSizeMm } from "./utils";

type Props = {
  spec: BoxSpec;
  position: Position;
  orientation: BoxOrientation;
  scale: number;
  fieldSize_mm: number;
  onMove: (pos: Position) => void;
  onRotate: () => void;
};

export const FieldBox = ({
  spec,
  position,
  orientation,
  scale,
  fieldSize_mm,
  onMove,
  onRotate,
}: Props) => {
  const footprint = getFootprintSizeMm(spec, orientation);

  const sizePxX = footprint.w * scale;
  const sizePxY = footprint.h * scale;

  const leftPx = position.x * scale;
  const bottomPx = position.y * scale;

  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: rect.bottom - e.clientY,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || e.buttons !== 1) return;

      const field = e.currentTarget.parentElement as HTMLDivElement;
      const fieldRect = field.getBoundingClientRect();

      const xPx = e.clientX - fieldRect.left - offsetRef.current.x;
      const yPx = fieldRect.bottom - e.clientY - offsetRef.current.y;

      const xMm = Math.max(
        0,
        Math.min(fieldSize_mm - footprint.w, xPx / scale)
      );
      const yMm = Math.max(
        0,
        Math.min(fieldSize_mm - footprint.h, yPx / scale)
      );

      onMove({ x: xMm, y: yMm });
    },
    [dragging, fieldSize_mm, scale, footprint, onMove]
  );

  return (
    <Box
      position="absolute"
      left={`${leftPx}px`}
      bottom={`${bottomPx}px`}
      width={`${sizePxX}px`}
      height={`${sizePxY}px`}
      bg={spec.color}
      opacity={0.8}
      border="2px solid white"
      cursor="grab"
      userSelect="none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => setDragging(false)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onRotate();
      }}
    >
      <Text fontWeight="bold" textAlign="center" color="white">
        {spec.type}
      </Text>
    </Box>
  );
};
