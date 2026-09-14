"use client";

import { useEffect, useState } from "react";

function applyTheme(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  document.documentElement.style.colorScheme = next ? "dark" : "light";
  try {
    localStorage.setItem("theme", next ? "dark" : "light");
  } catch {
    // ignore (e.g. storage disabled)
  }
}

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
      <span suppressHydrationWarning className="text-base leading-none">
        {mounted && dark ? "☀" : "☾"}
      </span>
    </button>
  );
}
