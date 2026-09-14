import { cache } from "react";
import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/i18n/config";
import { client } from "./client";
import { hasSanity } from "./env";
import {
  placeholderPosts,
  placeholderProfile,
  placeholderSettings,
} from "./placeholder";
import {
  t,
  type L,
  type NavItem,
  type Post,
  type PostMeta,
  type Profile,
  type RawL,
  type SiteSettings,
  type SocialIcon,
  type SocialLink,
  type UiStrings,
} from "./types";

// Project a localized object {en, zhTW} into the frontend `L` shape {en, "zh-TW"}.
const LOC = `{en, "zh-TW": zhTW}`;

const EMPTY: L = { en: "", "zh-TW": "" };

/** Sanity `{en, zhTW}` → `L`, falling back per language to `fallback`. */
function loc(raw: RawL | null | undefined, fallback: L): L {
  return {
    en: raw?.en?.trim() || fallback.en,
    "zh-TW": raw?.zhTW?.trim() || fallback["zh-TW"],
  };
}

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

const SVG = "image/svg+xml";

function favicon(url: string, mimeType?: string): SiteSettings["favicon"] {
  if (mimeType === SVG) return { url, type: SVG };
  return {
    url: `${url}?w=64&h=64&fit=crop&fm=png`,
    type: "image/png",
    appleUrl: `${url}?w=180&h=180&fit=crop&fm=png`,
  };
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
    label: loc(raw.label, EMPTY),
    icon: raw.icon ?? "link",
    url: raw.url ?? "#",
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

/** Site settings with every blank field filled from the built-in defaults. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const d = placeholderSettings;
  if (!hasSanity) return d;
  const raw = await client.fetch<RawSettings | null>(SETTINGS_QUERY);
  if (!raw) return d;

  return {
    title: loc(raw.title, d.title),
    titleTemplate: loc(raw.titleTemplate, d.titleTemplate),
    description: loc(raw.description, d.description),
    favicon: raw.favicon?.url
      ? favicon(raw.favicon.url, raw.favicon.mimeType)
      : undefined,
    wordmark: loc(raw.wordmark, d.wordmark),
    navItems: raw.navItems?.length
      ? raw.navItems.map((item) => ({
          label: loc(item.label, EMPTY),
          linkType: item.linkType ?? "home",
          path: item.path,
          url: item.url,
          newTab: item.newTab ?? false,
        }))
      : d.navItems,
    showLangToggle: raw.showLangToggle ?? true,
    showThemeToggle: raw.showThemeToggle ?? true,
    langToggleLabel: loc(raw.langToggleLabel, d.langToggleLabel),
    copyright: loc(raw.copyright, d.copyright),
    socials: raw.socials?.length
      ? await Promise.all(raw.socials.map(toSocial))
      : d.socials,
    ui: raw.ui ?? {},
  };
});

// --- profile -----------------------------------------------------------------

const PROFILE_QUERY = `*[_type=="profile"][0]{
  email, resumeUrl,
  wordmark${LOC},
  intro${LOC},
  tags[]${LOC},
  bio[]${LOC},
  skills[]${LOC},
  experience[]{ role${LOC}, org${LOC}, period${LOC} }
}`;

type RawProfile = { [K in keyof Profile]?: Profile[K] | null };

export const getProfile = cache(async (): Promise<Profile> => {
  if (!hasSanity) return placeholderProfile;
  const raw = await client.fetch<RawProfile | null>(PROFILE_QUERY);
  if (!raw) return placeholderProfile;
  return {
    wordmark: raw.wordmark ?? placeholderProfile.wordmark,
    tags: raw.tags ?? [],
    intro: raw.intro ?? EMPTY,
    email: raw.email ?? "",
    bio: raw.bio ?? [],
    resumeUrl: raw.resumeUrl ?? undefined,
    skills: raw.skills ?? [],
    experience: raw.experience ?? [],
  };
});

// --- posts -------------------------------------------------------------------

interface RawPostMeta {
  slug: string;
  title: L;
  summary?: L;
  date?: string;
  tags?: L[] | null;
  cover?: string;
}

const POST_FIELDS = `
  "slug": slug.current,
  title${LOC},
  summary${LOC},
  "date": date,
  tags[]${LOC},
  "cover": cover.asset->url
`;

function toMeta(p: RawPostMeta, locale: Locale): PostMeta {
  return {
    slug: p.slug,
    title: t(p.title, locale),
    summary: p.summary ? t(p.summary, locale) : "",
    date: p.date ? p.date.slice(0, 10) : "",
    tags: (p.tags ?? []).map((tag) => t(tag, locale)).filter(Boolean),
    cover: p.cover,
  };
}

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  if (!hasSanity) {
    return placeholderPosts.map((p) => ({
      slug: p.slug,
      title: t(p.title, locale),
      summary: t(p.summary, locale),
      date: p.date,
      tags: p.tags.map((tag) => t(tag, locale)),
    }));
  }
  const raw = await client.fetch<RawPostMeta[]>(
    `*[_type=="post" && defined(slug.current)]|order(date desc){${POST_FIELDS}}`,
  );
  return (raw ?? []).map((p) => toMeta(p, locale));
}

export async function getAllSlugs(): Promise<string[]> {
  if (!hasSanity) return placeholderPosts.map((p) => p.slug);
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
  if (!hasSanity) {
    const p = placeholderPosts.find((x) => x.slug === slug);
    if (!p) return null;
    return {
      slug: p.slug,
      title: t(p.title, locale),
      summary: t(p.summary, locale),
      date: p.date,
      tags: p.tags.map((tag) => t(tag, locale)),
      body: p.body[locale] ?? p.body.en,
    };
  }
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
