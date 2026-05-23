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
