export const MatchResultEnum = {
  Win: "win",
  Draw: "draw",
  Loss: "loss",
} as const;

export type MatchResultType =
  (typeof MatchResultEnum)[keyof typeof MatchResultEnum];
