import type { Team } from "../types";

// 48-team field for WK26, drawn into 12 groups (A–L) of 4.
// Flags are emoji so no image assets are needed.
export const TEAMS: Team[] = [
  // Group A
  { id: "MEX", name: "Mexico", flag: "🇲🇽", group: "A" },
  { id: "RSA", name: "Zuid-Afrika", flag: "🇿🇦", group: "A" },
  { id: "KOR", name: "Zuid-Korea", flag: "🇰🇷", group: "A" },
  { id: "CZE", name: "Tsjechië", flag: "🇨🇿", group: "A" },
  // Group B
  { id: "CAN", name: "Canada", flag: "🇨🇦", group: "B" },
  { id: "BIH", name: "Bosnië-Herz.", flag: "🇧🇦", group: "B" },
  { id: "JPN", name: "Japan", flag: "🇯🇵", group: "B" },
  { id: "KSA", name: "Saoedi-Arabië", flag: "🇸🇦", group: "B" },
  // Group C
  { id: "USA", name: "Verenigde Staten", flag: "🇺🇸", group: "C" },
  { id: "WAL", name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", group: "C" },
  { id: "EGY", name: "Egypte", flag: "🇪🇬", group: "C" },
  { id: "PAR", name: "Paraguay", flag: "🇵🇾", group: "C" },
  // Group D
  { id: "ARG", name: "Argentinië", flag: "🇦🇷", group: "D" },
  { id: "NOR", name: "Noorwegen", flag: "🇳🇴", group: "D" },
  { id: "NGA", name: "Nigeria", flag: "🇳🇬", group: "D" },
  { id: "CRC", name: "Costa Rica", flag: "🇨🇷", group: "D" },
  // Group E
  { id: "FRA", name: "Frankrijk", flag: "🇫🇷", group: "E" },
  { id: "SUI", name: "Zwitserland", flag: "🇨🇭", group: "E" },
  { id: "GHA", name: "Ghana", flag: "🇬🇭", group: "E" },
  { id: "NZL", name: "Nieuw-Zeeland", flag: "🇳🇿", group: "E" },
  // Group F
  { id: "BRA", name: "Brazilië", flag: "🇧🇷", group: "F" },
  { id: "SRB", name: "Servië", flag: "🇷🇸", group: "F" },
  { id: "CMR", name: "Kameroen", flag: "🇨🇲", group: "F" },
  { id: "PAN", name: "Panama", flag: "🇵🇦", group: "F" },
  // Group G
  { id: "ESP", name: "Spanje", flag: "🇪🇸", group: "G" },
  { id: "SWE", name: "Zweden", flag: "🇸🇪", group: "G" },
  { id: "CIV", name: "Ivoorkust", flag: "🇨🇮", group: "G" },
  { id: "QAT", name: "Qatar", flag: "🇶🇦", group: "G" },
  // Group H
  { id: "ENG", name: "Engeland", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "H" },
  { id: "POL", name: "Polen", flag: "🇵🇱", group: "H" },
  { id: "SEN", name: "Senegal", flag: "🇸🇳", group: "H" },
  { id: "AUS", name: "Australië", flag: "🇦🇺", group: "H" },
  // Group I
  { id: "GER", name: "Duitsland", flag: "🇩🇪", group: "I" },
  { id: "DEN", name: "Denemarken", flag: "🇩🇰", group: "I" },
  { id: "TUN", name: "Tunesië", flag: "🇹🇳", group: "I" },
  { id: "IRN", name: "Iran", flag: "🇮🇷", group: "I" },
  // Group J
  { id: "POR", name: "Portugal", flag: "🇵🇹", group: "J" },
  { id: "TUR", name: "Turkije", flag: "🇹🇷", group: "J" },
  { id: "MAR", name: "Marokko", flag: "🇲🇦", group: "J" },
  { id: "ECU", name: "Ecuador", flag: "🇪🇨", group: "J" },
  // Group K
  { id: "NED", name: "Nederland", flag: "🇳🇱", group: "K" },
  { id: "AUT", name: "Oostenrijk", flag: "🇦🇹", group: "K" },
  { id: "ALG", name: "Algerije", flag: "🇩🇿", group: "K" },
  { id: "URU", name: "Uruguay", flag: "🇺🇾", group: "K" },
  // Group L
  { id: "BEL", name: "België", flag: "🇧🇪", group: "L" },
  { id: "CRO", name: "Kroatië", flag: "🇭🇷", group: "L" },
  { id: "COL", name: "Colombia", flag: "🇨🇴", group: "L" },
  { id: "SCO", name: "Schotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "L" },
];

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export const teamsById: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);

export function teamsInGroup(group: string): Team[] {
  return TEAMS.filter((t) => t.group === group);
}
