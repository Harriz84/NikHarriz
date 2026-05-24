import { FLAGS } from "../data/flags";

interface Props {
  code: string; // team id
  size?: number; // height in px
  round?: boolean;
}

export function Flag({ code, size = 22, round = false }: Props) {
  const h = size;
  const w = round ? size : Math.round((size * 4) / 3);
  return (
    <img
      className={"flag" + (round ? " flag--round" : "")}
      src={FLAGS[code]}
      alt=""
      width={w}
      height={h}
      style={{ width: w, height: h }}
      loading="lazy"
      draggable={false}
    />
  );
}
