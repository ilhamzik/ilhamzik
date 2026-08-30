/** Purely decorative coffee-ring stains scattered across the paper world. */
export function PaperDecor() {
  const stains = [
    { x: 800, y: 560, size: 130 },
    { x: 2150, y: 520, size: 110 },
    { x: 380, y: 1280, size: 100 },
    { x: 1420, y: 2420, size: 140 },
  ];

  return (
    <>
      {stains.map((s, i) => (
        <div
          key={i}
          className="coffee-stain absolute pointer-events-none"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
        />
      ))}
    </>
  );
}
