import { useState } from "react";
import { Header } from "./components/Header";
import { BottomNav, type Tab } from "./components/BottomNav";
import { HomeScreen } from "./screens/HomeScreen";
import { PoolScreen } from "./screens/PoolScreen";
import { FantasyScreen } from "./screens/FantasyScreen";
import { SpecialsScreen } from "./screens/SpecialsScreen";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="app">
      <Header tab={tab} />
      {tab === "home" && <HomeScreen onNavigate={setTab} />}
      {tab === "pool" && <PoolScreen />}
      {tab === "fantasy" && <FantasyScreen />}
      {tab === "specials" && <SpecialsScreen />}
      {tab === "leaderboard" && <LeaderboardScreen />}
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
