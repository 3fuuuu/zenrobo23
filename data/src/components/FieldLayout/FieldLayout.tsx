import { Box, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { BOX_SPECS, type Position } from "../FieldBox/BoxType";
import { FieldArea } from "../FieldArea/FieldArea";

export type FieldBoxState = {
  id: string;
  type: keyof typeof BOX_SPECS;
  pos: Position;
};

type AddBoxEvent = CustomEvent<keyof typeof BOX_SPECS>;

export const FieldLayout = () => {
  const [boxes, setBoxes] = useState<FieldBoxState[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as AddBoxEvent;

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
      <VStack w="180px" minH="700px" bg="gray.700" p={4} align="stretch">
        <Text color="white" fontWeight="bold">
          Box Palette
        </Text>

        {Object.keys(BOX_SPECS).map((key) => (
          <Box
            key={key}
            bg="orange"
            p={3}
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "orange.300" }}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent<keyof typeof BOX_SPECS>("ADD_BOX", {
                  detail: key as keyof typeof BOX_SPECS,
                })
              )
            }
          >
            {key}
          </Box>
        ))}
      </VStack>

      <FieldArea boxes={boxes} setBoxes={setBoxes} />

      <VStack w="250px" bg="gray.800" p={4} align="stretch">
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
