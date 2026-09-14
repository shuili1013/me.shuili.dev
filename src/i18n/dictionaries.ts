import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import zhTW from "./dictionaries/zh-TW.json";
import { getSiteSettings } from "@/sanity/queries";

export type Dictionary = typeof en;

// Bundled defaults; each string can be overridden in Studio → 網站設定 → 介面文字.
const defaults: Record<Locale, Dictionary> = { en, "zh-TW": zhTW };

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const { ui } = await getSiteSettings();
  const field = locale === "zh-TW" ? "zhTW" : "en";
  return Object.fromEntries(
    Object.entries(defaults[locale]).map(([group, strings]) => [
      group,
      Object.fromEntries(
        Object.entries(strings).map(([key, fallback]) => [
          key,
          ui[group]?.[key]?.[field]?.trim() || fallback,
        ]),
      ),
    ]),
  ) as Dictionary;
}
