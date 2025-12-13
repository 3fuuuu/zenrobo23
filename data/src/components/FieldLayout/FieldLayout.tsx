import { Box, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { BOX_SPECS, type Position } from "../FieldBox/BoxType";
import { FieldArea } from "../FieldArea/FieldArea";

export type FieldBoxState = {
  id: string;
  type: keyof typeof BOX_SPECS;
  pos: Position;
  rotation: number;
};

export const FieldLayout = () => {
  const [boxes, setBoxes] = useState<FieldBoxState[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<keyof typeof BOX_SPECS>;
      const type = e.detail;
      if (!BOX_SPECS[type]) return;

      setBoxes((prev) => [
        ...prev,
        {
          id: `${type}_${Date.now()}`,
          type,
          pos: { x: 0, y: 0 },
          rotation: 0,
        },
      ]);
    };

    window.addEventListener("ADD_BOX", handler);
    return () => window.removeEventListener("ADD_BOX", handler);
  }, []);

  return (
    <Box display="flex" width="100vw" height="100vh" overflow="hidden">
      <VStack flex="1" minW="180px" bg="gray.700" p={4} align="stretch">
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
            onClick={() =>
              window.dispatchEvent(new CustomEvent("ADD_BOX", { detail: key }))
            }
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
              <Text>X: {b.pos.x.toFixed(1)} mm</Text>
              <Text>Y: {b.pos.y.toFixed(1)} mm</Text>
              <Text>R: {b.rotation}°</Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};
