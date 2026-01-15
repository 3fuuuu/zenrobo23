import type { FieldBoxState } from "../../components/types/FieldBoxState";
import { getCenter } from "./ports";

export const planPath = (ids: number[], boxes: FieldBoxState[]) =>
  ids.map((id) => getCenter(boxes.find((b) => b.id === id)!));
