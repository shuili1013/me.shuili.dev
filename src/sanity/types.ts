import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/i18n/config";

// A bilingual string. Pick a language with `t(value, locale)`.
export type L = Record<Locale, string>;

export function t(value: L, locale: Locale): string {
  return value?.[locale] ?? value?.en ?? "";
}

export type SocialKind = "github" | "x" | "linkedin" | "instagram" | "email";

export interface SocialLink {
  kind: SocialKind;
  href: string;
}

export interface Experience {
  role: L;
  org: L;
  period: L;
}

export interface Profile {
  wordmark: string;
  name: L;
  tags: L[];
  intro: L;
  email: string;
  bio: L[];
  resumeUrl?: string;
  skills: string[];
  experience: Experience[];
  socials: SocialLink[];
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  model?: string;
}

export interface Post extends PostMeta {
  body: PortableTextBlock[];
}
