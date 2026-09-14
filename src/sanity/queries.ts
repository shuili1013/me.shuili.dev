import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/i18n/config";
import { client } from "./client";
import { hasSanity } from "./env";
import { placeholderPosts, placeholderProfile } from "./placeholder";
import { t, type L, type Post, type PostMeta, type Profile } from "./types";

// Project a localized object {en, zhTW} into the frontend `L` shape {en, "zh-TW"}.
const LOC = `{en, "zh-TW": zhTW}`;

const PROFILE_QUERY = `*[_type=="profile"][0]{
  wordmark, email, resumeUrl, skills,
  name${LOC},
  intro${LOC},
  tags[]${LOC},
  bio[]${LOC},
  experience[]{ role${LOC}, org${LOC}, period${LOC} },
  socials[]{ kind, href }
}`;

export async function getProfile(): Promise<Profile> {
  if (!hasSanity) return placeholderProfile;
  return (await client.fetch<Profile | null>(PROFILE_QUERY)) ?? placeholderProfile;
}

interface RawPostMeta {
  slug: string;
  title: L;
  summary?: L;
  date?: string;
  tags?: string[];
  cover?: string;
}

const POST_FIELDS = `
  "slug": slug.current,
  title${LOC},
  summary${LOC},
  "date": date,
  tags,
  "cover": cover.asset->url
`;

function toMeta(p: RawPostMeta, locale: Locale): PostMeta {
  return {
    slug: p.slug,
    title: t(p.title, locale),
    summary: p.summary ? t(p.summary, locale) : "",
    date: p.date ? p.date.slice(0, 10) : "",
    tags: p.tags ?? [],
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
      tags: p.tags,
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
      tags: p.tags,
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
  return {
    ...toMeta(raw, locale),
    model: raw.model,
    body: raw.body?.[locale] ?? raw.body?.en ?? [],
  };
}
