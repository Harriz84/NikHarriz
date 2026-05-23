export type Position = "GK" | "DEF" | "MID" | "FWD";

export interface Team {
  id: string; // 3-letter code
  name: string;
  flag: string; // emoji
  group: string; // "A".."L"
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: Position;
}

export interface Match {
  id: string;
  group: string;
  matchday: number; // 1..3 (speelronde)
  homeId: string;
  awayId: string;
  date: string; // ISO datetime
}

export interface MatchScore {
  home: number;
  away: number;
}

export interface PlayerStat {
  apps: number;
  goals: number;
  assists: number;
  yellow: number;
  red: number;
  cleanSheets: number;
}

export interface Prediction {
  matchScores: Record<string, MatchScore>;
  groupOrder: Record<string, string[]>; // group -> ordered teamIds (pos 1..4)
  jokerGroups: string[];
  fantasyEleven: string[]; // playerIds, max 11, max 2 per country
  champion: string | null;
  topScorer: string | null;
  playerOfTournament: string | null;
}

export interface Participant {
  id: string;
  name: string;
  prediction: Prediction;
}

export interface Results {
  matchScores: Record<string, MatchScore>;
  playerStats: Record<string, PlayerStat>;
  groupOrder: Record<string, string[]>;
  champion: string | null;
  topScorer: string | null;
  playerOfTournament: string | null;
  published: boolean;
}
