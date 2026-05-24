import { teamsById } from "../data/teams";

function contrast(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#15171c" : "#ffffff";
}

interface Props {
  teamId: string;
  number: number;
  size?: number;
  captain?: boolean;
}

export function Shirt({ teamId, number, size = 46, captain = false }: Props) {
  const team = teamsById[teamId];
  const color = team?.color ?? "#3a3f4a";
  const fg = contrast(color);
  const w = size;
  const h = Math.round(size * 0.92);
  return (
    <div className="shirt" style={{ width: w, height: h }}>
      <svg viewBox="0 0 50 46" width={w} height={h} aria-hidden="true">
        <path
          d="M16 4 L25 9 L34 4 L46 8 L40 18 L34 14 L34 42 L16 42 L16 14 L10 18 L4 8 Z"
          fill={color}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <text
          x="25"
          y="33"
          textAnchor="middle"
          fontSize="16"
          fontWeight="800"
          fill={fg}
          fontFamily="inherit"
        >
          {number}
        </text>
      </svg>
      {captain && <span className="shirt__c">C</span>}
    </div>
  );
}
