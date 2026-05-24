import { useMemo, useState } from "react";
import { useStore, activeParticipant } from "../store";
import { MATCHES } from "../data/matches";
import { GROUPS, teamsById } from "../data/teams";
import { Flag } from "../components/Flag";
import { Stepper } from "../components/Stepper";
import { SortableList } from "../components/SortableList";

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
  const setRoundBoost = useStore((s) => s.setRoundBoost);
  const matches = MATCHES.filter((m) => m.matchday === md);
  const boost = participant.prediction.roundBoost?.[md] ?? "";

  const roundTeams = useMemo(() => {
    const ids = new Set<string>();
    for (const m of matches) {
      ids.add(m.homeId);
      ids.add(m.awayId);
    }
    return [...ids]
      .map((id) => teamsById[id])
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

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

      <div className="card boostcard" style={{ marginBottom: 12 }}>
        <div className="row__txt">
          <b>⚡ Boost-team ronde {md}</b>
          <p>Dubbele punten voor de wedstrijd van dit team.</p>
        </div>
        <select
          value={boost}
          onChange={(e) => setRoundBoost(md, e.target.value || null)}
        >
          <option value="">Geen</option>
          {roundTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.flag} {t.name}
            </option>
          ))}
        </select>
      </div>

      {matches.map((m) => {
        const home = teamsById[m.homeId];
        const away = teamsById[m.awayId];
        const score = participant.prediction.matchScores[m.id];
        const boosted = boost === m.homeId || boost === m.awayId;
        return (
          <div className="match" key={m.id}>
            <div className="match__top">
              <span className="tag">Groep {m.group}</span>
              {boosted && <span className="x2">2× boost</span>}
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
                  onChange={(h) =>
                    setMatchScore(m.id, { home: h, away: score?.away ?? 0 })
                  }
                />
                <span className="match__sep">:</span>
                <Stepper
                  value={score?.away}
                  onChange={(a) =>
                    setMatchScore(m.id, { home: score?.home ?? 0, away: a })
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
  const setJokerPosition = useStore((s) => s.setJokerPosition);

  const order = participant.prediction.groupOrder[group] ?? [];
  const joker = participant.prediction.jokerPositions?.[group];

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
        <p className="subtle" style={{ marginBottom: 12 }}>
          Versleep met de greep rechts. Top 2 (groen) gaat door. 3 punten per
          juiste plek, +5 bonus bij de hele groep goed. Tik op een positie­nummer
          om daar je <b style={{ color: "var(--gold)" }}>joker</b> te zetten
          (dubbele punten).
        </p>

        <SortableList
          ids={order}
          onReorder={(next) => setGroupOrder(group, next)}
          renderRow={(teamId, i) => {
            const team = teamsById[teamId];
            const isJoker = joker === i;
            const cls =
              "grouprow__pos" +
              (isJoker ? " grouprow__pos--joker" : i < 2 ? " grouprow__pos--q" : "");
            return (
              <>
                <button
                  className={cls}
                  onClick={() => setJokerPosition(group, i)}
                  title="Joker op deze positie"
                >
                  {i + 1}
                </button>
                <Flag code={team.id} size={20} />
                <div className="grouprow__name">{team.name}</div>
                {isJoker && <span className="x2">2×</span>}
              </>
            );
          }}
        />
      </div>
    </>
  );
}
