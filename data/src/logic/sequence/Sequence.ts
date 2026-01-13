export type Command =
  | {
      type: "MOVE";
      x: number; // mm
      y: number; // mm
    }
  | {
      type: "WAIT";
      ms: number;
    };

export type Sequence = {
  version: 1;
  commands: Command[];
};
