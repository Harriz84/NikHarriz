import { useMemo, useState } from "react";
import { useStore, activeParticipant } from "../store";
import { PLAYERS, playersById } from "../data/players";
import { TEAMS, teamsById } from "../data/teams";
import { MAX_PER_COUNTRY, SQUAD_SIZE } from "../data/scoring";
import { Flag } from "../components/Flag";
import type { Position } from "../types";

const POS_ORDER: Position[] = ["GK", "DEF", "MID", "FWD"];
const POS_LABEL: Record<Position, string> = {
  GK: "Keeper",
  DEF: "Verdediger",
  MID: "Middenvelder",
  FWD: "Aanvaller",
};

export function FantasyScreen() {
  const participant = useStore(activeParticipant);
  const toggle = useStore((s) => s.toggleFantasyPlayer);
  const eleven = participant.prediction.fantasyEleven;

  const [posFilter, setPosFilter] = useState<"ALL" | Position>("ALL");
  const [country, setCountry] = useState("ALL");
  const [search, setSearch] = useState("");

  const countryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const id of eleven) {
      const t = playersById[id]?.teamId;
      if (t) c[t] = (c[t] ?? 0) + 1;
    }
    return c;
  }, [eleven]);

  const filtered = useMemo(() => {
    return PLAYERS.filter((p) => {
      if (posFilter !== "ALL" && p.position !== posFilter) return false;
      if (country !== "ALL" && p.teamId !== country) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    }).sort((a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position));
  }, [posFilter, country, search]);

  const byLine: Record<Position, typeof PLAYERS> = {
    GK: [],
    DEF: [],
    MID: [],
    FWD: [],
  };
  for (const id of eleven) {
    const p = playersById[id];
    if (p) byLine[p.position].push(p);
  }

  return (
    <div className="screen">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 16 }}>
          <div className="counter">
            <div>
              <div className="subtle" style={{ fontWeight: 700 }}>
                Jouw elftal
              </div>
              <div className="counter__big">
                <span className="grad-text">{eleven.length}</span>
                <span style={{ color: "var(--muted)", fontSize: 18 }}>
                  {" "}
                  / {SQUAD_SIZE}
                </span>
              </div>
            </div>
            <span className="tag">max {MAX_PER_COUNTRY} per land</span>
          </div>
        </div>
        <div className="pitch">
          {POS_ORDER.map((pos) => (
            <div className="pitch__line" key={pos}>
              {byLine[pos].length === 0 ? (
                <div className="slot">
                  <div className="slot__badge slot__badge--empty">
                    {pos === "GK" ? "🧤" : "+"}
                  </div>
                  <div className="slot__name">{POS_LABEL[pos]}</div>
                </div>
              ) : (
                byLine[pos].map((p) => (
                  <button
                    className="slot"
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    title="Tik om te verwijderen"
                  >
                    <div className="slot__badge">
                      <Flag code={p.teamId} size={28} />
                    </div>
                    <div className="slot__name">
                      {p.name.split(" ").slice(-1)[0]}
                    </div>
                  </button>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Spelers kiezen</div>

      <div className="row" style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Zoek speler…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="row" style={{ marginBottom: 12, gap: 8 }}>
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="ALL">Alle landen</option>
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="seg" style={{ marginBottom: 14 }}>
        {(["ALL", ...POS_ORDER] as const).map((p) => (
          <button
            key={p}
            className={"seg__btn" + (posFilter === p ? " seg__btn--active" : "")}
            onClick={() => setPosFilter(p)}
          >
            {p === "ALL" ? "Alle" : p}
          </button>
        ))}
      </div>

      <div className="plist">
        {filtered.map((p) => {
          const picked = eleven.includes(p.id);
          const team = teamsById[p.teamId];
          const full = eleven.length >= SQUAD_SIZE;
          const countryFull = (countryCounts[p.teamId] ?? 0) >= MAX_PER_COUNTRY;
          const disabled = !picked && (full || countryFull);
          return (
            <div
              key={p.id}
              className={
                "prow" +
                (picked ? " prow--picked" : "") +
                (disabled ? " prow--disabled" : "")
              }
            >
              <Flag code={p.teamId} size={19} />
              <div className="prow__info">
                <div className="prow__name">{p.name}</div>
                <div className="prow__meta">
                  <span className={"pos-pill pos-" + p.position}>
                    {p.position}
                  </span>
                  {team.name}
                </div>
              </div>
              <button
                className={"pickbtn" + (picked ? " pickbtn--on" : "")}
                onClick={() => toggle(p.id)}
                disabled={disabled}
                aria-label={picked ? "Verwijder" : "Kies"}
              >
                {picked ? "✓" : "+"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
