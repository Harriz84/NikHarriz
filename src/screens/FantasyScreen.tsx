import { useMemo, useRef, useState } from "react";
import { useStore, activeParticipant } from "../store";
import { PLAYERS, playersById } from "../data/players";
import { TEAMS, teamsById } from "../data/teams";
import {
  FORMATIONS,
  FORMATION_LIST,
  DEFAULT_FORMATION,
  MAX_PER_COUNTRY,
  SQUAD_SIZE,
} from "../data/scoring";
import { Flag } from "../components/Flag";
import { Shirt } from "../components/Shirt";
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
  const setCaptain = useStore((s) => s.setCaptain);
  const setFormation = useStore((s) => s.setFormation);

  const pred = participant.prediction;
  const eleven = pred.fantasyEleven;
  const captain = pred.captain;
  const formation = pred.formation ?? DEFAULT_FORMATION;
  const f = FORMATIONS[formation] ?? FORMATIONS[DEFAULT_FORMATION];
  const caps: Record<Position, number> = {
    GK: 1,
    DEF: f.DEF,
    MID: f.MID,
    FWD: f.FWD,
  };

  const [posFilter, setPosFilter] = useState<"ALL" | Position>("ALL");
  const [country, setCountry] = useState("ALL");
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const countryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const id of eleven) {
      const t = playersById[id]?.teamId;
      if (t) c[t] = (c[t] ?? 0) + 1;
    }
    return c;
  }, [eleven]);

  const posCounts = useMemo(() => {
    const c: Record<Position, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    for (const id of eleven) {
      const p = playersById[id]?.position;
      if (p) c[p]++;
    }
    return c;
  }, [eleven]);

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

  const filtered = useMemo(() => {
    return PLAYERS.filter((p) => {
      if (posFilter !== "ALL" && p.position !== posFilter) return false;
      if (country !== "ALL" && p.teamId !== country) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    }).sort(
      (a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position),
    );
  }, [posFilter, country, search]);

  function openLine(pos: Position) {
    setPosFilter(pos);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="screen">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 14 }}>
          <div className="counter">
            <div>
              <div className="subtle" style={{ fontWeight: 600 }}>
                Jouw elftal
              </div>
              <div className="counter__big">
                <span className="grad-text">{eleven.length}</span>
                <span style={{ color: "var(--faint)", fontSize: 16 }}>
                  {" "}
                  / {SQUAD_SIZE}
                </span>
              </div>
            </div>
            <span className="tag">max {MAX_PER_COUNTRY} per land</span>
          </div>
          <div className="seg" style={{ margin: 0 }}>
            {FORMATION_LIST.map((fm) => (
              <button
                key={fm}
                className={"seg__btn" + (formation === fm ? " seg__btn--active" : "")}
                onClick={() => setFormation(fm)}
              >
                {fm}
              </button>
            ))}
          </div>
        </div>

        <div className="pitch">
          {POS_ORDER.map((pos) => {
            const players = byLine[pos];
            const slots = [];
            for (let i = 0; i < caps[pos]; i++) {
              const p = players[i];
              if (p) {
                slots.push(
                  <div className="slot" key={p.id}>
                    <div className="slot__shirt">
                      <button
                        className="slot__tap"
                        onClick={() => setCaptain(p.id)}
                        title="Aanvoerder aan/uit"
                      >
                        <Shirt
                          teamId={p.teamId}
                          number={p.number}
                          size={46}
                          captain={captain === p.id}
                        />
                      </button>
                      <button
                        className="slot__x"
                        onClick={() => toggle(p.id)}
                        aria-label="Verwijder"
                      >
                        ×
                      </button>
                    </div>
                    <div className="slot__name">
                      {p.name.split(" ").slice(-1)[0]}
                    </div>
                  </div>,
                );
              } else {
                slots.push(
                  <button
                    className="slot"
                    key={pos + i}
                    onClick={() => openLine(pos)}
                  >
                    <div className="slot__badge slot__badge--empty">+</div>
                    <div className="slot__name slot__name--empty">
                      {POS_LABEL[pos]}
                    </div>
                  </button>,
                );
              }
            }
            return (
              <div className="pitch__line" key={pos}>
                {slots}
              </div>
            );
          })}
        </div>
      </div>

      <p className="subtle" style={{ textAlign: "center", margin: "10px 4px" }}>
        Tik op een shirt voor je <b style={{ color: "var(--gold)" }}>aanvoerder</b>{" "}
        (C = dubbele punten). Tik op × om te verwijderen.
      </p>

      <div className="section-title" ref={listRef}>
        Spelers kiezen
      </div>

      <input
        type="text"
        placeholder="Zoek op naam…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ marginBottom: 10 }}
      >
        <option value="ALL">Alle landen</option>
        {TEAMS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.flag} {t.name}
          </option>
        ))}
      </select>
      <div className="seg">
        {(["ALL", ...POS_ORDER] as const).map((p) => (
          <button
            key={p}
            className={"seg__btn" + (posFilter === p ? " seg__btn--active" : "")}
            onClick={() => setPosFilter(p)}
          >
            {p === "ALL" ? "Alle" : p}
            {p !== "ALL" && (
              <span style={{ opacity: 0.7 }}>
                {" "}
                {posCounts[p]}/{caps[p]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="plist">
        {filtered.map((p) => {
          const picked = eleven.includes(p.id);
          const team = teamsById[p.teamId];
          const squadFull = eleven.length >= SQUAD_SIZE;
          const lineFull = posCounts[p.position] >= caps[p.position];
          const countryFull = (countryCounts[p.teamId] ?? 0) >= MAX_PER_COUNTRY;
          const disabled = !picked && (squadFull || lineFull || countryFull);
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
                <div className="prow__name">
                  {p.name}
                  {captain === p.id && (
                    <span className="x2" style={{ marginLeft: 6 }}>
                      C
                    </span>
                  )}
                </div>
                <div className="prow__meta">
                  <span className={"pos-pill pos-" + p.position}>
                    #{p.number} {p.position}
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
        {filtered.length === 0 && (
          <div className="empty">Geen spelers gevonden.</div>
        )}
      </div>
    </div>
  );
}
