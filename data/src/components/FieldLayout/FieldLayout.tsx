import { Box, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { BOX_SPECS, type Position } from "../FieldBox/BoxType";
import { FieldArea } from "../FieldArea/FieldArea";

export type FieldBoxState = {
  id: string;
  type: string;
  pos: Position;
};

export const FieldLayout = () => {
  const [boxes, setBoxes] = useState<FieldBoxState[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const type = e.detail;
      const spec = BOX_SPECS[type];
      if (!spec) return;

      const newBox: FieldBoxState = {
        id: `${type}_${Date.now()}`,
        type,
        pos: { x: 0, y: 0 },
      };

      setBoxes((prev) => [...prev, newBox]);
    };

    window.addEventListener("ADD_BOX", handler);
    return () => window.removeEventListener("ADD_BOX", handler);
  }, []);

  return (
    <Box display="flex" flexDirection="row" gap={4}>
      <VStack
        w="180px"
        minH="700px"
        bg="gray.700"
        p={4}
        padding={4}
        align="stretch"
      >
        <Text color="white" fontWeight="bold">
          Box Palette
        </Text>
        {Object.values(BOX_SPECS).map((spec) => (
          <Box
            key={spec.type}
            bg="orange"
            p={3}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "orange.300" }}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("ADD_BOX", { detail: spec.type })
              )
            }
          >
            {spec.type}
          </Box>
        ))}
      </VStack>

      <FieldArea boxes={boxes} setBoxes={setBoxes} />

      <VStack w="250px" bg="gray.800" p={4} align="stretch" padding={4}>
        <Text color="white" fontWeight="bold">
          Box Positions
        </Text>

        {boxes.map((b) => (
          <Box key={b.id} bg="gray.600" color="white" p={2} borderRadius="md">
            <Text>ID: {b.id}</Text>
            <Text>Type: {b.type}</Text>
            <Text>X: {b.pos.x.toFixed(1)} mm</Text>
            <Text>Y: {b.pos.y.toFixed(1)} mm</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
