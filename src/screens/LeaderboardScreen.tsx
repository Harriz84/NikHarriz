import { useMemo, useState } from "react";
import { useStore } from "../store";
import { scoreParticipant } from "../scoring";
import { AdminPanel } from "./AdminPanel";
import type { Participant } from "../types";

export function LeaderboardScreen() {
  const participants = useStore((s) => s.participants);
  const activeId = useStore((s) => s.activeId);
  const results = useStore((s) => s.results);
  const adminMode = useStore((s) => s.adminMode);
  const setAdminMode = useStore((s) => s.setAdminMode);
  const renameParticipant = useStore((s) => s.renameParticipant);
  const removeParticipant = useStore((s) => s.removeParticipant);
  const addParticipant = useStore((s) => s.addParticipant);

  const [showManage, setShowManage] = useState(false);

  const ranked = useMemo(() => {
    return participants
      .map((p) => ({ p, score: scoreParticipant(p, results) }))
      .sort((a, b) => b.score.total - a.score.total);
  }, [participants, results]);

  function shareActive() {
    const me = participants.find((p) => p.id === activeId);
    if (!me) return;
    const payload = JSON.stringify({ name: me.name, prediction: me.prediction });
    navigator.clipboard?.writeText(payload).then(
      () => window.alert("Voorspelling gekopieerd! Plak en deel met je vrienden."),
      () => window.prompt("Kopieer je voorspelling:", payload),
    );
  }

  function importPrediction() {
    const raw = window.prompt("Plak hier de voorspelling van een vriend:");
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as Partial<Participant>;
      if (!data.prediction) throw new Error("ongeldig");
      addParticipant(data.name ?? "Geïmporteerd");
      // addParticipant maakt de nieuwe deelnemer actief; vul prediction direct.
      const id = useStore.getState().activeId;
      useStore.setState((s) => ({
        participants: s.participants.map((p) =>
          p.id === id ? { ...p, prediction: { ...p.prediction, ...data.prediction } } : p,
        ),
      }));
      window.alert("Voorspelling geïmporteerd!");
    } catch {
      window.alert("Kon de voorspelling niet lezen.");
    }
  }

  return (
    <div className="screen">
      {!results.published && (
        <div className="banner">
          <span>⏳</span>
          <span>
            Uitslagen nog niet definitief. De stand is voorlopig en gebaseerd op
            wat er tot nu toe is ingevoerd.
          </span>
        </div>
      )}

      <div className="lb">
        {ranked.map(({ p, score }, i) => (
          <div
            key={p.id}
            className={"lbrow" + (p.id === activeId ? " lbrow--me" : "")}
          >
            <div className={"lbrank lbrank--" + (i + 1)}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div className="lbrow__name">{p.name}</div>
              <div className="lbrow__break">
                Pool {score.pool} · Groepen {score.groups} · Fantasy{" "}
                {score.fantasy} · Specials {score.specials}
              </div>
            </div>
            <div className="lbrow__pts grad-text">{score.total}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 16, gap: 10 }}>
        <button className="btn btn--grad" style={{ flex: 1 }} onClick={shareActive}>
          Deel voorspelling
        </button>
        <button className="btn btn--ghost" style={{ flex: 1 }} onClick={importPrediction}>
          Importeer
        </button>
      </div>

      <button
        className="btn btn--ghost btn--block"
        style={{ marginTop: 10 }}
        onClick={() => setShowManage((v) => !v)}
      >
        {showManage ? "Verberg deelnemers" : "Beheer deelnemers"}
      </button>

      {showManage && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 style={{ marginBottom: 10 }}>Deelnemers</h3>
          {participants.map((p) => (
            <div className="row" key={p.id} style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={p.name}
                onChange={(e) => renameParticipant(p.id, e.target.value)}
              />
              <button
                className="btn btn--danger"
                onClick={() => removeParticipant(p.id)}
                disabled={participants.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="section-title">Beheer (uitslagen)</div>
      <div className="card">
        <div className="joker" style={{ marginTop: 0, border: "none", padding: 0 }}>
          <div className="joker__txt">
            <b>Uitslagen-modus</b>
            <p>Voer de echte uitslagen, statistieken en winnaars in.</p>
          </div>
          <button
            className={"toggle" + (adminMode ? " toggle--on" : "")}
            onClick={() => setAdminMode(!adminMode)}
          >
            <span className="toggle__dot" />
          </button>
        </div>
      </div>

      {adminMode && <AdminPanel />}
    </div>
  );
}
