import { useRef, useState, type ReactNode, type PointerEvent } from "react";

interface Props {
  ids: string[];
  onReorder: (ids: string[]) => void;
  renderRow: (id: string, index: number) => ReactNode;
}

// Touch/muis-vriendelijke sleeplijst. Slepen gaat via de greep rechts;
// de rest van de rij blijft normaal klikbaar (bv. de joker-positie).
export function SortableList({ ids, onReorder, renderRow }: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const startY = useRef(0);
  const rowH = useRef(44);
  const idxRef = useRef(0);

  function down(e: PointerEvent, index: number) {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const row = (e.currentTarget as HTMLElement).closest(
      ".sortrow",
    ) as HTMLElement | null;
    rowH.current = row?.offsetHeight ?? 44;
    startY.current = e.clientY;
    idxRef.current = index;
    setDragIdx(index);
  }

  function move(e: PointerEvent) {
    if (dragIdx === null) return;
    const delta = Math.round((e.clientY - startY.current) / rowH.current);
    if (delta === 0) return;
    const cur = idxRef.current;
    const target = Math.max(0, Math.min(ids.length - 1, cur + delta));
    if (target === cur) return;
    const next = [...ids];
    const [m] = next.splice(cur, 1);
    next.splice(target, 0, m);
    onReorder(next);
    startY.current += (target - cur) * rowH.current;
    idxRef.current = target;
    setDragIdx(target);
  }

  function up(e: PointerEvent) {
    if (dragIdx === null) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDragIdx(null);
  }

  return (
    <div className="sortlist">
      {ids.map((id, i) => (
        <div
          className={"sortrow" + (dragIdx === i ? " sortrow--drag" : "")}
          key={id}
        >
          <div className="sortrow__body">{renderRow(id, i)}</div>
          <button
            className="draghandle"
            onPointerDown={(e) => down(e, i)}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            aria-label="Versleep"
          >
            <svg viewBox="0 0 20 20" width="18" height="18">
              <circle cx="7" cy="5" r="1.5" fill="currentColor" />
              <circle cx="13" cy="5" r="1.5" fill="currentColor" />
              <circle cx="7" cy="10" r="1.5" fill="currentColor" />
              <circle cx="13" cy="10" r="1.5" fill="currentColor" />
              <circle cx="7" cy="15" r="1.5" fill="currentColor" />
              <circle cx="13" cy="15" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
