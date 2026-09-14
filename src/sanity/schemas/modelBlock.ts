import { defineField, defineType } from "sanity";

// An embeddable 3D model inside a post body → rendered as <ModelViewer>.
export const modelBlock = defineType({
  name: "modelBlock",
  title: "3D model",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "GLB / glTF file",
      type: "file",
      options: { accept: ".glb,.gltf" },
    }),
  ],
  preview: {
    prepare: () => ({ title: "3D model" }),
  },
});

const bodyOf = [
  { type: "block" as const },
  { type: "image" as const, options: { hotspot: true } },
  { type: "modelBlock" as const },
];

export const localePortableText = defineType({
  name: "localePortableText",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "array", of: bodyOf }),
    defineField({ name: "zhTW", title: "中文", type: "array", of: bodyOf }),
  ],
});
