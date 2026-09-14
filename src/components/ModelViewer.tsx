"use client";

import {
  Component,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import type { OrbitControls } from "@react-three/drei";
import { PixelGlyph } from "./PixelGlyph";

export interface ModelLabels {
  loading: string;
  error: string;
  hint: string;
  zoomHint: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
}

export type Controls = ComponentRef<typeof OrbitControls>;

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

// A model that can't load (CORS, deleted file, no WebGL) must not take the
// whole page down with it.
class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const ZOOM_STEP = 1.25;
const PLUS = "M7 3h2v10h-2zM3 7h10v2h-10z";
const MINUS = "M3 7h10v2h-10z";
const RESET =
  "M5 2h4v2h-4zM9 1h1v4h-1zM10 2h1v2h-1zM3 4h2v2h-2zM2 6h2v4h-2zM12 6h2v4h-2zM3 10h2v2h-2zM11 10h2v2h-2zM5 12h6v2h-6z";

function ControlButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center border border-border bg-background/80 text-muted backdrop-blur transition-colors hover:text-foreground"
    >
      <PixelGlyph d={icon} />
    </button>
  );
}

export function ModelViewer({
  src,
  labels,
  className = "",
}: {
  src?: string;
  labels: ModelLabels;
  className?: string;
}) {
  const controls = useRef<Controls | null>(null);
  const [spinning, setSpinning] = useState(true);
  const [failed, setFailed] = useState(false);
  const [showZoomHint, setShowZoomHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(hintTimer.current), []);

  // Auto-rotate until the visitor first interacts.
  const stop = () => setSpinning(false);

  const zoom = (factor: number) => {
    const c = controls.current;
    if (!c) return;
    stop();
    const offset = c.object.position.clone().sub(c.target).multiplyScalar(factor);
    offset.setLength(
      Math.min(c.maxDistance, Math.max(c.minDistance, offset.length())),
    );
    c.object.position.copy(c.target).add(offset);
    c.update();
  };

  const reset = () => {
    stop();
    controls.current?.reset();
  };

  // A plain wheel scrolls the page: stop it before it reaches OrbitControls.
  // Ctrl/⌘ + wheel (and trackpad pinch, which sets ctrlKey) still zooms.
  const onWheelCapture = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) return;
    e.stopPropagation();
    setShowZoomHint(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setShowZoomHint(false), 1200);
  };

  return (
    <div
      onWheelCapture={onWheelCapture}
      // One finger pans the page on touch screens (OrbitControls sets
      // touch-action: none inline, hence the !important).
      className={`relative my-6 h-[360px] w-full overflow-hidden rounded-xl border border-border bg-card sm:h-[440px] [&_*]:touch-pan-y! ${className}`}
    >
      {failed ? (
        <div className="absolute inset-0 grid place-items-center text-sm text-muted">
          {labels.error}
        </div>
      ) : (
        <SceneBoundary onError={() => setFailed(true)}>
          <LoadingLabel value={labels.loading}>
            <ModelScene
              src={src}
              controlsRef={controls}
              autoRotate={spinning}
              onInteract={stop}
            />
          </LoadingLabel>
        </SceneBoundary>
      )}

      {!failed && (
        <>
      <span
        className={`pointer-events-none absolute inset-x-0 top-3 mx-auto w-fit border border-border bg-background/90 px-3 py-1 text-xs text-muted transition-opacity duration-300 ${
          showZoomHint ? "opacity-100" : "opacity-0"
        }`}
      >
        {labels.zoomHint}
      </span>

      <span className="pointer-events-none absolute bottom-3 left-3 select-none text-xs text-muted">
        {labels.hint}
      </span>

      <div className="absolute right-3 bottom-3 flex gap-1">
        <ControlButton label={labels.zoomIn} icon={PLUS} onClick={() => zoom(1 / ZOOM_STEP)} />
        <ControlButton label={labels.zoomOut} icon={MINUS} onClick={() => zoom(ZOOM_STEP)} />
        <ControlButton label={labels.reset} icon={RESET} onClick={reset} />
      </div>
        </>
      )}
    </div>
  );
}

export default ModelViewer;
