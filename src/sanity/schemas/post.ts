import { defineArrayMember, defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

export const post = defineType({
  name: "post",
  title: "文章",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "標題",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "網址代稱（Slug）",
      description: "中英文共用，例如 my-post → /en/blog/my-post、/zh-TW/blog/my-post",
      type: "slug",
      options: {
        source: (doc: SanityDocument) =>
          (doc.title as { en?: string })?.en ?? "",
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "日期", type: "date" }),
    defineField({
      name: "client",
      title: "案主（選填）",
      description: "有填才會顯示在日期旁邊。",
      type: "localeString",
    }),
    defineField({ name: "summary", title: "摘要", type: "localeText" }),
    defineField({
      name: "tags",
      title: "標籤",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "cover",
      title: "封面圖",
      description: "顯示在文章標題下方。",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "models",
      title: "3D 模型（可多個）",
      description:
        "依序顯示在封面圖下方，可拖曳排序。想穿插在文字之間的話，也可以在內文插入「3D 模型」區塊。",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "modelItem",
          title: "3D 模型",
          fields: [
            defineField({
              name: "file",
              title: "GLB / glTF 檔案",
              type: "file",
              options: { accept: ".glb,.gltf" },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "說明（選填）",
              description: "顯示在模型下方。",
              type: "localeString",
            }),
          ],
          preview: {
            select: {
              zh: "caption.zhTW",
              en: "caption.en",
              filename: "file.asset.originalFilename",
            },
            prepare: ({ zh, en, filename }) => ({
              title: zh || en || filename || "3D 模型",
              subtitle: zh || en ? filename : undefined,
            }),
          },
        }),
      ],
    }),
    defineField({ name: "body", title: "內文", type: "localePortableText" }),
  ],
  orderings: [
    {
      title: "日期（新到舊）",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { zh: "title.zhTW", en: "title.en", subtitle: "date", media: "cover" },
    prepare: ({ zh, en, subtitle, media }) => ({
      title: zh || en,
      subtitle,
      media,
    }),
  },
});
