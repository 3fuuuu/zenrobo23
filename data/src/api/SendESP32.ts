import type { Sequence } from "../components/types/Sequence";

export const sendESP32 = async (sequence: Sequence) => {
  await fetch("http://192.168.4.1/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sequence),
  });
};
