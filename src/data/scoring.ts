import type { Position } from "../types";

// ---- Fantasy: punten per speler ----
export const FANTASY_SCORING = {
  appearance: 1, // speelt mee
  assist: 3,
  yellow: -1,
  red: -3,
  cleanSheetGK: 6, // alleen keeper
  // Een goal levert meer op naarmate je verder van de spits zit:
  // verdediger > middenvelder > aanvaller (keeper goal = zeldzaam, hoogst).
  goalByPosition: {
    GK: 18,
    DEF: 15,
    MID: 12,
    FWD: 10,
  } as Record<Position, number>,
};

// ---- WK Pool: punten per wedstrijdvoorspelling ----
export const POOL_SCORING = {
  exact: 5, // exacte uitslag goed
  result: 2, // juiste winnaar/gelijkspel (maar niet exact)
};

// ---- Groepsstand voorspellen ----
export const GROUP_SCORING = {
  perCorrectPosition: 3, // per team op de juiste plek (1..4)
  perfectBonus: 5, // hele groepsvolgorde exact goed
};

// ---- Specials ----
export const SPECIAL_SCORING = {
  champion: 25,
  topScorer: 20,
  playerOfTournament: 20,
};

export const MAX_PER_COUNTRY = 2;
export const SQUAD_SIZE = 11;

// ---- Opstellingen (1 keeper + onderstaande verdeling) ----
export const FORMATIONS: Record<string, { DEF: number; MID: number; FWD: number }> = {
  "4-3-3": { DEF: 4, MID: 3, FWD: 3 },
  "4-4-2": { DEF: 4, MID: 4, FWD: 2 },
  "3-4-3": { DEF: 3, MID: 4, FWD: 3 },
  "3-5-2": { DEF: 3, MID: 5, FWD: 2 },
  "5-3-2": { DEF: 5, MID: 3, FWD: 2 },
  "5-4-1": { DEF: 5, MID: 4, FWD: 1 },
};
export const DEFAULT_FORMATION = "4-3-3";
export const FORMATION_LIST = Object.keys(FORMATIONS);

// De aanvoerder levert dubbele punten op.
export const CAPTAIN_MULTIPLIER = 2;

// ---- Extra toernooivragen (totalen) ----
// tiers: [maxVerschil, punten] — eerste passende tier telt.
export const TOTAL_QUESTIONS = [
  {
    key: "totalGoals" as const,
    label: "Totaal goals",
    hint: "Hoeveel goals vallen er in het hele toernooi?",
    tiers: [
      [0, 15],
      [3, 10],
      [6, 6],
      [12, 3],
    ] as [number, number][],
  },
  {
    key: "totalYellow" as const,
    label: "Gele kaarten",
    hint: "Hoeveel gele kaarten in totaal?",
    tiers: [
      [0, 15],
      [5, 10],
      [12, 6],
      [25, 3],
    ] as [number, number][],
  },
  {
    key: "totalRed" as const,
    label: "Rode kaarten",
    hint: "Hoeveel rode kaarten in totaal?",
    tiers: [
      [0, 15],
      [1, 10],
      [3, 6],
      [6, 3],
    ] as [number, number][],
  },
];
