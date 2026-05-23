import type { Match } from "../types";
import { GROUPS, teamsInGroup } from "./teams";

// Round-robin pairings for a group of 4, split over 3 matchdays (speelrondes).
const ROUNDS: [number, number][][] = [
  [
    [0, 1],
    [2, 3],
  ], // matchday 1
  [
    [0, 2],
    [3, 1],
  ], // matchday 2
  [
    [3, 0],
    [1, 2],
  ], // matchday 3
];

// Kick-off times spread across the day (Dutch local time feel).
const KICKOFFS = ["18:00", "21:00", "03:00", "00:00"];

function buildMatches(): Match[] {
  const matches: Match[] = [];
  // Group stage of WK26 runs ~11–27 June 2026.
  const matchdayStart = ["2026-06-11", "2026-06-18", "2026-06-24"];

  GROUPS.forEach((group, gIndex) => {
    const teams = teamsInGroup(group);
    ROUNDS.forEach((pairs, md) => {
      pairs.forEach((pair, pIndex) => {
        const [hi, ai] = pair;
        const base = new Date(matchdayStart[md]);
        // Stagger dates a little so a matchday spans a few days.
        base.setDate(base.getDate() + Math.floor((gIndex * 2 + pIndex) / 4));
        const time = KICKOFFS[(gIndex + pIndex) % KICKOFFS.length];
        const date = `${base.toISOString().slice(0, 10)}T${time}:00`;
        matches.push({
          id: `${group}-md${md + 1}-${pIndex}`,
          group,
          matchday: md + 1,
          homeId: teams[hi].id,
          awayId: teams[ai].id,
          date,
        });
      });
    });
  });
  return matches;
}

export const MATCHES: Match[] = buildMatches();

export function matchesByMatchday(md: number): Match[] {
  return MATCHES.filter((m) => m.matchday === md);
}

export const matchesById: Record<string, Match> = Object.fromEntries(
  MATCHES.map((m) => [m.id, m]),
);
