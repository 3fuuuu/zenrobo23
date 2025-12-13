import { Box, Text } from "@chakra-ui/react";
import { useState, useCallback, useRef } from "react";
import type { BoxSpec, Position } from "./BoxType";

type Props = {
  spec: BoxSpec;
  position: Position;
  rotation: number;
  scale: number;
  fieldSize_mm: number;
  onMove: (pos: Position) => void;
  onRotate: (deg: number) => void;
};

export const FieldBox = ({
  spec,
  position,
  rotation,
  scale,
  fieldSize_mm,
  onMove,
  onRotate,
}: Props) => {
  const sizePxX = spec.sizeMm.x * scale;
  const sizePxY = spec.sizeMm.y * scale;

  const leftPx = position.x * scale;
  const bottomPx = position.y * scale;

  const [dragging, setDragging] = useState(false);
  const [rotating, setRotating] = useState(false);

  const offsetRef = useRef({ x: 0, y: 0 });
  const startAngleRef = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    if (e.shiftKey) {
      setRotating(true);
      startAngleRef.current =
        Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) - rotation;
    } else {
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: rect.bottom - e.clientY,
      };
      setDragging(true);
    }

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();

      if (rotating) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle =
          Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        onRotate(Math.round(angle - startAngleRef.current));
        return;
      }

      if (!dragging || e.buttons !== 1) return;

      const field = el.parentElement as HTMLDivElement;
      const fieldRect = field.getBoundingClientRect();

      const xPx = e.clientX - fieldRect.left - offsetRef.current.x;
      const yPx = fieldRect.bottom - e.clientY - offsetRef.current.y;

      const xMm = Math.max(
        0,
        Math.min(fieldSize_mm - spec.sizeMm.x, xPx / scale)
      );
      const yMm = Math.max(
        0,
        Math.min(fieldSize_mm - spec.sizeMm.y, yPx / scale)
      );

      onMove({ x: xMm, y: yMm });
    },
    [dragging, rotating, fieldSize_mm, scale, spec, onMove, onRotate]
  );

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    setRotating(false);
  };

  return (
    <Box
      position="absolute"
      left={`${leftPx}px`}
      bottom={`${bottomPx}px`}
      width={`${sizePxX}px`}
      height={`${sizePxY}px`}
      bg={`${spec.color}`}
      opacity={0.8}
      border="2px solid white"
      transform={`rotate(${rotation}deg)`}
      transformOrigin="center"
      cursor={rotating ? "crosshair" : "grab"}
      userSelect="none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Text fontWeight="bold" textAlign="center" color="white">
        {spec.type}
      </Text>
      {(dragging || rotating) && (
        <Box
          position="absolute"
          left="2px"
          bottom="2px"
          bg="rgba(0,0,0,0.6)"
          color="white"
          fontSize="10px"
          px={1}
          borderRadius="sm"
        >
          x:{position.x.toFixed(0)}
          <br />
          y:{position.y.toFixed(0)}
          <br />
          r:{rotation}°
        </Box>
      )}
    </Box>
  );
};
