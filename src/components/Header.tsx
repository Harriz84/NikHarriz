import { useStore } from "../store";

const SUBTITLES: Record<string, string> = {
  home: "WK 2026 · jouw vriendenpool",
  pool: "Voorspel de uitslagen",
  fantasy: "Stel je droomelftal samen",
  specials: "Kampioen, topscorer & meer",
  leaderboard: "Wie is de baas?",
};

export function Header({ tab }: { tab: string }) {
  const participants = useStore((s) => s.participants);
  const activeId = useStore((s) => s.activeId);
  const setActive = useStore((s) => s.setActive);
  const addParticipant = useStore((s) => s.addParticipant);

  function add() {
    const name = window.prompt("Naam van de deelnemer?");
    if (name && name.trim()) addParticipant(name.trim());
  }

  return (
    <header className="header">
      <div className="header__row">
        <div>
          <div className="wordmark">
            WK<span className="pill">26</span>POOL
          </div>
          <div className="header__sub">{SUBTITLES[tab] ?? ""}</div>
        </div>
      </div>
      <div className="who">
        {participants.map((p) => (
          <button
            key={p.id}
            className={
              "who__chip" + (p.id === activeId ? " who__chip--active" : "")
            }
            onClick={() => setActive(p.id)}
          >
            {p.name}
          </button>
        ))}
        <button className="who__add" onClick={add} aria-label="Deelnemer toevoegen">
          +
        </button>
      </div>
    </header>
  );
}
