"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { t, type NavItem } from "@/sanity/types";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";

function hrefFor(item: NavItem, base: string): string {
  switch (item.linkType) {
    case "home":
      return base;
    case "blog":
      return `${base}/blog`;
    case "path":
      return base + (item.path ?? "").replace(/^\/?/, "/").replace(/\/+$/, "");
    case "external":
      return item.url || "#";
  }
}

export function Nav({
  locale,
  wordmark,
  items,
  langToggle,
  themeToggleAria,
}: {
  locale: Locale;
  wordmark: string;
  items: NavItem[];
  /** null hides the language toggle */
  langToggle: { label: string; ariaLabel: string } | null;
  /** null hides the theme toggle */
  themeToggleAria: string | null;
}) {
  const pathname = usePathname() || "";
  const base = `/${locale}`;
  const path = pathname.replace(/\/$/, "");

  const isActive = (href: string) =>
    href === base ? path === base : path === href || path.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
        <Link href={base} className="font-bold">
          {wordmark}
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {items.map((item, i) => {
            const href = hrefFor(item, base);
            const label = t(item.label, locale);
            if (item.linkType === "external" || item.newTab) {
              return (
                <a
                  key={i}
                  href={href}
                  target={item.newTab ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {label}
                </a>
              );
            }
            return (
              <Link
                key={i}
                href={href}
                className={`transition-colors hover:text-foreground ${
                  isActive(href) ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {(langToggle || themeToggleAria) && (
            <span className="h-4 w-px bg-border" />
          )}
          {langToggle && <LangToggle locale={locale} {...langToggle} />}
          {themeToggleAria && <ThemeToggle ariaLabel={themeToggleAria} />}
        </div>
      </div>
    </header>
  );
}
