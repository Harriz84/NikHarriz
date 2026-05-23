import { HomeIcon, PoolIcon, ShirtIcon, StarIcon, TrophyIcon } from "./icons";

export type Tab = "home" | "pool" | "fantasy" | "specials" | "leaderboard";

const ITEMS: { id: Tab; label: string; Icon: (p: { className?: string }) => JSX.Element }[] = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "pool", label: "WK Pool", Icon: PoolIcon },
  { id: "fantasy", label: "Fantasy", Icon: ShirtIcon },
  { id: "specials", label: "Specials", Icon: StarIcon },
  { id: "leaderboard", label: "Klassement", Icon: TrophyIcon },
];

export function BottomNav({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav className="nav">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={"nav__btn" + (tab === id ? " nav__btn--active" : "")}
          onClick={() => onChange(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
