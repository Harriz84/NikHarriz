import type { Participant, PlayerStat, Results } from "./types";
import { playersById } from "./data/players";
import { GROUPS } from "./data/teams";
import { MATCHES } from "./data/matches";
import {
  FANTASY_SCORING,
  GROUP_SCORING,
  POOL_SCORING,
  SPECIAL_SCORING,
  TOTAL_QUESTIONS,
} from "./data/scoring";

const sign = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0);

export function playerPoints(stat: PlayerStat, position: string): number {
  let pts = 0;
  pts += stat.apps * FANTASY_SCORING.appearance;
  pts += stat.assists * FANTASY_SCORING.assist;
  pts += stat.yellow * FANTASY_SCORING.yellow;
  pts += stat.red * FANTASY_SCORING.red;
  pts +=
    stat.goals *
    (FANTASY_SCORING.goalByPosition[
      position as keyof typeof FANTASY_SCORING.goalByPosition
    ] ?? FANTASY_SCORING.goalByPosition.FWD);
  if (position === "GK") pts += stat.cleanSheets * FANTASY_SCORING.cleanSheetGK;
  return pts;
}

const EMPTY_STAT: PlayerStat = {
  apps: 0,
  goals: 0,
  assists: 0,
  yellow: 0,
  red: 0,
  cleanSheets: 0,
};

// Points for one predicted match score vs the actual score.
export function matchPoints(
  pred: { home: number; away: number } | undefined,
  actual: { home: number; away: number } | undefined,
): number {
  if (!pred || !actual) return 0;
  if (pred.home === actual.home && pred.away === actual.away)
    return POOL_SCORING.exact;
  if (sign(pred.home - pred.away) === sign(actual.home - actual.away))
    return POOL_SCORING.result;
  return 0;
}

export interface ScoreBreakdown {
  pool: number; // wedstrijdvoorspellingen (incl. jokers)
  groups: number; // groepsstanden
  fantasy: number; // elftal
  specials: number; // kampioen / topscorer / speler vh toernooi
  total: number;
}

function totalPoints(
  pred: number | null,
  actual: number | null,
  tiers: [number, number][],
): number {
  if (pred == null || actual == null) return 0;
  const diff = Math.abs(pred - actual);
  for (const [maxDiff, pts] of tiers) if (diff <= maxDiff) return pts;
  return 0;
}

export function scoreParticipant(p: Participant, r: Results): ScoreBreakdown {
  const pred = p.prediction;
  const roundBoost = pred.roundBoost ?? {};
  const jokerPositions = pred.jokerPositions ?? {};

  // --- Pool: per wedstrijd, met boost-team (dubbele punten per ronde) ---
  let pool = 0;
  for (const m of MATCHES) {
    let pts = matchPoints(pred.matchScores[m.id], r.matchScores[m.id]);
    const boostTeam = roundBoost[m.matchday];
    if (boostTeam && (boostTeam === m.homeId || boostTeam === m.awayId)) {
      pts *= 2;
    }
    pool += pts;
  }

  // --- Groepsstanden, met joker-positie (dubbele punten op 1 plek) ---
  let groups = 0;
  for (const group of GROUPS) {
    const predicted = pred.groupOrder[group];
    const actual = r.groupOrder[group];
    if (!predicted || !actual || actual.length < 4) continue;
    let correct = 0;
    const joker = jokerPositions[group];
    for (let i = 0; i < 4; i++) {
      if (predicted[i] && predicted[i] === actual[i]) {
        correct++;
        let pts = GROUP_SCORING.perCorrectPosition;
        if (joker === i) pts *= 2;
        groups += pts;
      }
    }
    if (correct === 4) groups += GROUP_SCORING.perfectBonus;
  }

  // --- Fantasy elftal, met aanvoerder (dubbele punten) ---
  let fantasy = 0;
  for (const playerId of pred.fantasyEleven) {
    const player = playersById[playerId];
    if (!player) continue;
    const stat = r.playerStats[playerId] ?? EMPTY_STAT;
    let pts = playerPoints(stat, player.position);
    if (pred.captain && pred.captain === playerId) pts *= 2;
    fantasy += pts;
  }

  // --- Specials + extra toernooivragen ---
  let specials = 0;
  if (pred.champion && pred.champion === r.champion)
    specials += SPECIAL_SCORING.champion;
  if (pred.topScorer && pred.topScorer === r.topScorer)
    specials += SPECIAL_SCORING.topScorer;
  if (pred.playerOfTournament && pred.playerOfTournament === r.playerOfTournament)
    specials += SPECIAL_SCORING.playerOfTournament;
  for (const q of TOTAL_QUESTIONS) {
    specials += totalPoints(pred[q.key], r[q.key], q.tiers);
  }

  return {
    pool,
    groups,
    fantasy,
    specials,
    total: pool + groups + fantasy + specials,
  };
}
