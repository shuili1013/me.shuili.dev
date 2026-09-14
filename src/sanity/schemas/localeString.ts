import { defineField, defineType } from "sanity";

const preview = {
  select: { en: "en", zh: "zhTW" },
  prepare: ({ en, zh }: { en?: string; zh?: string }) => ({
    title: [zh, en].filter(Boolean).join(" / ") || "（空白）",
  }),
};

export const localeString = defineType({
  name: "localeString",
  title: "中英文字",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "en", title: "English", type: "string" }),
    defineField({ name: "zhTW", title: "中文", type: "string" }),
  ],
  preview,
});

export const localeText = defineType({
  name: "localeText",
  title: "中英段落",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
    defineField({ name: "zhTW", title: "中文", type: "text", rows: 4 }),
  ],
  preview,
});
