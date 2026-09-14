import { defineField, defineType } from "sanity";

// An embeddable 3D model inside a post body → rendered as <ModelViewer>.
export const modelBlock = defineType({
  name: "modelBlock",
  title: "3D 模型",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "GLB / glTF 檔案",
      type: "file",
      options: { accept: ".glb,.gltf" },
    }),
  ],
  preview: {
    prepare: () => ({ title: "3D 模型" }),
  },
});

const bodyOf = [
  { type: "block" as const },
  {
    type: "image" as const,
    options: { hotspot: true },
    fields: [
      defineField({ name: "alt", title: "替代文字（無障礙）", type: "string" }),
    ],
  },
  { type: "modelBlock" as const },
];

export const localePortableText = defineType({
  name: "localePortableText",
  title: "中英內文",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "array", of: bodyOf }),
    defineField({ name: "zhTW", title: "中文", type: "array", of: bodyOf }),
  ],
});
