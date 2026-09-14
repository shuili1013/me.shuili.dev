"use client";

// App Router re-mounts template.tsx on every navigation, so this wrapper's
// CSS enter-animation replays on each page change. Pure CSS — no library.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
