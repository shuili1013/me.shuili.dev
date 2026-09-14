import { defineArrayMember, defineField, defineType } from "sanity";
import en from "../../i18n/dictionaries/en.json";
import zhTW from "../../i18n/dictionaries/zh-TW.json";
import { socialIcons, type SocialIcon } from "../types";

const bilingual = (zh?: string, en?: string) =>
  [zh, en].filter(Boolean).join(" / ");

const iconTitles: Record<SocialIcon, string> = {
  github: "GitHub",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  threads: "Threads",
  facebook: "Facebook",
  youtube: "YouTube",
  discord: "Discord",
  telegram: "Telegram",
  bluesky: "Bluesky",
  email: "Email",
  link: "通用連結",
};

const linkTypeTitles = {
  home: "首頁",
  blog: "網誌列表",
  path: "站內其他頁面",
  external: "外部網址",
};

// Studio labels for every UI string. Defaults live in src/i18n/dictionaries/*.json.
type Strings = Record<string, Record<string, string>>;
const EN = en as Strings;
const ZH = zhTW as Strings;

const uiGroups: { name: string; title: string; fields: Record<string, string> }[] = [
  {
    name: "home",
    title: "首頁",
    fields: {
      email: "「Email」欄位名稱",
      bio: "「Bio」欄位名稱",
      resume: "「履歷」欄位名稱",
      sectionSkills: "技能區塊標題",
      sectionExperience: "經歷（專案）區塊標題",
      readPost: "經歷裡的「閱讀文章」按鈕",
      sectionFeatured: "精選作品區塊標題",
      viewAllWork: "「查看全部」連結",
    },
  },
  {
    name: "work",
    title: "網誌列表頁",
    fields: {
      title: "頁面標題",
      subtitle: "副標題",
      empty: "沒有文章時顯示的文字",
      all: "「全部」篩選按鈕",
    },
  },
  {
    name: "post",
    title: "文章頁",
    fields: {
      backToWork: "「返回」連結",
      backHome: "「回首頁」連結",
    },
  },
  {
    name: "common",
    title: "其他",
    fields: {
      langToggleAria: "語言切換按鈕的無障礙標籤",
      themeToggleAria: "深淺色按鈕的無障礙標籤",
      modelLoading: "3D 模型載入中文字",
      modelError: "3D 模型載入失敗時的文字",
      modelHint: "3D 模型操作提示",
      modelZoomHint: "滾輪經過 3D 模型時的縮放提示",
      modelZoomIn: "3D「放大」按鈕的無障礙標籤",
      modelZoomOut: "3D「縮小」按鈕的無障礙標籤",
      modelReset: "3D「重設視角」按鈕的無障礙標籤",
    },
  },
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "網站設定",
  type: "document",
  groups: [
    { name: "basic", title: "基本", default: true },
    { name: "nav", title: "導覽列" },
    { name: "footer", title: "頁尾與社群" },
    { name: "ui", title: "介面文字" },
  ],
  fields: [
    // --- 基本 ---------------------------------------------------------------
    defineField({
      name: "title",
      title: "網站標題",
      description: "顯示在瀏覽器分頁與搜尋結果。",
      type: "localeString",
      group: "basic",
    }),
    defineField({
      name: "titleTemplate",
      title: "子頁面標題格式",
      description: "%s 會換成頁面名稱，例如「%s · shuili」→「網誌 · shuili」。留白時會用「%s · 網站標題」。",
      type: "localeString",
      group: "basic",
    }),
    defineField({
      name: "description",
      title: "網站描述",
      description: "給搜尋引擎與社群分享預覽使用。",
      type: "localeText",
      group: "basic",
    }),
    defineField({
      name: "favicon",
      title: "網站圖示（Favicon）",
      description: "建議上傳正方形 PNG（至少 180×180）或 SVG。",
      type: "image",
      group: "basic",
      options: { accept: "image/png,image/svg+xml,image/jpeg,image/webp" },
    }),

    // --- 導覽列 -------------------------------------------------------------
    defineField({
      name: "wordmark",
      title: "左上角 Logo 文字",
      type: "localeString",
      group: "nav",
    }),
    defineField({
      name: "navItems",
      title: "選單項目",
      description: "可拖曳排序。",
      type: "array",
      group: "nav",
      of: [
        defineArrayMember({
          type: "object",
          name: "navItem",
          title: "選單項目",
          fields: [
            defineField({ name: "label", title: "名稱", type: "localeString" }),
            defineField({
              name: "linkType",
              title: "連結到",
              type: "string",
              initialValue: "home",
              options: {
                layout: "radio",
                direction: "horizontal",
                list: Object.entries(linkTypeTitles).map(([value, title]) => ({
                  value,
                  title,
                })),
              },
            }),
            defineField({
              name: "path",
              title: "站內路徑",
              description: "不含語言前綴，例如 /blog/haus。",
              type: "string",
              hidden: ({ parent }) => parent?.linkType !== "path",
              validation: (r) =>
                r.custom((value, ctx) => {
                  const parent = ctx.parent as { linkType?: string } | undefined;
                  if (parent?.linkType !== "path") return true;
                  return value?.startsWith("/") || "請填以 / 開頭的路徑";
                }),
            }),
            defineField({
              name: "url",
              title: "外部網址",
              type: "url",
              hidden: ({ parent }) => parent?.linkType !== "external",
              validation: (r) =>
                r
                  .uri({ scheme: ["http", "https", "mailto"] })
                  .custom((value, ctx) => {
                    const parent = ctx.parent as { linkType?: string } | undefined;
                    return parent?.linkType !== "external" || !!value || "請填網址";
                  }),
            }),
            defineField({
              name: "newTab",
              title: "在新分頁開啟",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              en: "label.en",
              zh: "label.zhTW",
              linkType: "linkType",
              path: "path",
              url: "url",
            },
            prepare: ({ en, zh, linkType, path, url }) => ({
              title: bilingual(zh, en) || "（未命名）",
              subtitle:
                linkType === "path"
                  ? path
                  : linkType === "external"
                    ? url
                    : linkTypeTitles[linkType as "home" | "blog"],
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "showLangToggle",
      title: "顯示語言切換按鈕",
      type: "boolean",
      initialValue: true,
      group: "nav",
    }),
    defineField({
      name: "langToggleLabel",
      title: "語言切換按鈕文字",
      description:
        "English 欄＝英文頁上顯示的文字（例如「中文」）；中文欄＝中文頁上顯示的文字（例如「EN」）。",
      type: "localeString",
      group: "nav",
      hidden: ({ document }) => document?.showLangToggle === false,
    }),
    defineField({
      name: "showThemeToggle",
      title: "顯示深淺色切換按鈕",
      type: "boolean",
      initialValue: true,
      group: "nav",
    }),

    // --- 頁尾與社群 ---------------------------------------------------------
    defineField({
      name: "copyright",
      title: "版權文字",
      description: "{year} 會自動換成今年的年份。",
      type: "localeString",
      group: "footer",
    }),
    defineField({
      name: "socials",
      title: "社群連結",
      description: "顯示在頁尾與首頁，可拖曳排序。",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          title: "社群連結",
          fields: [
            defineField({
              name: "label",
              title: "名稱",
              description: "滑鼠移上去時顯示，也給螢幕閱讀器使用。",
              type: "localeString",
            }),
            defineField({
              name: "icon",
              title: "圖示",
              type: "string",
              initialValue: "github",
              options: {
                list: socialIcons.map((value) => ({
                  value,
                  title: iconTitles[value],
                })),
              },
            }),
            defineField({
              name: "customIcon",
              title: "自訂圖示（選填）",
              description: "上傳 SVG 或 PNG 會取代上面選的圖示。",
              type: "image",
              options: { accept: "image/svg+xml,image/png" },
            }),
            defineField({
              name: "keepColor",
              title: "保留自訂圖示原本的顏色",
              description: "關閉時圖示會跟著文字變色（深淺色模式自動切換）。",
              type: "boolean",
              initialValue: false,
              hidden: ({ parent }) => !parent?.customIcon,
            }),
            defineField({
              name: "url",
              title: "連結",
              description: "網址（例如 https://github.com/you）或 Email（直接填 you@example.com 即可）",
              type: "string",
              validation: (r) =>
                r.required().custom((value) => {
                  const v = value?.trim() ?? "";
                  if (!v) return true;
                  return (
                    /^(https?:\/\/|mailto:|tel:)\S+$/.test(v) ||
                    /^[^\s@/:]+@[^\s@/]+\.[^\s@/]+$/.test(v) ||
                    "請填 https:// 開頭的網址，或 Email 地址"
                  );
                }),
            }),
          ],
          preview: {
            select: {
              en: "label.en",
              zh: "label.zhTW",
              icon: "icon",
              url: "url",
              media: "customIcon",
            },
            prepare: ({ en, zh, icon, url, media }) => ({
              title:
                bilingual(zh, en) || iconTitles[icon as SocialIcon] || "（未命名）",
              subtitle: url,
              media,
            }),
          },
        }),
      ],
    }),

    // --- 介面文字 -----------------------------------------------------------
    defineField({
      name: "ui",
      title: "介面文字",
      description: "留白的欄位會使用預設文字。",
      type: "object",
      group: "ui",
      fields: uiGroups.map((g) =>
        defineField({
          name: g.name,
          title: g.title,
          type: "object",
          options: { collapsible: true, collapsed: false },
          fields: Object.entries(g.fields).map(([key, title]) =>
            defineField({
              name: key,
              title,
              description: `預設：${EN[g.name][key]} ／ ${ZH[g.name][key]}`,
              type: "localeString",
            }),
          ),
        }),
      ),
    }),
  ],
  preview: {
    prepare: () => ({ title: "網站設定" }),
  },
});
