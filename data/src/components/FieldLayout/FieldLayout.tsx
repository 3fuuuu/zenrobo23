import { Box, VStack, Text } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { BOX_SPECS, type Position } from "../FieldBox/BoxType";
import { FieldArea } from "../FieldArea/FieldArea";

export type BoxOrientation = "NORMAL" | "ROTATED_90" | "FLIPPED_YZ";

export type FieldBoxState = {
  id: number;
  type: keyof typeof BOX_SPECS;
  pos: Position;
  rotation: number;
  orientation: BoxOrientation;
};

export const FieldLayout = () => {
  const [boxes, setBoxes] = useState<FieldBoxState[]>([]);
  const idCounterRef = useRef(1);

  const addBox = (type: keyof typeof BOX_SPECS) => {
    setBoxes((prev) => [
      ...prev,
      {
        id: idCounterRef.current++,
        type,
        pos: { x: 0, y: 0 },
        rotation: 0,
        orientation: "NORMAL",
      },
    ]);
  };

  return (
    <Box display="flex" width="100vw" height="100vh" overflow="hidden">
      <VStack flex="1" minW="180px" bg="gray.800" p={4} align="stretch">
        <Text color="white" fontWeight="bold">
          Box Palette
        </Text>

        {Object.entries(BOX_SPECS).map(([key, spec]) => (
          <Box
            key={key}
            bg={spec.color}
            p={3}
            borderRadius="md"
            cursor="pointer"
            color="white"
            fontWeight="bold"
            _hover={{ opacity: 0.8 }}
            onClick={() => addBox(key as keyof typeof BOX_SPECS)}
          >
            {key}
          </Box>
        ))}
      </VStack>

      <Box
        flex="0 0 700px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <FieldArea boxes={boxes} setBoxes={setBoxes} />
      </Box>

      <VStack
        flex="1"
        minW="250px"
        minH={0}
        bg="gray.800"
        p={4}
        align="stretch"
        overflowY="auto"
      >
        <Text color="white" fontWeight="bold">
          Box Positions
        </Text>

        {boxes.map((b) => {
          const spec = BOX_SPECS[b.type];
          return (
            <Box
              key={b.id}
              bg={spec.color}
              color="white"
              p={2}
              borderRadius="md"
            >
              <Text>ID: {b.id}</Text>
              <Text>Type: {b.type}</Text>
              <Text>X: {b.pos.x.toFixed(0)} mm</Text>
              <Text>Y: {b.pos.y.toFixed(0)} mm</Text>
              <Text>Orientation: {b.orientation}</Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};
