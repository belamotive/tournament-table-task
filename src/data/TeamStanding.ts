import type { MatchResultType } from "./MatchResultEnum";

export type TeamStanding = {
  position: number;
  club: string;
  url: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  lastFive: MatchResultType[];
};
