"use client";

import dynamic from "next/dynamic";

// WebGL can't be server-rendered, so load the canvas client-side only.
const ModelScene = dynamic(() => import("./ModelScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center text-sm text-muted">
      Loading 3D…
    </div>
  ),
});

export function ModelViewer({
  src,
  className = "",
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative my-6 h-[360px] w-full overflow-hidden rounded-xl border border-border bg-card sm:h-[440px] ${className}`}
    >
      <ModelScene src={src} />
      <span className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-muted">
        drag · scroll
      </span>
    </div>
  );
}

export default ModelViewer;
