/**
 * One-time content import. Fills Site settings, Profile and two sample posts
 * with the site's built-in defaults, so every Studio field starts populated.
 * Documents that already exist are left untouched (createIfNotExists).
 *
 *   npm run seed
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN from .env.local (or the environment).
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import en from "../src/i18n/dictionaries/en.json";
import zhTW from "../src/i18n/dictionaries/zh-TW.json";
import {
  placeholderProfile,
  placeholderSettings,
} from "../src/sanity/placeholder";
import type { L } from "../src/sanity/types";

// --- tiny .env.local loader (no dotenv dependency) ---------------------------
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN (set them in .env.local).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

// --- helpers -----------------------------------------------------------------
let n = 0;
const key = () => `k${(n++).toString(36)}${Math.floor(Math.random() * 1e6)}`;

const same = (text: string): L => ({ en: text, "zh-TW": text });
const lstr = (l: L) => ({ _type: "localeString", en: l.en, zhTW: l["zh-TW"] });
const ltext = (l: L) => ({ _type: "localeText", en: l.en, zhTW: l["zh-TW"] });
const lstrKeyed = (l: L) => ({ ...lstr(l), _key: key() });

const block = (text: string, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const portable = (
  enBlocks: ReturnType<typeof block>[],
  zhBlocks: ReturnType<typeof block>[],
) => ({
  _type: "localePortableText",
  en: enBlocks,
  zhTW: zhBlocks,
});

// --- site settings -----------------------------------------------------------
type Strings = Record<string, Record<string, string>>;
const s = placeholderSettings;

const ui = Object.fromEntries(
  Object.entries(en as Strings).map(([group, strings]) => [
    group,
    Object.fromEntries(
      Object.entries(strings).map(([k, value]) => [
        k,
        lstr({ en: value, "zh-TW": (zhTW as Strings)[group][k] }),
      ]),
    ),
  ]),
);

const settingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  title: lstr(s.title),
  titleTemplate: lstr(s.titleTemplate),
  description: ltext(s.description),
  wordmark: lstr(s.wordmark),
  navItems: s.navItems.map((item) => ({
    _type: "navItem",
    _key: key(),
    label: lstr(item.label),
    linkType: item.linkType,
    newTab: item.newTab,
  })),
  showLangToggle: s.showLangToggle,
  showThemeToggle: s.showThemeToggle,
  langToggleLabel: lstr(s.langToggleLabel),
  copyright: lstr(s.copyright),
  socials: s.socials.map((social) => ({
    _type: "social",
    _key: key(),
    label: lstr(social.label),
    icon: social.icon,
    url: social.url,
  })),
  ui,
};

// --- profile -----------------------------------------------------------------
const p = placeholderProfile;
const profileDoc = {
  _id: "profile",
  _type: "profile",
  wordmark: lstr(p.wordmark),
  tags: p.tags.map(lstrKeyed),
  intro: ltext(p.intro),
  email: p.email,
  bio: p.bio.map(lstrKeyed),
  skills: p.skills.map(lstrKeyed),
  experience: p.experience.map((e) => ({
    _type: "experienceItem",
    _key: key(),
    role: lstr(e.role),
    org: lstr(e.org),
    period: lstr(e.period),
  })),
};

// --- sample posts ------------------------------------------------------------
const posts = [
  {
    _id: "post-this-site",
    _type: "post",
    title: lstr({ en: "Building this site", "zh-TW": "打造這個網站" }),
    slug: { _type: "slug", current: "this-site" },
    date: "2026-06-20",
    summary: ltext({
      en: "A bilingual personal site with an interactive 3D viewer, built with Next.js and React Three Fiber.",
      "zh-TW":
        "一個中英雙語的個人網站，內建可互動的 3D 檢視器，用 Next.js 與 React Three Fiber 打造。",
    }),
    tags: ["Next.js", "React", "3D"].map(same).map(lstrKeyed),
    body: portable(
      [
        block(
          "This is the site you're looking at — a statically exported Next.js app with full EN / 中文 support, dark mode, and an interactive 3D viewer.",
        ),
        block("The 3D viewer", "h2"),
        block(
          "Add a 3D block in the Studio body and upload a .glb file. Drag to orbit, scroll to zoom.",
        ),
      ],
      [
        block(
          "這就是你正在看的網站 —— 一個靜態匯出的 Next.js 應用，完整支援中英文、深色模式與互動式 3D 檢視器。",
        ),
        block("3D 檢視器", "h2"),
        block("在後台內文插入 3D 模型區塊並上傳 .glb 檔，拖曳可旋轉、滾輪可縮放。"),
      ],
    ),
  },
  {
    _id: "post-haus",
    _type: "post",
    title: lstr(same("Haus")),
    slug: { _type: "slug", current: "haus" },
    date: "2026-03-01",
    summary: ltext({
      en: "A product I help build — web platform, services and operations.",
      "zh-TW": "我參與打造的產品 — 網頁平台、服務與營運。",
    }),
    tags: [same("Next.js"), same("Node.js"), { en: "Product", "zh-TW": "產品" }].map(
      lstrKeyed,
    ),
    body: portable(
      [
        block(
          "Haus is a web product I work on day to day, covering the frontend experience, backend services and the operations that keep it running.",
        ),
      ],
      [block("Haus 是我日常參與的網頁產品，涵蓋前端體驗、後端服務，以及維持它運作的營運工作。")],
    ),
  },
];

const docs: { _id: string; _type: string }[] = [settingsDoc, profileDoc, ...posts];

async function run() {
  for (const doc of docs) {
    const existing = await client.getDocument(doc._id);
    if (existing) {
      console.log(`· skipped (already exists)  ${doc._id}`);
      continue;
    }
    await client.createIfNotExists(doc);
    console.log(`✓ created  ${doc._id}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
