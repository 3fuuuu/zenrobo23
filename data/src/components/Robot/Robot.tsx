import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type PathNode = {
  x: number; // mm
  y: number; // mm
};

type Props = {
  path: PathNode[];
  scale: number;
};

export const Robot = ({ path, scale }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!path.length) return;
    if (index >= path.length - 1) return;

    const t = setTimeout(() => {
      setIndex((i) => i + 1);
    }, 800);

    return () => clearTimeout(t);
  }, [index, path]);

  if (!path.length) return null;

  const node = path[index];

  return (
    <motion.div
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "red",
        left: node.x * scale - 10,
        bottom: node.y * scale - 10,
        zIndex: 100,
      }}
      animate={{
        left: node.x * scale - 10,
        bottom: node.y * scale - 10,
      }}
      transition={{
        duration: 0.7,
        ease: "linear",
      }}
    />
  );
};
