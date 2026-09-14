"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
} from "react";
import { usePathname } from "next/navigation";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*#";

// Scramble on the first load and whenever the locale changes (either direction).
// Same-locale navigation does not replay. `prevLocale` updates on a microtask so
// every heading in one render batch sees the same previous value (and it's safe
// under React StrictMode's synchronous double-invoke).
let prevLocale: string | null = null;
let scheduled = false;
function shouldScramble(locale: string): boolean {
  const animate = prevLocale === null || prevLocale !== locale;
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(() => {
      prevLocale = locale;
      scheduled = false;
    });
  }
  return animate;
}

export function Scramble({
  text,
  as,
  className,
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const Tag = as ?? "span";
  const pathname = usePathname();
  // SSR + first client render output the final text (no hydration mismatch).
  const [display, setDisplay] = useState(text);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const locale = (pathname ?? "").split("/")[1] ?? "";
    if (reduce || !shouldScramble(locale)) {
      setDisplay(text);
      return;
    }

    const len = text.length;
    const DURATION = 900; // ms — left-to-right decode
    let start: number | undefined;

    const tick = (now: number) => {
      if (start === undefined) start = now;
      const p = Math.min(1, (now - start) / DURATION);
      const revealed = Math.floor(p * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " " || i < revealed) out += ch;
        else out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(out);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, pathname]);

  return createElement(
    Tag,
    { className, suppressHydrationWarning: true },
    display,
  );
}
