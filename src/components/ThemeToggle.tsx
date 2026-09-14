"use client";

import { useEffect, useState } from "react";
import { PixelGlyph } from "./PixelGlyph";

function applyTheme(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  document.documentElement.style.colorScheme = next ? "dark" : "light";
  try {
    localStorage.setItem("theme", next ? "dark" : "light");
  } catch {
    // ignore (e.g. storage disabled)
  }
}

// 16×16 pixel-art glyphs, both centered on (8,8) so they sit dead-center in the
// button (the ☀/☾ text glyphs were offset by the pixel font's metrics).
const SUN =
  "M7 1h2v2h-2zM2 3h2v2h-2zM12 3h2v2h-2zM6 4h4v1h-4zM5 5h6v1h-6zM4 6h8v4h-8zM1 7h2v2h-2zM13 7h2v2h-2zM5 10h6v1h-6zM6 11h4v1h-4zM2 11h2v2h-2zM12 11h2v2h-2zM7 13h2v2h-2z";
const MOON =
  "M5 2h1v1h-1zM4 3h2v1h-2zM3 4h2v1h-2zM2 5h3v1h-3zM2 6h3v1h-3zM2 7h4v1h-4zM2 8h4v1h-4zM2 9h5v1h-5zM2 10h7v1h-7zM12 10h2v1h-2zM3 11h10v1h-10zM4 12h8v1h-8zM5 13h6v1h-6z";

export function ThemeToggle({ ariaLabel }: { ariaLabel: string }) {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !document.documentElement.classList.contains("dark");

    const startViewTransition = (
      document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      }
    ).startViewTransition?.bind(document);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No View Transitions support (or reduced motion) → just switch.
    if (!startViewTransition || reduce) {
      applyTheme(next);
      setDark(next);
      return;
    }

    // Circular reveal that spreads out from the button.
    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = startViewTransition(() => {
      applyTheme(next);
      setDark(next);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
    >
      <PixelGlyph d={mounted && dark ? SUN : MOON} />
    </button>
  );
}
