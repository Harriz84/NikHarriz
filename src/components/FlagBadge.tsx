interface Props {
  flag: string;
  size?: number;
}

export function FlagBadge({ flag, size = 56 }: Props) {
  return (
    <span
      className="flag"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.62) }}
    >
      <span>{flag}</span>
    </span>
  );
}
