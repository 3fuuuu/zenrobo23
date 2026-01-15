import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type PathNode = {
  x: number; // mm
  y: number; // mm
};

type Props = {
  path: PathNode[];
  scale: number;
};

const ROBOT_SIZE_PX = 20;

export const Robot = ({ path, scale }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (path.length === 0) return;
    setIndex(0);
  }, [path]);

  useEffect(() => {
    if (index >= path.length - 1) return;

    const t = setTimeout(() => {
      setIndex((i) => i + 1);
    }, 800);

    return () => clearTimeout(t);
  }, [index, path]);

  if (!path.length) return null;

  const p = path[index];

  const leftPx = p.x * scale - ROBOT_SIZE_PX / 2;
  const bottomPx = index === 0 ? 0 : p.y * scale - ROBOT_SIZE_PX / 2;

  return (
    <motion.div
      style={{
        position: "absolute",
        width: ROBOT_SIZE_PX,
        height: ROBOT_SIZE_PX,
        borderRadius: "50%",
        backgroundColor: "red",
        zIndex: 100,
        left: leftPx,
        bottom: bottomPx,
        pointerEvents: "none",
      }}
      animate={{
        left: leftPx,
        bottom: bottomPx,
      }}
      transition={{
        duration: 0.7,
        ease: "linear",
      }}
    />
  );
};
