import { cache } from "react";
import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/i18n/config";
import { client } from "./client";
import { hasSanity } from "./env";
import {
  t,
  type BioItem,
  type L,
  type NavItem,
  type Post,
  type PostMeta,
  type Profile,
  type ProjectItem,
  type RawL,
  type SiteSettings,
  type SocialIcon,
  type SocialLink,
  type UiStrings,
} from "./types";

// Content comes only from Sanity: anything left blank in the Studio is not
// rendered. Only interface strings (src/i18n/dictionaries) have defaults.

// Project a localized object {en, zhTW} into the frontend `L` shape {en, "zh-TW"}.
const LOC = `{en, "zh-TW": zhTW}`;

const EMPTY: L = { en: "", "zh-TW": "" };

/** Sanity `{en, zhTW}` → `L`, falling back per language to `fallback`. */
function loc(raw: RawL | null | undefined, fallback: L = EMPTY): L {
  return {
    en: raw?.en?.trim() || fallback.en,
    "zh-TW": raw?.zhTW?.trim() || fallback["zh-TW"],
  };
}

/** Projected `L` (either side may be null) → trimmed `L`. */
function orL(raw: Partial<Record<keyof L, string | null>> | null | undefined): L {
  return { en: raw?.en?.trim() || "", "zh-TW": raw?.["zh-TW"]?.trim() || "" };
}

const hasText = (l: L) => Boolean(l.en || l["zh-TW"]);

// --- site settings -----------------------------------------------------------

interface RawNavItem {
  label?: RawL;
  linkType?: NavItem["linkType"];
  path?: string;
  url?: string;
  newTab?: boolean;
}

interface RawSocial {
  label?: RawL;
  icon?: SocialIcon;
  url?: string;
  keepColor?: boolean;
  iconUrl?: string;
  iconType?: string;
}

interface RawSettings {
  title?: RawL;
  titleTemplate?: RawL;
  description?: RawL;
  favicon?: { url?: string; mimeType?: string } | null;
  wordmark?: RawL;
  navItems?: RawNavItem[] | null;
  showLangToggle?: boolean | null;
  showThemeToggle?: boolean | null;
  langToggleLabel?: RawL;
  copyright?: RawL;
  socials?: RawSocial[] | null;
  ui?: UiStrings | null;
}

const SETTINGS_QUERY = `*[_type=="siteSettings"][0]{
  title, titleTemplate, description,
  "favicon": favicon.asset->{url, mimeType},
  wordmark, navItems, showLangToggle, showThemeToggle, langToggleLabel,
  copyright,
  socials[]{
    label, icon, url, keepColor,
    "iconUrl": customIcon.asset->url,
    "iconType": customIcon.asset->mimeType
  },
  ui
}`;

// Interface default for the language toggle (it is visible unless switched off).
const LANG_TOGGLE_LABEL: L = { en: "中文", "zh-TW": "EN" };

const EMPTY_SETTINGS: SiteSettings = {
  title: EMPTY,
  titleTemplate: EMPTY,
  description: EMPTY,
  favicon: undefined,
  wordmark: EMPTY,
  navItems: [],
  showLangToggle: true,
  showThemeToggle: true,
  langToggleLabel: LANG_TOGGLE_LABEL,
  copyright: EMPTY,
  socials: [],
  ui: {},
};

const SVG = "image/svg+xml";

function favicon(url: string, mimeType?: string): SiteSettings["favicon"] {
  if (mimeType === SVG) return { url, type: SVG };
  return {
    url: `${url}?w=64&h=64&fit=crop&fm=png`,
    type: "image/png",
    appleUrl: `${url}?w=180&h=180&fit=crop&fm=png`,
  };
}

/** A bare email address becomes a mailto: link. */
function normalizeUrl(url: string) {
  return /^[^\s@/:]+@[^\s@/]+\.[^\s@/]+$/.test(url) ? `mailto:${url}` : url;
}

/** Fetch a custom icon at build time as a data URI (usable as a CSS mask). */
async function iconDataUri(url: string, type?: string) {
  const isSvg = type === SVG;
  try {
    const res = await fetch(isSvg ? url : `${url}?w=64&h=64&fit=max&fm=png`);
    if (!res.ok) return undefined;
    const data = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${isSvg ? SVG : "image/png"};base64,${data}`;
  } catch {
    return undefined;
  }
}

async function toSocial(raw: RawSocial): Promise<SocialLink> {
  const social: SocialLink = {
    label: loc(raw.label),
    icon: raw.icon ?? "link",
    url: normalizeUrl(raw.url?.trim() ?? ""),
  };
  if (raw.iconUrl) {
    if (raw.keepColor) {
      social.imageUrl =
        raw.iconType === SVG ? raw.iconUrl : `${raw.iconUrl}?w=64&h=64&fit=max`;
    } else {
      social.maskUrl = await iconDataUri(raw.iconUrl, raw.iconType);
    }
  }
  return social;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!hasSanity) return EMPTY_SETTINGS;
  const raw = await client.fetch<RawSettings | null>(SETTINGS_QUERY);
  if (!raw) return EMPTY_SETTINGS;

  return {
    title: loc(raw.title),
    titleTemplate: loc(raw.titleTemplate),
    description: loc(raw.description),
    favicon: raw.favicon?.url
      ? favicon(raw.favicon.url, raw.favicon.mimeType)
      : undefined,
    wordmark: loc(raw.wordmark),
    navItems: (raw.navItems ?? [])
      .map((item) => ({
        label: loc(item.label),
        linkType: item.linkType ?? "home",
        path: item.path,
        url: item.url,
        newTab: item.newTab ?? false,
      }))
      .filter((item) => hasText(item.label)),
    showLangToggle: raw.showLangToggle ?? true,
    showThemeToggle: raw.showThemeToggle ?? true,
    langToggleLabel: loc(raw.langToggleLabel, LANG_TOGGLE_LABEL),
    copyright: loc(raw.copyright),
    socials: (
      await Promise.all((raw.socials ?? []).filter((s) => s.url?.trim()).map(toSocial))
    ),
    ui: raw.ui ?? {},
  };
});

// --- profile -----------------------------------------------------------------

const PROFILE_QUERY = `*[_type=="profile"][0]{
  email, resumeUrl,
  wordmark${LOC},
  intro${LOC},
  tags[]${LOC},
  bio[]{
    "text": select(
      _type == "localeString" => {"en": en, "zh-TW": zhTW},
      text{"en": en, "zh-TW": zhTW}
    ),
    period${LOC}
  },
  skills[]${LOC},
  experience[]{
    // Items saved before 經歷 became projects used role (→ title) / org (→ client).
    "title": coalesce(title, role)${LOC},
    "client": coalesce(client, org)${LOC},
    description${LOC},
    period${LOC}, url,
    "postSlug": post->slug.current
  }
}`;

type Raw<T> = { [K in keyof T]?: T[K] | null };

interface RawProfile {
  wordmark?: L | null;
  tags?: L[] | null;
  intro?: L | null;
  email?: string | null;
  // Items saved before bio had years are plain localeStrings (period null).
  bio?: Raw<BioItem>[] | null;
  resumeUrl?: string | null;
  skills?: L[] | null;
  experience?: Raw<ProjectItem>[] | null;
}

const EMPTY_PROFILE: Profile = {
  wordmark: EMPTY,
  tags: [],
  intro: EMPTY,
  email: "",
  bio: [],
  resumeUrl: undefined,
  skills: [],
  experience: [],
};

const texts = (list: L[] | null | undefined) => (list ?? []).map(orL).filter(hasText);

export const getProfile = cache(async (): Promise<Profile> => {
  if (!hasSanity) return EMPTY_PROFILE;
  const raw = await client.fetch<RawProfile | null>(PROFILE_QUERY);
  if (!raw) return EMPTY_PROFILE;
  return {
    wordmark: orL(raw.wordmark),
    tags: texts(raw.tags),
    intro: orL(raw.intro),
    email: raw.email?.trim() || "",
    bio: (raw.bio ?? [])
      .map((b): BioItem => ({ text: orL(b?.text), period: orL(b?.period) }))
      .filter((b) => hasText(b.text)),
    resumeUrl: raw.resumeUrl?.trim() || undefined,
    skills: texts(raw.skills),
    experience: (raw.experience ?? [])
      .map(
        (e): ProjectItem => ({
          title: orL(e?.title),
          client: orL(e?.client),
          description: orL(e?.description),
          period: orL(e?.period),
          url: e?.url?.trim() || undefined,
          postSlug: e?.postSlug || undefined,
        }),
      )
      .filter((e) => hasText(e.title)),
  };
});

// --- posts -------------------------------------------------------------------

interface RawPostMeta {
  slug: string;
  title: L;
  client?: L | null;
  summary?: L;
  date?: string;
  tags?: L[] | null;
  cover?: string;
}

const POST_FIELDS = `
  "slug": slug.current,
  title${LOC},
  client${LOC},
  summary${LOC},
  "date": date,
  tags[]${LOC},
  "cover": cover.asset->url
`;

function toMeta(p: RawPostMeta, locale: Locale): PostMeta {
  return {
    slug: p.slug,
    title: t(p.title, locale),
    client: t(p.client, locale).trim(),
    summary: p.summary ? t(p.summary, locale) : "",
    date: p.date ? p.date.slice(0, 10) : "",
    tags: (p.tags ?? []).map((tag) => t(tag, locale)).filter(Boolean),
    cover: p.cover,
  };
}

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  if (!hasSanity) return [];
  const raw = await client.fetch<RawPostMeta[]>(
    `*[_type=="post" && defined(slug.current)]|order(date desc){${POST_FIELDS}}`,
  );
  return (raw ?? []).map((p) => toMeta(p, locale));
}

export async function getAllSlugs(): Promise<string[]> {
  if (!hasSanity) return [];
  return (
    (await client.fetch<string[]>(
      `*[_type=="post" && defined(slug.current)].slug.current`,
    )) ?? []
  );
}

interface RawPost extends RawPostMeta {
  model?: string;
  body?: {
    en?: PortableTextBlock[];
    "zh-TW"?: PortableTextBlock[];
  };
}

// Resolve embedded 3D model file URLs inside the Portable Text body.
const BODY_PROJECTION = `body{
  "en": en[]{ ..., _type=="modelBlock" => { ..., "src": file.asset->url } },
  "zh-TW": zhTW[]{ ..., _type=="modelBlock" => { ..., "src": file.asset->url } }
}`;

export async function getPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  if (!hasSanity) return null;
  const raw = await client.fetch<RawPost | null>(
    `*[_type=="post" && slug.current==$slug][0]{
      ${POST_FIELDS},
      "model": model.asset->url,
      ${BODY_PROJECTION}
    }`,
    { slug },
  );
  if (!raw) return null;
  const body = raw.body?.[locale];
  return {
    ...toMeta(raw, locale),
    model: raw.model,
    body: body?.length ? body : (raw.body?.en ?? []),
  };
}
