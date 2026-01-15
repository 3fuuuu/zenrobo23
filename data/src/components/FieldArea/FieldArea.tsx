import { Box } from "@chakra-ui/react";
import type { Position } from "../FieldBox/BoxType";
import { BOX_SPECS } from "../FieldBox/BoxType";
import { FieldBox } from "../FieldBox/FieldBox";
import { getFootprintSizeMm } from "../FieldBox/utils";
import type { FieldBoxState, BoxOrientation } from "../types/FieldBoxState";

type Props = {
  boxes: FieldBoxState[];
  setBoxes: React.Dispatch<React.SetStateAction<FieldBoxState[]>>;
  children?: React.ReactNode;
};

const isOverlap = (
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) =>
  !(
    a.x + a.w <= b.x ||
    a.x >= b.x + b.w ||
    a.y + a.h <= b.y ||
    a.y >= b.y + b.h
  );

const nextOrientation = (o: BoxOrientation): BoxOrientation => {
  switch (o) {
    case "NORMAL":
      return "ROTATED_90";
    case "ROTATED_90":
      return "FLIPPED_YZ";
    case "FLIPPED_YZ":
      return "NORMAL";
  }
};

export const FieldArea = ({ boxes, setBoxes, children }: Props) => {
  const fieldSize_mm = 7000;
  const scale = 0.1;

  const tryMoveBox = (id: number, nextPos: Position) => {
    setBoxes((prev) => {
      const moving = prev.find((b) => b.id === id);
      if (!moving) return prev;

      const spec = BOX_SPECS[moving.type];
      const size = getFootprintSizeMm(spec, moving.orientation);

      const nextRect = {
        x: nextPos.x,
        y: nextPos.y,
        w: size.w,
        h: size.h,
      };

      const hit = prev.some((b) => {
        if (b.id === id) return false;
        const s = BOX_SPECS[b.type];
        const other = getFootprintSizeMm(s, b.orientation);
        return isOverlap(nextRect, {
          x: b.pos.x,
          y: b.pos.y,
          w: other.w,
          h: other.h,
        });
      });

      if (hit) return prev;

      return prev.map((b) => (b.id === id ? { ...b, pos: nextPos } : b));
    });
  };

  const rotateBox = (id: number) => {
    setBoxes((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, orientation: nextOrientation(b.orientation) } : b
      )
    );
  };

  const setRole = (id: number, role: "START" | "GOAL") => {
    setBoxes((prev) =>
      prev.map((b) => {
        if (b.role === role && b.id !== id) {
          return { ...b, role: undefined };
        }
        if (b.id === id) {
          return { ...b, role };
        }
        return b;
      })
    );
  };

  return (
    <Box
      width={`${fieldSize_mm * scale}px`}
      height={`${fieldSize_mm * scale}px`}
      bg="yellow.100"
      position="relative"
    >
      {boxes.map((b) => {
        const spec = BOX_SPECS[b.type];

        return (
          <FieldBox
            key={b.id}
            spec={spec}
            position={b.pos}
            orientation={b.orientation}
            role={b.role}
            scale={scale}
            fieldSize_mm={fieldSize_mm}
            onMove={(pos) => tryMoveBox(b.id, pos)}
            onRotate={() => rotateBox(b.id)}
            onSetRole={(role) => setRole(b.id, role)}
          />
        );
      })}
      {children}
    </Box>
  );
};
