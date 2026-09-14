/**
 * One-time content import. Creates the Profile singleton + two sample posts in
 * Sanity so the Studio has something to edit immediately.
 *
 * Run once after the project + token exist:
 *   npx tsx scripts/seed.ts
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_WRITE_TOKEN from .env.local (or the environment).
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { placeholderProfile } from "../src/sanity/placeholder";

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

type L = { en: string; "zh-TW": string };
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

const portable = (blocks: ReturnType<typeof block>[]) => ({
  _type: "localePortableText",
  en: blocks,
  zhTW: blocks,
});

// --- profile -----------------------------------------------------------------
const p = placeholderProfile;
const profileDoc = {
  _id: "profile",
  _type: "profile",
  wordmark: p.wordmark,
  name: lstr(p.name),
  tags: p.tags.map(lstrKeyed),
  intro: ltext(p.intro),
  email: p.email,
  bio: p.bio.map(lstrKeyed),
  resumeUrl: p.resumeUrl,
  skills: p.skills,
  experience: p.experience.map((e) => ({
    _type: "experienceItem",
    _key: key(),
    role: lstr(e.role),
    org: lstr(e.org),
    period: lstr(e.period),
  })),
  socials: p.socials.map((s) => ({
    _type: "social",
    _key: key(),
    kind: s.kind,
    href: s.href,
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
    tags: ["Next.js", "React", "3D"],
    body: portable([
      block(
        "This is the site you're looking at — a statically exported Next.js app with full EN / 中文 support, dark mode, and an interactive 3D viewer.",
      ),
      block("The 3D viewer", "h2"),
      block(
        "Add a 3D block in the Studio body and upload a .glb file. Drag to orbit, scroll to zoom.",
      ),
    ]),
  },
  {
    _id: "post-haus",
    _type: "post",
    title: lstr({ en: "Haus", "zh-TW": "Haus" }),
    slug: { _type: "slug", current: "haus" },
    date: "2026-03-01",
    summary: ltext({
      en: "A product I help build — web platform, services and operations.",
      "zh-TW": "我參與打造的產品 — 網頁平台、服務與營運。",
    }),
    tags: ["Next.js", "Node.js", "Product"],
    body: portable([
      block(
        "Haus is a web product I work on day to day, covering the frontend experience, backend services and the operations that keep it running.",
      ),
    ]),
  },
];

async function run() {
  await client.createOrReplace(profileDoc);
  for (const post of posts) await client.createOrReplace(post);
  console.log("✓ Seeded profile + " + posts.length + " posts into Sanity.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
