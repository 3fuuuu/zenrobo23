import { Box } from "framer-motion";
import { FieldBoxState } from "../FieldLayout/FieldLayout";
import { useEffect, useState } from "react";

type Props = {
  path: FieldBoxState[];
  scale: number;
};

export const Robot = ({ path, scale }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= path.length - 1) return;
    const t = setTimeout(() => setIndex((i) => i + 1), 800);
    return () => clearTimeout(t);
  }, [index, path]);

  const box = path[index];
  const centerX = box.pos.x * scale;
  const centerY = box.pos.y * scale;

  return (
    <Box
      position="absolute"
      left={`${centerX}px`}
      bottom={`${centerY}px`}
      width="20px"
      height="20px"
      bg="red"
      borderRadius="50%"
      transition="all 0.7s linear"
    />
  );
};
