import { EXTRA_LINKS, NODES, STRING_PATH, WORLD_HEIGHT, WORLD_WIDTH } from "./mapLayout";

/**
 * The detective board's red string, stretched aggressively across the whole
 * map: a main trail linking every section in sequence, plus taut diagonal
 * cross-references for that frantic "everything is connected" energy.
 */
export function RedString() {
  const points = STRING_PATH.map((id) => NODES[id].pin);

  const mainSegments = points.slice(0, -1).map((p, i) => {
    const q = points[i + 1];
    const sag = 95 * (i % 2 === 0 ? 1 : -1);
    const mx = (p.x + q.x) / 2;
    const my = (p.y + q.y) / 2 + sag;
    return `M ${p.x} ${p.y} Q ${mx} ${my} ${q.x} ${q.y}`;
  });

  const extraSegments = EXTRA_LINKS.map(([a, b]) => {
    const p = NODES[a].pin;
    const q = NODES[b].pin;
    // near-straight, taut lines for the cross-references (a slight bow only)
    const mx = (p.x + q.x) / 2 + (q.y - p.y) * 0.04;
    const my = (p.y + q.y) / 2 - (q.x - p.x) * 0.04;
    return `M ${p.x} ${p.y} Q ${mx} ${my} ${q.x} ${q.y}`;
  });

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={WORLD_WIDTH}
      height={WORLD_HEIGHT}
      viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
    >
      {extraSegments.map((d, i) => (
        <path key={`extra-${i}`} d={d} fill="none" stroke="#8f1414" strokeWidth={2} opacity={0.55} />
      ))}
      {mainSegments.map((d, i) => (
        <path key={`main-${i}`} d={d} fill="none" stroke="#a01414" strokeWidth={4} strokeLinecap="round" opacity={0.92} />
      ))}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={9} fill="#7a1212" stroke="#1a0e0e" strokeWidth={2} />
          <circle cx={p.x - 2.5} cy={p.y - 2.5} r={2.5} fill="rgba(255,255,255,0.55)" />
        </g>
      ))}
    </svg>
  );
}
