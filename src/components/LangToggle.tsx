"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LangToggle({
  locale,
  label,
  ariaLabel,
}: {
  locale: Locale;
  label: string;
  ariaLabel: string;
}) {
  const pathname = usePathname() || `/${locale}`;
  const other = locales.find((l) => l !== locale) ?? locale;

  // Swap the locale segment (first path part) while keeping the current page.
  const segments = pathname.split("/");
  segments[1] = other;
  const href = segments.join("/") || `/${other}`;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="text-sm text-muted transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
}
