interface Props {
  value: number | undefined;
  onChange: (v: number) => void;
  max?: number;
}

export function Stepper({ value, onChange, max = 12 }: Props) {
  const filled = value !== undefined;
  const v = value ?? 0;
  return (
    <div className="stepper">
      <button
        className={"stepper__box" + (filled ? " stepper__box--filled" : "")}
        onClick={() => onChange(filled ? v : 0)}
        aria-label="Score"
      >
        {filled ? v : "+"}
      </button>
      <div className="stepper__btns">
        <button
          className="stepper__btn"
          onClick={() => onChange(Math.max(0, v - 1))}
          disabled={!filled || v <= 0}
        >
          −
        </button>
        <button
          className="stepper__btn"
          onClick={() => onChange(Math.min(max, (filled ? v : 0) + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
