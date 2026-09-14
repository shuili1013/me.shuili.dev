import { defineArrayMember, defineField, defineType } from "sanity";

const bilingual = (zh?: string, en?: string) =>
  [zh, en].filter(Boolean).join(" / ");

export const profile = defineType({
  name: "profile",
  title: "個人資料",
  type: "document",
  fields: [
    defineField({ name: "wordmark", title: "首頁大標題", type: "localeString" }),
    defineField({
      name: "tags",
      title: "身分標籤",
      description: "顯示在首頁大標題下方。",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({ name: "intro", title: "自我介紹", type: "localeText" }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "bio",
      title: "Bio（學歷／工作）",
      description: "在哪裡讀書、在哪裡工作，可拖曳排序。",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "bioItem",
          title: "Bio",
          fields: [
            defineField({
              name: "text",
              title: "內容",
              description: "例如：大同大學 — 資訊工程學系",
              type: "localeString",
            }),
            defineField({
              name: "period",
              title: "年份",
              description: "例如：2020 - 2024、2024 - 至今（English 欄可填 2024 - Present）",
              type: "localeString",
            }),
          ],
          preview: {
            select: {
              zh: "text.zhTW",
              en: "text.en",
              periodZh: "period.zhTW",
              periodEn: "period.en",
            },
            prepare: ({ zh, en, periodZh, periodEn }) => ({
              title: bilingual(zh, en) || "（未命名）",
              subtitle: periodZh || periodEn,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "resumeUrl",
      title: "履歷連結",
      description: "有填才會顯示在首頁。",
      type: "url",
    }),
    defineField({
      name: "skills",
      title: "技能",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "experience",
      title: "經歷（做過的專案）",
      description: "可拖曳排序。",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectItem",
          title: "專案",
          fields: [
            defineField({
              name: "title",
              title: "專案名稱",
              type: "localeString",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "description",
              title: "簡介（選填）",
              description: "一句話說明你做了什麼。",
              type: "localeString",
            }),
            defineField({
              name: "period",
              title: "時間",
              description: "例如：2025.03 - 2025.06",
              type: "localeString",
            }),
            defineField({
              name: "url",
              title: "作品連結（選填）",
              description:
                "點專案名稱會開啟這個連結。外部網址填 https://…；站內頁面填路徑，例如 /blog/haus。",
              type: "string",
              validation: (r) =>
                r.custom((value) => {
                  const v = value?.trim() ?? "";
                  return (
                    !v ||
                    /^https?:\/\/\S+$/.test(v) ||
                    v.startsWith("/") ||
                    "請填 https:// 開頭的網址，或以 / 開頭的站內路徑"
                  );
                }),
            }),
            defineField({
              name: "post",
              title: "相關文章（選填）",
              description: "選一篇你寫的文章，會顯示「閱讀文章」按鈕。",
              type: "reference",
              to: [{ type: "post" }],
            }),
          ],
          preview: {
            select: {
              zh: "title.zhTW",
              en: "title.en",
              periodZh: "period.zhTW",
              periodEn: "period.en",
            },
            prepare: ({ zh, en, periodZh, periodEn }) => ({
              title: bilingual(zh, en) || "（未命名）",
              subtitle: periodZh || periodEn,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "個人資料" }),
  },
});
