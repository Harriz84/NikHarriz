import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  MatchScore,
  Participant,
  PlayerStat,
  Prediction,
  Results,
} from "./types";
import { GROUPS, teamsInGroup } from "./data/teams";
import { MAX_PER_COUNTRY, SQUAD_SIZE } from "./data/scoring";
import { playersById } from "./data/players";

function emptyPrediction(): Prediction {
  const groupOrder: Record<string, string[]> = {};
  for (const g of GROUPS) groupOrder[g] = teamsInGroup(g).map((t) => t.id);
  return {
    matchScores: {},
    groupOrder,
    jokerGroups: [],
    fantasyEleven: [],
    champion: null,
    topScorer: null,
    playerOfTournament: null,
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
  toggleJoker: (group: string) => void;
  toggleFantasyPlayer: (playerId: string) => void;
  setSpecial: (
    key: "champion" | "topScorer" | "playerOfTournament",
    value: string | null,
  ) => void;

  // official results (admin)
  setResultScore: (matchId: string, score: MatchScore) => void;
  setResultGroupOrder: (group: string, order: string[]) => void;
  setPlayerStat: (playerId: string, stat: Partial<PlayerStat>) => void;
  setResultSpecial: (
    key: "champion" | "topScorer" | "playerOfTournament",
    value: string | null,
  ) => void;
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
              { id, name: name.trim() || `Speler ${s.participants.length + 1}`, prediction: emptyPrediction() },
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

      toggleJoker: (group) =>
        set((s) =>
          withActive(s, (pred) => {
            const has = pred.jokerGroups.includes(group);
            return {
              ...pred,
              jokerGroups: has
                ? pred.jokerGroups.filter((g) => g !== group)
                : [...pred.jokerGroups, group],
            };
          }),
        ),

      toggleFantasyPlayer: (playerId) =>
        set((s) =>
          withActive(s, (pred) => {
            const has = pred.fantasyEleven.includes(playerId);
            if (has) {
              return {
                ...pred,
                fantasyEleven: pred.fantasyEleven.filter((id) => id !== playerId),
              };
            }
            if (pred.fantasyEleven.length >= SQUAD_SIZE) return pred;
            const teamId = playersById[playerId]?.teamId;
            const sameCountry = pred.fantasyEleven.filter(
              (id) => playersById[id]?.teamId === teamId,
            ).length;
            if (sameCountry >= MAX_PER_COUNTRY) return pred;
            return { ...pred, fantasyEleven: [...pred.fantasyEleven, playerId] };
          }),
        ),

      setSpecial: (key, value) =>
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
          const prev =
            s.results.playerStats[playerId] ?? {
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
    { name: "wk26-pool" },
  ),
);

export function activeParticipant(s: State): Participant {
  return s.participants.find((p) => p.id === s.activeId) ?? s.participants[0];
}
