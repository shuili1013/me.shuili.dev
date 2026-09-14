import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import zhTW from "./dictionaries/zh-TW.json";

const dictionaries = {
  en,
  "zh-TW": zhTW,
} as const;

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
