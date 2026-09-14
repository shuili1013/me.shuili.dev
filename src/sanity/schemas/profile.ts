import { defineArrayMember, defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({ name: "wordmark", title: "Wordmark", type: "string" }),
    defineField({ name: "name", title: "Name", type: "localeString" }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({ name: "intro", title: "Intro", type: "localeText" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "bio",
      title: "Bio (bullet list)",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({ name: "resumeUrl", title: "Résumé URL", type: "url" }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "experienceItem",
          fields: [
            defineField({ name: "role", title: "Role", type: "localeString" }),
            defineField({ name: "org", title: "Org", type: "localeString" }),
            defineField({
              name: "period",
              title: "Period",
              type: "localeString",
            }),
          ],
          preview: {
            select: { title: "role.en", subtitle: "org.en" },
          },
        }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Socials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "kind",
              title: "Kind",
              type: "string",
              options: {
                list: ["github", "x", "linkedin", "instagram", "email"],
              },
            }),
            defineField({ name: "href", title: "URL", type: "string" }),
          ],
          preview: { select: { title: "kind", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Profile" }),
  },
});
