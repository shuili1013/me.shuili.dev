import { defineArrayMember, defineField, defineType } from "sanity";

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
      title: "Bio（條列）",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
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
      title: "經歷",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "experienceItem",
          title: "經歷",
          fields: [
            defineField({ name: "role", title: "職稱", type: "localeString" }),
            defineField({ name: "org", title: "公司／組織", type: "localeString" }),
            defineField({ name: "period", title: "期間", type: "localeString" }),
          ],
          preview: {
            select: {
              role: "role.zhTW",
              roleEn: "role.en",
              org: "org.zhTW",
              orgEn: "org.en",
            },
            prepare: ({ role, roleEn, org, orgEn }) => ({
              title: role || roleEn,
              subtitle: org || orgEn,
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
