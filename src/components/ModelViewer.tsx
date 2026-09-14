"use client";

import { createContext, useContext } from "react";
import dynamic from "next/dynamic";

const LoadingLabel = createContext("");

function Loading() {
  const label = useContext(LoadingLabel);
  return (
    <div className="absolute inset-0 grid place-items-center text-sm text-muted">
      {label}
    </div>
  );
}

// WebGL can't be server-rendered, so load the canvas client-side only.
const ModelScene = dynamic(() => import("./ModelScene"), {
  ssr: false,
  loading: Loading,
});

export function ModelViewer({
  src,
  loadingLabel,
  hint,
  className = "",
}: {
  src?: string;
  loadingLabel: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={`relative my-6 h-[360px] w-full overflow-hidden rounded-xl border border-border bg-card sm:h-[440px] ${className}`}
    >
      <LoadingLabel value={loadingLabel}>
        <ModelScene src={src} />
      </LoadingLabel>
      <span className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-muted">
        {hint}
      </span>
    </div>
  );
}

export default ModelViewer;
