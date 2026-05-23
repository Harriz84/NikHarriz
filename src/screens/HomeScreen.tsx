import { useMemo } from "react";
import { useStore, activeParticipant } from "../store";
import { scoreParticipant } from "../scoring";
import { MATCHES } from "../data/matches";
import {
  FANTASY_SCORING,
  POOL_SCORING,
  GROUP_SCORING,
  SPECIAL_SCORING,
} from "../data/scoring";
import type { Tab } from "../components/BottomNav";

const KICKOFF = new Date("2026-06-11T18:00:00");

export function HomeScreen({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const participant = useStore(activeParticipant);
  const participants = useStore((s) => s.participants);
  const results = useStore((s) => s.results);

  const pred = participant.prediction;
  const myScore = useMemo(
    () => scoreParticipant(participant, results),
    [participant, results],
  );

  const daysToGo = Math.max(
    0,
    Math.ceil((KICKOFF.getTime() - Date.now()) / 86400000),
  );

  const matchesFilled = Object.keys(pred.matchScores).length;
  const top3 = useMemo(
    () =>
      participants
        .map((p) => ({ name: p.name, total: scoreParticipant(p, results).total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3),
    [participants, results],
  );

  return (
    <div className="screen">
      <div className="hero">
        <div className="hero__label">Nog te gaan</div>
        <div className="hero__big">
          {daysToGo} {daysToGo === 1 ? "dag" : "dagen"}
        </div>
        <div className="hero__sub">tot de aftrap van WK26 · 11 juni 2026</div>
      </div>

      <div className="stat-strip">
        <div>
          <b className="grad-text">{myScore.total}</b>
          <small>jouw punten</small>
        </div>
        <div>
          <b>{matchesFilled}/{MATCHES.length}</b>
          <small>uitslagen</small>
        </div>
        <div>
          <b>{pred.fantasyEleven.length}/11</b>
          <small>elftal</small>
        </div>
        <div>
          <b>
            {[pred.champion, pred.topScorer, pred.playerOfTournament].filter(Boolean).length}/3
          </b>
          <small>specials</small>
        </div>
      </div>

      <div className="section-title">Snel invullen</div>
      <div className="choice-grid">
        <button className="choice" onClick={() => onNavigate("pool")}>
          <span style={{ fontSize: 22 }}>🎯</span>
          <span>Uitslagen voorspellen</span>
        </button>
        <button className="choice" onClick={() => onNavigate("fantasy")}>
          <span style={{ fontSize: 22 }}>👕</span>
          <span>Elftal samenstellen</span>
        </button>
        <button className="choice" onClick={() => onNavigate("specials")}>
          <span style={{ fontSize: 22 }}>⭐</span>
          <span>Specials kiezen</span>
        </button>
        <button className="choice" onClick={() => onNavigate("leaderboard")}>
          <span style={{ fontSize: 22 }}>🏆</span>
          <span>Klassement bekijken</span>
        </button>
      </div>

      <div className="section-title">Top 3</div>
      <div className="lb">
        {top3.map((t, i) => (
          <div className="lbrow" key={t.name + i}>
            <div className={"lbrank lbrank--" + (i + 1)}>{i + 1}</div>
            <div className="lbrow__name">{t.name}</div>
            <div className="lbrow__pts grad-text">{t.total}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Spelregels & punten</div>
      <div className="card">
        <ul className="rules" style={{ paddingLeft: 18, margin: 0 }}>
          <li>
            <b>Wedstrijd exact goed:</b> {POOL_SCORING.exact} punten ·{" "}
            <b>juiste uitslag-tendens:</b> {POOL_SCORING.result}
          </li>
          <li>
            <b>Joker per groep:</b> verdubbelt je poolpunten in die groep
          </li>
          <li>
            <b>Groepsstand:</b> {GROUP_SCORING.perCorrectPosition} per juiste plek
            · +{GROUP_SCORING.perfectBonus} als de hele groep klopt
          </li>
          <li>
            <b>Fantasy-speler:</b> speelt {FANTASY_SCORING.appearance} · assist{" "}
            {FANTASY_SCORING.assist} · geel {FANTASY_SCORING.yellow} · rood{" "}
            {FANTASY_SCORING.red}
          </li>
          <li>
            <b>Goals:</b> verdediger {FANTASY_SCORING.goalByPosition.DEF} ·
            middenvelder {FANTASY_SCORING.goalByPosition.MID} · aanvaller{" "}
            {FANTASY_SCORING.goalByPosition.FWD} · keeper{" "}
            {FANTASY_SCORING.goalByPosition.GK}
          </li>
          <li>
            <b>Keeper clean sheet:</b> {FANTASY_SCORING.cleanSheetGK} punten
          </li>
          <li>
            <b>Specials:</b> kampioen {SPECIAL_SCORING.champion} · topscorer{" "}
            {SPECIAL_SCORING.topScorer} · speler v/h toernooi{" "}
            {SPECIAL_SCORING.playerOfTournament}
          </li>
        </ul>
      </div>

      <p className="subtle" style={{ textAlign: "center", marginTop: 18 }}>
        Tip: voeg je vrienden toe via de <b>+</b> bovenin en deel je
        voorspelling via het klassement.
      </p>
    </div>
  );
}
