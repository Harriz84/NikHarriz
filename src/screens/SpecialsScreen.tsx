import { useStore, activeParticipant } from "../store";
import { TEAMS, teamsById } from "../data/teams";
import { PLAYERS, playersById } from "../data/players";
import { FlagBadge } from "../components/FlagBadge";
import { SPECIAL_SCORING } from "../data/scoring";

function PlayerSelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">— Kies een speler —</option>
      {TEAMS.map((t) => {
        const players = PLAYERS.filter((p) => p.teamId === t.id);
        if (!players.length) return null;
        return (
          <optgroup key={t.id} label={`${t.flag} ${t.name}`}>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.position})
              </option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}

export function SpecialsScreen() {
  const participant = useStore(activeParticipant);
  const setSpecial = useStore((s) => s.setSpecial);
  const pred = participant.prediction;

  const champion = pred.champion ? teamsById[pred.champion] : null;
  const topScorer = pred.topScorer ? playersById[pred.topScorer] : null;
  const pott = pred.playerOfTournament
    ? playersById[pred.playerOfTournament]
    : null;

  return (
    <div className="screen">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3>🏆 Wereldkampioen</h3>
          <span className="tag">{SPECIAL_SCORING.champion} pt</span>
        </div>
        <p className="subtle" style={{ margin: "6px 0 12px" }}>
          Welk land wint het WK26?
        </p>
        {champion && (
          <div className="row" style={{ marginBottom: 12 }}>
            <FlagBadge flag={champion.flag} size={44} />
            <b style={{ fontSize: 18 }}>{champion.name}</b>
          </div>
        )}
        <select
          value={pred.champion ?? ""}
          onChange={(e) => setSpecial("champion", e.target.value || null)}
        >
          <option value="">— Kies een land —</option>
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.flag} {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3>⚽ Topscorer</h3>
          <span className="tag">{SPECIAL_SCORING.topScorer} pt</span>
        </div>
        <p className="subtle" style={{ margin: "6px 0 12px" }}>
          Wie maakt de meeste goals?
        </p>
        {topScorer && (
          <div className="row" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 26 }}>
              {teamsById[topScorer.teamId].flag}
            </span>
            <b style={{ fontSize: 16 }}>{topScorer.name}</b>
          </div>
        )}
        <PlayerSelect
          value={pred.topScorer}
          onChange={(v) => setSpecial("topScorer", v)}
        />
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3>⭐ Speler van het toernooi</h3>
          <span className="tag">{SPECIAL_SCORING.playerOfTournament} pt</span>
        </div>
        <p className="subtle" style={{ margin: "6px 0 12px" }}>
          Wie wordt de beste speler van het WK?
        </p>
        {pott && (
          <div className="row" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 26 }}>{teamsById[pott.teamId].flag}</span>
            <b style={{ fontSize: 16 }}>{pott.name}</b>
          </div>
        )}
        <PlayerSelect
          value={pred.playerOfTournament}
          onChange={(v) => setSpecial("playerOfTournament", v)}
        />
      </div>
    </div>
  );
}
