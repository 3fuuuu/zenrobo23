import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { BOX_SPECS } from "../FieldBox/BoxType";
import { FieldArea } from "../FieldArea/FieldArea";
import type { FieldBoxState } from "../types/FieldBoxState";
import { buildGraph } from "../../logic/Route/graph";
import { bfs, type PathNode } from "../../logic/BFS";
import { Robot } from "../Robot/Robot";
import { pathToSequence } from "../../logic/sequence/pathToSequence";
import { sendESP32 } from "../../api/SendESP32";

export const FieldLayout = () => {
  const [boxes, setBoxes] = useState<FieldBoxState[]>([]);
  const [path, setPath] = useState<PathNode[]>([]);
  const idCounterRef = useRef(1);

  const FIELD_MM = 7000;
  const FIELD_PX = 700;
  const scale = FIELD_PX / FIELD_MM;

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

  const onStart = async () => {
    const start = boxes.find((b) => b.role === "START");
    const goal = boxes.find((b) => b.role === "GOAL");
    if (!start || !goal) return;

    const graph = buildGraph(boxes);
    const pathNodes = bfs(graph, boxes, start.id, goal.id);
    if (!pathNodes.length) return;

    setPath(pathNodes);

    const sequence = pathToSequence(pathNodes);
    await sendESP32(sequence);
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

        <Button mt={4} colorScheme="green" onClick={onStart}>
          START
        </Button>
      </VStack>

      <Box
        flex="0 0 700px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <FieldArea boxes={boxes} setBoxes={setBoxes}>
          <Robot path={path} scale={scale} />
        </FieldArea>
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
              {b.role && <Text>Role: {b.role}</Text>}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};
