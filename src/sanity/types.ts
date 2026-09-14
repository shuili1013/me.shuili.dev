import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/i18n/config";

// A bilingual string. Pick a language with `t(value, locale)`.
export type L = Record<Locale, string>;

// A bilingual string as stored in Sanity (`zhTW` field; either side may be unset).
export interface RawL {
  en?: string | null;
  zhTW?: string | null;
}

export function t(value: L | null | undefined, locale: Locale): string {
  return value?.[locale] || value?.en || "";
}

export const socialIcons = [
  "github",
  "x",
  "linkedin",
  "instagram",
  "threads",
  "facebook",
  "youtube",
  "discord",
  "telegram",
  "bluesky",
  "email",
  "link",
] as const;

export type SocialIcon = (typeof socialIcons)[number];

export interface SocialLink {
  label: L;
  icon: SocialIcon;
  url: string;
  /** Custom icon as a data URI, drawn as a mask so it follows the text color. */
  maskUrl?: string;
  /** Custom icon shown as-is (keeps its original colors). */
  imageUrl?: string;
}

export type NavLinkType = "home" | "blog" | "path" | "external";

export interface NavItem {
  label: L;
  linkType: NavLinkType;
  /** Site path without the locale prefix, e.g. `/blog/haus` (linkType "path"). */
  path?: string;
  /** Absolute URL (linkType "external"). */
  url?: string;
  newTab: boolean;
}

/** Site settings → UI text as stored in Sanity: group → key → localized string. */
export type UiStrings = Record<string, Record<string, RawL | null> | null>;

export interface SiteSettings {
  title: L;
  titleTemplate: L;
  description: L;
  favicon?: { url: string; type: string; appleUrl?: string };
  wordmark: L;
  navItems: NavItem[];
  showLangToggle: boolean;
  showThemeToggle: boolean;
  langToggleLabel: L;
  copyright: L;
  socials: SocialLink[];
  ui: UiStrings;
}

/** Where I studied / worked, e.g. "大同大學 — 資訊工程學系" + "2020 - 2024". */
export interface BioItem {
  text: L;
  period: L;
}

/** A project I've done (the 經歷 section). */
export interface ProjectItem {
  title: L;
  /** 案主 — shown as a subtitle. */
  client: L;
  description: L;
  period: L;
  /** Project page: absolute URL, or a site path like `/blog/haus`. */
  url?: string;
  /** Slug of a related blog post. */
  postSlug?: string;
}

export interface Profile {
  wordmark: L;
  tags: L[];
  intro: L;
  email: string;
  bio: BioItem[];
  resumeUrl?: string;
  skills: L[];
  experience: ProjectItem[];
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  /** 案主; empty when not set. */
  client: string;
  summary: string;
  tags: string[];
  cover?: string;
  model?: string;
}

export interface Post extends PostMeta {
  body: PortableTextBlock[];
}
