import { useMemo, useState } from "react";
import { useStore } from "../store";
import { MATCHES } from "../data/matches";
import { GROUPS, TEAMS, teamsById, teamsInGroup } from "../data/teams";
import { PLAYERS } from "../data/players";
import { FlagBadge } from "../components/FlagBadge";
import { Stepper } from "../components/Stepper";
import type { PlayerStat, Position } from "../types";

type AdminTab = "matches" | "groups" | "players" | "specials";

export function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>("matches");
  const published = useStore((s) => s.results.published);
  const togglePublished = useStore((s) => s.togglePublished);

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="seg">
        <button className={"seg__btn" + (tab === "matches" ? " seg__btn--active" : "")} onClick={() => setTab("matches")}>
          Uitslagen
        </button>
        <button className={"seg__btn" + (tab === "groups" ? " seg__btn--active" : "")} onClick={() => setTab("groups")}>
          Groepen
        </button>
        <button className={"seg__btn" + (tab === "players" ? " seg__btn--active" : "")} onClick={() => setTab("players")}>
          Spelers
        </button>
        <button className={"seg__btn" + (tab === "specials" ? " seg__btn--active" : "")} onClick={() => setTab("specials")}>
          Specials
        </button>
      </div>

      {tab === "matches" && <MatchResults />}
      {tab === "groups" && <GroupResults />}
      {tab === "players" && <PlayerResults />}
      {tab === "specials" && <SpecialResults />}

      <button
        className={"btn btn--block " + (published ? "btn--ghost" : "btn--grad")}
        style={{ marginTop: 14 }}
        onClick={togglePublished}
      >
        {published ? "Uitslagen op voorlopig zetten" : "Uitslagen definitief maken"}
      </button>
    </div>
  );
}

function MatchResults() {
  const [md, setMd] = useState(1);
  const results = useStore((s) => s.results);
  const setResultScore = useStore((s) => s.setResultScore);
  const matches = MATCHES.filter((m) => m.matchday === md);

  return (
    <>
      <div className="seg">
        {[1, 2, 3].map((n) => (
          <button key={n} className={"seg__btn" + (md === n ? " seg__btn--active" : "")} onClick={() => setMd(n)}>
            Ronde {n}
          </button>
        ))}
      </div>
      {matches.map((m) => {
        const home = teamsById[m.homeId];
        const away = teamsById[m.awayId];
        const sc = results.matchScores[m.id];
        return (
          <div className="match" key={m.id}>
            <div className="match__top">
              <span className="tag">Groep {m.group}</span>
            </div>
            <div className="match__grid">
              <div className="match__team">
                <FlagBadge flag={home.flag} size={42} />
                <span>{home.name}</span>
              </div>
              <div className="match__score">
                <Stepper value={sc?.home} onChange={(home) => setResultScore(m.id, { home, away: sc?.away ?? 0 })} />
                <span className="match__sep">:</span>
                <Stepper value={sc?.away} onChange={(away) => setResultScore(m.id, { home: sc?.home ?? 0, away })} />
              </div>
              <div className="match__team">
                <FlagBadge flag={away.flag} size={42} />
                <span>{away.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function GroupResults() {
  const [group, setGroup] = useState("A");
  const results = useStore((s) => s.results);
  const setResultGroupOrder = useStore((s) => s.setResultGroupOrder);
  const isSet = Boolean(results.groupOrder[group]);
  const order =
    results.groupOrder[group] ?? teamsInGroup(group).map((t) => t.id);

  function move(i: number, dir: -1 | 1) {
    const next = [...order];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setResultGroupOrder(group, next);
  }

  return (
    <>
      <div className="seg">
        {GROUPS.map((g) => (
          <button key={g} className={"seg__btn" + (group === g ? " seg__btn--active" : "")} onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </div>
      <p className="subtle" style={{ marginBottom: 10 }}>
        {isSet
          ? "✅ Eindstand vastgelegd — telt mee voor de punten."
          : "Nog niet vastgelegd. Sleep of bevestig de eindstand zodra die bekend is."}
      </p>
      {order.map((teamId, i) => {
        const team = teamsById[teamId];
        return (
          <div className="grouprow" key={teamId}>
            <div className={"grouprow__pos" + (i < 2 ? " grouprow__pos--q" : "")}>{i + 1}</div>
            <FlagBadge flag={team.flag} size={30} />
            <div className="grouprow__name">{team.name}</div>
            <div className="grouprow__moves">
              <button className="grouprow__move" onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
              <button className="grouprow__move" onClick={() => move(i, 1)} disabled={i === order.length - 1}>▼</button>
            </div>
          </div>
        );
      })}
      {!isSet && (
        <button
          className="btn btn--grad btn--block"
          style={{ marginTop: 12 }}
          onClick={() => setResultGroupOrder(group, order)}
        >
          Eindstand groep {group} vastleggen
        </button>
      )}
    </>
  );
}

const STAT_FIELDS: { key: keyof PlayerStat; label: string }[] = [
  { key: "apps", label: "Duels" },
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "yellow", label: "Geel" },
  { key: "red", label: "Rood" },
  { key: "cleanSheets", label: "Clean sh." },
];

function PlayerResults() {
  const participants = useStore((s) => s.participants);
  const results = useStore((s) => s.results);
  const setPlayerStat = useStore((s) => s.setPlayerStat);

  // Alleen spelers die door iemand gekozen zijn beïnvloeden de fantasy-score.
  const relevant = useMemo(() => {
    const ids = new Set<string>();
    for (const p of participants) for (const id of p.prediction.fantasyEleven) ids.add(id);
    return PLAYERS.filter((p) => ids.has(p.id));
  }, [participants]);

  if (relevant.length === 0) {
    return <p className="empty">Nog niemand heeft spelers gekozen voor het elftal.</p>;
  }

  return (
    <>
      <p className="subtle" style={{ marginBottom: 12 }}>
        Vul stats in voor de {relevant.length} gekozen spelers. Clean sheets
        tellen alleen voor keepers.
      </p>
      {relevant.map((p) => {
        const stat = results.playerStats[p.id];
        const fields = STAT_FIELDS.filter(
          (f) => f.key !== "cleanSheets" || p.position === ("GK" as Position),
        );
        return (
          <div className="card" key={p.id} style={{ marginTop: 10, padding: 12 }}>
            <div className="row" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{teamsById[p.teamId].flag}</span>
              <b style={{ flex: 1 }}>{p.name}</b>
              <span className={"pos-pill pos-" + p.position}>{p.position}</span>
            </div>
            <div className="statgrid">
              {fields.map((f) => (
                <div className="statcell" key={f.key}>
                  <label>{f.label}</label>
                  <input
                    type="number"
                    min={0}
                    value={stat?.[f.key] ?? 0}
                    onChange={(e) =>
                      setPlayerStat(p.id, {
                        [f.key]: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function SpecialResults() {
  const results = useStore((s) => s.results);
  const setResultSpecial = useStore((s) => s.setResultSpecial);

  return (
    <>
      <div className="section-title" style={{ marginTop: 6 }}>Kampioen</div>
      <select
        value={results.champion ?? ""}
        onChange={(e) => setResultSpecial("champion", e.target.value || null)}
      >
        <option value="">— Nog niet bekend —</option>
        {TEAMS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.flag} {t.name}
          </option>
        ))}
      </select>

      <div className="section-title">Topscorer</div>
      <PlayerPicker
        value={results.topScorer}
        onChange={(v) => setResultSpecial("topScorer", v)}
      />

      <div className="section-title">Speler van het toernooi</div>
      <PlayerPicker
        value={results.playerOfTournament}
        onChange={(v) => setResultSpecial("playerOfTournament", v)}
      />
    </>
  );
}

function PlayerPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">— Nog niet bekend —</option>
      {TEAMS.map((t) => {
        const players = PLAYERS.filter((p) => p.teamId === t.id);
        return (
          <optgroup key={t.id} label={`${t.flag} ${t.name}`}>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}
