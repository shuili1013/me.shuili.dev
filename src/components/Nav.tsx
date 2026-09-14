"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";

export function Nav({
  locale,
  dict,
  wordmark,
}: {
  locale: Locale;
  dict: Dictionary;
  wordmark: string;
}) {
  const pathname = usePathname() || "";
  const base = `/${locale}`;

  const links = [
    { href: base, label: dict.nav.home, exact: true },
    { href: `${base}/blog`, label: dict.nav.work },
  ];

  const isActive = (href: string, exact?: boolean) => {
    const path = pathname.replace(/\/$/, "");
    const target = href.replace(/\/$/, "");
    return exact ? path === target : path.startsWith(target);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
        <Link href={base} className="font-bold">
          {wordmark}
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-foreground ${
                isActive(link.href, link.exact)
                  ? "text-foreground"
                  : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-border" />
          <LangToggle locale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
