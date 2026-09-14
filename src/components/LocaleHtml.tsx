"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

// Keeps <html lang> in sync with the active locale on client navigations
// (the root layout's lang is static; the theme script sets it on first load).
export function LocaleHtml({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
