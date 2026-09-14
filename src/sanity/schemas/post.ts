import { defineArrayMember, defineField, defineType } from "sanity";
import type { SanityDocument } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: SanityDocument) =>
          (doc.title as { en?: string })?.en ?? "",
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "summary", title: "Summary", type: "localeText" }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "model",
      title: "3D model (GLB)",
      type: "file",
      options: { accept: ".glb,.gltf" },
    }),
    defineField({ name: "body", title: "Body", type: "localePortableText" }),
  ],
  orderings: [
    {
      title: "Date, newest",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title.en", subtitle: "date" },
  },
});
