import { useState } from "react";
import { useStore, activeParticipant } from "../store";
import { MATCHES } from "../data/matches";
import { GROUPS, teamsById } from "../data/teams";
import { Flag } from "../components/Flag";
import { Stepper } from "../components/Stepper";

const MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

function fmt(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} · ${iso.slice(11, 16)}`;
}

export function PoolScreen() {
  const [sub, setSub] = useState<"matches" | "groups">("matches");
  return (
    <div className="screen">
      <div className="seg">
        <button
          className={"seg__btn" + (sub === "matches" ? " seg__btn--active" : "")}
          onClick={() => setSub("matches")}
        >
          Wedstrijden
        </button>
        <button
          className={"seg__btn" + (sub === "groups" ? " seg__btn--active" : "")}
          onClick={() => setSub("groups")}
        >
          Groepen & joker
        </button>
      </div>
      {sub === "matches" ? <Matches /> : <Groups />}
    </div>
  );
}

function Matches() {
  const [md, setMd] = useState(1);
  const participant = useStore(activeParticipant);
  const setMatchScore = useStore((s) => s.setMatchScore);
  const matches = MATCHES.filter((m) => m.matchday === md);

  return (
    <>
      <div className="seg">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={"seg__btn" + (md === n ? " seg__btn--active" : "")}
            onClick={() => setMd(n)}
          >
            Speelronde {n}
          </button>
        ))}
      </div>
      {matches.map((m) => {
        const home = teamsById[m.homeId];
        const away = teamsById[m.awayId];
        const score = participant.prediction.matchScores[m.id];
        return (
          <div className="match" key={m.id}>
            <div className="match__top">
              <span className="tag">Groep {m.group}</span>
              <span>{fmt(m.date)}</span>
            </div>
            <div className="match__grid">
              <div className="match__team">
                <Flag code={home.id} size={34} />
                <span>{home.name}</span>
              </div>
              <div className="match__score">
                <Stepper
                  value={score?.home}
                  onChange={(home) =>
                    setMatchScore(m.id, { home, away: score?.away ?? 0 })
                  }
                />
                <span className="match__sep">:</span>
                <Stepper
                  value={score?.away}
                  onChange={(away) =>
                    setMatchScore(m.id, { home: score?.home ?? 0, away })
                  }
                />
              </div>
              <div className="match__team">
                <Flag code={away.id} size={34} />
                <span>{away.name}</span>
              </div>
            </div>
          </div>
        );
      })}
      <p className="subtle" style={{ marginTop: 14, textAlign: "center" }}>
        Exacte uitslag = 5 punten · juiste winnaar/gelijkspel = 2 punten
      </p>
    </>
  );
}

function Groups() {
  const [group, setGroup] = useState("A");
  const participant = useStore(activeParticipant);
  const setGroupOrder = useStore((s) => s.setGroupOrder);
  const toggleJoker = useStore((s) => s.toggleJoker);

  const order = participant.prediction.groupOrder[group] ?? [];
  const jokerOn = participant.prediction.jokerGroups.includes(group);

  function move(index: number, dir: -1 | 1) {
    const next = [...order];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setGroupOrder(group, next);
  }

  return (
    <>
      <div className="seg">
        {GROUPS.map((g) => (
          <button
            key={g}
            className={"seg__btn" + (group === g ? " seg__btn--active" : "")}
            onClick={() => setGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 4 }}>Eindstand groep {group}</h3>
        <p className="subtle" style={{ marginBottom: 14 }}>
          Zet de teams in de juiste eindvolgorde. Top 2 (verlicht) gaat zeker
          door. 3 punten per juiste plek, +5 bonus bij de hele groep goed.
        </p>
        {order.map((teamId, i) => {
          const team = teamsById[teamId];
          return (
            <div className="grouprow" key={teamId}>
              <div className={"grouprow__pos" + (i < 2 ? " grouprow__pos--q" : "")}>
                {i + 1}
              </div>
              <Flag code={team.id} size={20} />
              <div className="grouprow__name">{team.name}</div>
              <div className="grouprow__moves">
                <button
                  className="grouprow__move"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Omhoog"
                >
                  ▲
                </button>
                <button
                  className="grouprow__move"
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  aria-label="Omlaag"
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}

        <div className="joker">
          <span style={{ fontSize: 22 }}>🃏</span>
          <div className="joker__txt">
            <b>Joker op groep {group}</b>
            <p>Verdubbelt al je wedstrijdpunten in deze groep.</p>
          </div>
          <button
            className={"toggle" + (jokerOn ? " toggle--on" : "")}
            onClick={() => toggleJoker(group)}
            aria-label="Joker"
          >
            <span className="toggle__dot" />
          </button>
        </div>
      </div>
    </>
  );
}
