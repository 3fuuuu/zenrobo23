export type MoveCommand = {
  type: "MOVE";
  x: number; // mm
  y: number; // mm
};

export type WaitCommand = {
  type: "WAIT";
  ms: number;
};

export type Command = MoveCommand | WaitCommand;

export type Sequence = Command[];
