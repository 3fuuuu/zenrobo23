import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useState, useCallback, useRef } from "react";
import type { BoxSpec, Position } from "./BoxType";
import type { BoxOrientation } from "../types/FieldBoxState";
import { getFootprintSizeMm } from "./utils";

type Props = {
  spec: BoxSpec;
  position: Position;
  orientation: BoxOrientation;
  scale: number;
  fieldSize_mm: number;
  role?: "START" | "GOAL";
  onMove: (pos: Position) => void;
  onRotate: () => void;
  onSetRole: (role: "START" | "GOAL") => void;
};

export const FieldBox = ({
  spec,
  position,
  orientation,
  scale,
  fieldSize_mm,
  role,
  onMove,
  onRotate,
  onSetRole,
}: Props) => {
  const footprint = getFootprintSizeMm(spec, orientation);

  const sizePxX = footprint.w * scale;
  const sizePxY = footprint.h * scale;
  const leftPx = position.x * scale;
  const bottomPx = position.y * scale;

  const [dragging, setDragging] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
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
      border="2px solid white"
      opacity={0.85}
      cursor="grab"
      userSelect="none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => setDragging(false)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onRotate();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowRoleMenu((v) => !v);
      }}
    >
      <Text fontWeight="bold" textAlign="center" color="white">
        {spec.type}
      </Text>

      {showRoleMenu && (
        <VStack
          position="absolute"
          top="-44px"
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          border="1px solid gray"
          p={1}
          gap={1}
          zIndex={10}
        >
          <Button
            size="xs"
            onClick={() => {
              onSetRole("START");
              setShowRoleMenu(false);
            }}
          >
            START
          </Button>
          <Button
            size="xs"
            onClick={() => {
              onSetRole("GOAL");
              setShowRoleMenu(false);
            }}
          >
            GOAL
          </Button>
        </VStack>
      )}

      {role === "START" && (
        <Box
          position="absolute"
          bottom="-26px"
          left="50%"
          transform="translateX(-50%)"
          bg="green.400"
          color="white"
          px={2}
          fontSize="xs"
          borderRadius="md"
        >
          START
        </Box>
      )}

      {role === "GOAL" && (
        <Box
          position="absolute"
          top="-26px"
          left="50%"
          transform="translateX(-50%)"
          bg="red.400"
          color="white"
          px={2}
          fontSize="xs"
          borderRadius="md"
        >
          GOAL
        </Box>
      )}
    </Box>
  );
};
