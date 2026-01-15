import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type PathNode = {
  x: number; // mm
  y: number; // mm
};

type Props = {
  path: PathNode[];
  scale: number;
  fieldHeightPx: number;
};

const ROBOT_SIZE_PX = 20;

export const Robot = ({ path, scale, fieldHeightPx }: Props) => {
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

  // mm → px（FieldBoxと同一座標系）
  const leftPx = p.x * scale - ROBOT_SIZE_PX / 2;
  const bottomPx = p.y * scale - ROBOT_SIZE_PX / 2;

  // フィールド外に出ない保険
  const clampedLeft = Math.max(0, leftPx);
  const clampedBottom = Math.max(
    0,
    Math.min(fieldHeightPx - ROBOT_SIZE_PX, bottomPx)
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        width: ROBOT_SIZE_PX,
        height: ROBOT_SIZE_PX,
        borderRadius: "50%",
        backgroundColor: "red",
        zIndex: 100,
        left: clampedLeft,
        bottom: clampedBottom,
        pointerEvents: "none",
      }}
      animate={{
        left: clampedLeft,
        bottom: clampedBottom,
      }}
      transition={{
        duration: 0.7,
        ease: "linear",
      }}
    />
  );
};
