// 16×16 pixel-art icon drawn with crisp rects. Keep paths centered on (8,8) so
// the icon sits dead-center in its button.
export function PixelGlyph({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden
      className="block"
    >
      <path d={d} />
    </svg>
  );
}
