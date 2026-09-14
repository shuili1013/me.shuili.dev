import type { PortableTextBlock } from "@portabletext/types";
import type { L, Profile } from "./types";

// Shown until the Sanity project is configured + seeded. Once env is set and
// content is published, getProfile() returns the live CMS data instead.
export const placeholderProfile: Profile = {
  wordmark: "Shuili.dev",
  name: { en: "Shuili", "zh-TW": "Shuili" },
  tags: [
    { en: "Developer", "zh-TW": "開發者" },
    { en: "WebDev", "zh-TW": "網頁開發" },
    { en: "3D", "zh-TW": "3D" },
    { en: "Builder", "zh-TW": "自造者" },
  ],
  intro: {
    en: "Hi, I'm Shuili — I build web apps and tools, tinker with 3D and hardware, and enjoy turning ideas into things people can actually use.",
    "zh-TW":
      "你好，我是 Shuili — 我做網頁應用與各種工具，喜歡玩 3D 與硬體，享受把想法變成真的能用的東西。",
  },
  email: "member@haus.tw",
  bio: [
    { en: "Your University — Major (Program)", "zh-TW": "你的大學 — 科系（學程）" },
    { en: "Some Club — Role", "zh-TW": "某社團 — 職務" },
    { en: "Side Projects — Maker", "zh-TW": "個人專案 — 自造者" },
  ],
  resumeUrl: undefined,
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Three.js / R3F",
    "Tailwind CSS",
    "Python",
    "Docker",
  ],
  experience: [
    {
      role: { en: "Software Developer", "zh-TW": "軟體開發者" },
      org: { en: "Haus", "zh-TW": "Haus" },
      period: { en: "2024 - Present", "zh-TW": "2024 - 至今" },
    },
    {
      role: { en: "Freelance / Side Projects", "zh-TW": "接案 / 個人專案" },
      org: { en: "Self", "zh-TW": "自由工作" },
      period: { en: "2021 - 2024", "zh-TW": "2021 - 2024" },
    },
  ],
  socials: [
    { kind: "github", href: "https://github.com/" },
    { kind: "x", href: "https://x.com/" },
    { kind: "linkedin", href: "https://linkedin.com/" },
    { kind: "instagram", href: "https://instagram.com/" },
    { kind: "email", href: "mailto:member@haus.tw" },
  ],
};

// --- placeholder posts (until Sanity is seeded) ------------------------------
export interface RawPlaceholderPost {
  slug: string;
  title: L;
  summary: L;
  date: string;
  tags: string[];
  body: Record<"en" | "zh-TW", PortableTextBlock[]>;
}

const para = (text: string, style = "normal"): PortableTextBlock =>
  ({
    _type: "block",
    _key: `${style}-${text.slice(0, 6)}`,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: "s", text, marks: [] }],
  }) as unknown as PortableTextBlock;

export const placeholderPosts: RawPlaceholderPost[] = [
  {
    slug: "this-site",
    title: { en: "Building this site", "zh-TW": "打造這個網站" },
    summary: {
      en: "A bilingual personal site with an interactive 3D viewer.",
      "zh-TW": "一個中英雙語的個人網站，內建可互動的 3D 檢視器。",
    },
    date: "2026-06-20",
    tags: ["Next.js", "React", "3D"],
    body: {
      en: [
        para(
          "This is the site you're looking at — a statically-exported Next.js app with EN / 中文, dark mode and an interactive 3D viewer.",
        ),
      ],
      "zh-TW": [
        para(
          "這就是你正在看的網站 —— 一個靜態匯出的 Next.js 應用，支援中英、深色模式與互動式 3D 檢視器。",
        ),
      ],
    },
  },
  {
    slug: "haus",
    title: { en: "Haus", "zh-TW": "Haus" },
    summary: {
      en: "A product I help build — web platform, services and operations.",
      "zh-TW": "我參與打造的產品 — 網頁平台、服務與營運。",
    },
    date: "2026-03-01",
    tags: ["Next.js", "Node.js", "Product"],
    body: {
      en: [para("Haus is a web product I work on day to day.")],
      "zh-TW": [para("Haus 是我日常參與的網頁產品。")],
    },
  },
];
