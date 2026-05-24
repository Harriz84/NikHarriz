import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  MatchScore,
  Participant,
  Position,
  PlayerStat,
  Prediction,
  Results,
} from "./types";
import { GROUPS, teamsInGroup } from "./data/teams";
import {
  DEFAULT_FORMATION,
  FORMATIONS,
  MAX_PER_COUNTRY,
} from "./data/scoring";
import { playersById } from "./data/players";

type TotalKey = "totalGoals" | "totalYellow" | "totalRed";
type SpecialKey = "champion" | "topScorer" | "playerOfTournament";

function capFor(formation: string, pos: Position): number {
  if (pos === "GK") return 1;
  const f = FORMATIONS[formation] ?? FORMATIONS[DEFAULT_FORMATION];
  return f[pos];
}

function emptyPrediction(): Prediction {
  const groupOrder: Record<string, string[]> = {};
  for (const g of GROUPS) groupOrder[g] = teamsInGroup(g).map((t) => t.id);
  return {
    formation: DEFAULT_FORMATION,
    matchScores: {},
    groupOrder,
    jokerPositions: {},
    roundBoost: {},
    fantasyEleven: [],
    captain: null,
    champion: null,
    topScorer: null,
    playerOfTournament: null,
    totalGoals: null,
    totalYellow: null,
    totalRed: null,
  };
}

function emptyResults(): Results {
  // Leeg starten: een groep telt pas mee als de beheerder de echte
  // eindstand invoert (anders zou de standaardvolgorde al punten geven).
  return {
    matchScores: {},
    playerStats: {},
    groupOrder: {},
    champion: null,
    topScorer: null,
    playerOfTournament: null,
    totalGoals: null,
    totalYellow: null,
    totalRed: null,
    published: false,
  };
}

let idCounter = 0;
function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

interface State {
  participants: Participant[];
  activeId: string;
  results: Results;
  adminMode: boolean;

  // participant management
  addParticipant: (name: string) => void;
  renameParticipant: (id: string, name: string) => void;
  removeParticipant: (id: string) => void;
  setActive: (id: string) => void;
  setAdminMode: (on: boolean) => void;

  // editing the active participant's prediction
  setMatchScore: (matchId: string, score: MatchScore) => void;
  setGroupOrder: (group: string, order: string[]) => void;
  setJokerPosition: (group: string, position: number | null) => void;
  setRoundBoost: (matchday: number, teamId: string | null) => void;
  setFormation: (formation: string) => void;
  toggleFantasyPlayer: (playerId: string) => void;
  setCaptain: (playerId: string | null) => void;
  setSpecial: (key: SpecialKey, value: string | null) => void;
  setPredTotal: (key: TotalKey, value: number | null) => void;

  // official results (admin)
  setResultScore: (matchId: string, score: MatchScore) => void;
  setResultGroupOrder: (group: string, order: string[]) => void;
  setPlayerStat: (playerId: string, stat: Partial<PlayerStat>) => void;
  setResultSpecial: (key: SpecialKey, value: string | null) => void;
  setResultTotal: (key: TotalKey, value: number | null) => void;
  togglePublished: () => void;

  resetAll: () => void;
}

function withActive(
  state: State,
  fn: (p: Prediction) => Prediction,
): Partial<State> {
  return {
    participants: state.participants.map((p) =>
      p.id === state.activeId ? { ...p, prediction: fn(p.prediction) } : p,
    ),
  };
}

const firstId = newId("p");

export const useStore = create<State>()(
  persist(
    (set) => ({
      participants: [
        { id: firstId, name: "Speler 1", prediction: emptyPrediction() },
      ],
      activeId: firstId,
      results: emptyResults(),
      adminMode: false,

      addParticipant: (name) =>
        set((s) => {
          const id = newId("p");
          return {
            participants: [
              ...s.participants,
              {
                id,
                name: name.trim() || `Speler ${s.participants.length + 1}`,
                prediction: emptyPrediction(),
              },
            ],
            activeId: id,
          };
        }),

      renameParticipant: (id, name) =>
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === id ? { ...p, name: name.trim() || p.name } : p,
          ),
        })),

      removeParticipant: (id) =>
        set((s) => {
          if (s.participants.length <= 1) return {};
          const participants = s.participants.filter((p) => p.id !== id);
          const activeId = s.activeId === id ? participants[0].id : s.activeId;
          return { participants, activeId };
        }),

      setActive: (id) => set({ activeId: id }),
      setAdminMode: (on) => set({ adminMode: on }),

      setMatchScore: (matchId, score) =>
        set((s) =>
          withActive(s, (pred) => ({
            ...pred,
            matchScores: { ...pred.matchScores, [matchId]: score },
          })),
        ),

      setGroupOrder: (group, order) =>
        set((s) =>
          withActive(s, (pred) => ({
            ...pred,
            groupOrder: { ...pred.groupOrder, [group]: order },
          })),
        ),

      setJokerPosition: (group, position) =>
        set((s) =>
          withActive(s, (pred) => {
            const next = { ...(pred.jokerPositions ?? {}) };
            if (position === null || next[group] === position) delete next[group];
            else next[group] = position;
            return { ...pred, jokerPositions: next };
          }),
        ),

      setRoundBoost: (matchday, teamId) =>
        set((s) =>
          withActive(s, (pred) => {
            const next = { ...(pred.roundBoost ?? {}) };
            if (teamId === null || next[matchday] === teamId)
              delete next[matchday];
            else next[matchday] = teamId;
            return { ...pred, roundBoost: next };
          }),
        ),

      setFormation: (formation) =>
        set((s) =>
          withActive(s, (pred) => {
            const counts: Record<Position, number> = {
              GK: 0,
              DEF: 0,
              MID: 0,
              FWD: 0,
            };
            const kept: string[] = [];
            for (const id of pred.fantasyEleven) {
              const pos = playersById[id]?.position;
              if (!pos) continue;
              if (counts[pos] < capFor(formation, pos)) {
                kept.push(id);
                counts[pos]++;
              }
            }
            const captain =
              pred.captain && kept.includes(pred.captain) ? pred.captain : null;
            return { ...pred, formation, fantasyEleven: kept, captain };
          }),
        ),

      toggleFantasyPlayer: (playerId) =>
        set((s) =>
          withActive(s, (pred) => {
            const player = playersById[playerId];
            if (!player) return pred;
            if (pred.fantasyEleven.includes(playerId)) {
              return {
                ...pred,
                fantasyEleven: pred.fantasyEleven.filter((id) => id !== playerId),
                captain: pred.captain === playerId ? null : pred.captain,
              };
            }
            // positie-cap volgens opstelling
            const samePos = pred.fantasyEleven.filter(
              (id) => playersById[id]?.position === player.position,
            ).length;
            if (samePos >= capFor(pred.formation, player.position)) return pred;
            // max 2 per land
            const sameCountry = pred.fantasyEleven.filter(
              (id) => playersById[id]?.teamId === player.teamId,
            ).length;
            if (sameCountry >= MAX_PER_COUNTRY) return pred;
            return { ...pred, fantasyEleven: [...pred.fantasyEleven, playerId] };
          }),
        ),

      setCaptain: (playerId) =>
        set((s) =>
          withActive(s, (pred) => {
            if (playerId !== null && !pred.fantasyEleven.includes(playerId))
              return pred;
            return { ...pred, captain: pred.captain === playerId ? null : playerId };
          }),
        ),

      setSpecial: (key, value) =>
        set((s) => withActive(s, (pred) => ({ ...pred, [key]: value }))),

      setPredTotal: (key, value) =>
        set((s) => withActive(s, (pred) => ({ ...pred, [key]: value }))),

      setResultScore: (matchId, score) =>
        set((s) => ({
          results: {
            ...s.results,
            matchScores: { ...s.results.matchScores, [matchId]: score },
          },
        })),

      setResultGroupOrder: (group, order) =>
        set((s) => ({
          results: {
            ...s.results,
            groupOrder: { ...s.results.groupOrder, [group]: order },
          },
        })),

      setPlayerStat: (playerId, stat) =>
        set((s) => {
          const prev = s.results.playerStats[playerId] ?? {
            apps: 0,
            goals: 0,
            assists: 0,
            yellow: 0,
            red: 0,
            cleanSheets: 0,
          };
          return {
            results: {
              ...s.results,
              playerStats: {
                ...s.results.playerStats,
                [playerId]: { ...prev, ...stat },
              },
            },
          };
        }),

      setResultSpecial: (key, value) =>
        set((s) => ({ results: { ...s.results, [key]: value } })),

      setResultTotal: (key, value) =>
        set((s) => ({ results: { ...s.results, [key]: value } })),

      togglePublished: () =>
        set((s) => ({
          results: { ...s.results, published: !s.results.published },
        })),

      resetAll: () => {
        const id = newId("p");
        set({
          participants: [
            { id, name: "Speler 1", prediction: emptyPrediction() },
          ],
          activeId: id,
          results: emptyResults(),
          adminMode: false,
        });
      },
    }),
    { name: "wk26-pool-v2" },
  ),
);

export function activeParticipant(s: State): Participant {
  return s.participants.find((p) => p.id === s.activeId) ?? s.participants[0];
}
