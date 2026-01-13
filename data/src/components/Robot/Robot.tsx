import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type PathNode = { x: number; y: number };

export const Robot = ({
  path,
  scale,
  fieldHeightPx,
}: {
  path: PathNode[];
  scale: number;
  fieldHeightPx: number;
}) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i >= path.length - 1) return;
    const t = setTimeout(() => setI((v) => v + 1), 800);
    return () => clearTimeout(t);
  }, [i, path]);

  if (!path.length) return null;
  const p = path[i];

  const x = p.x * scale;
  const y = fieldHeightPx - p.y * scale;

  return (
    <motion.div
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "red",
        left: x - 10,
        top: y - 10,
      }}
      animate={{
        left: x - 10,
        top: y - 10,
      }}
      transition={{ duration: 0.7, ease: "linear" }}
    />
  );
};
