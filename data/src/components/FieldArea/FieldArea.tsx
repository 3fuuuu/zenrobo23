import { Box } from "@chakra-ui/react";
import { type FieldBoxState } from "../FieldLayout/FieldLayout";
import { BOX_SPECS, type Position } from "../FieldBox/BoxType";
import { FieldBox } from "../FieldBox/FieldBox";
type Props = {
  boxes: FieldBoxState[];
  setBoxes: React.Dispatch<React.SetStateAction<FieldBoxState[]>>;
};
export const FieldArea = ({ boxes, setBoxes }: Props) => {
  const fieldSize_mm = 8000;
  const scale = 0.1;
  const fieldSize_px = fieldSize_mm * scale;

  const updateBoxPos = (id: string, pos: Position) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, pos } : b)));
  };

  return (
    <Box w={fieldSize_px} h={fieldSize_px} bg="yellow.100" position="relative">
      {boxes.map((b) => {
        const spec = BOX_SPECS[b.type];
        return (
          <FieldBox
            key={b.id}
            spec={spec}
            position={b.pos}
            rotation={b.rotation}
            scale={scale}
            fieldSize_mm={fieldSize_mm}
            onMove={(pos) => updateBoxPos(b.id, pos)}
            onRotate={(deg) =>
              setBoxes((prev) =>
                prev.map((x) => (x.id === b.id ? { ...x, rotation: deg } : x))
              )
            }
          />
        );
      })}
    </Box>
  );
};
