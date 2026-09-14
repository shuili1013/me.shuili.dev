"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { zhHantLocale } from "@sanity/locale-zh-hant";
import { CogIcon, DocumentTextIcon, UserIcon } from "@sanity/icons";
import { schemaTypes } from "./src/sanity/schemas";
import { projectId, dataset } from "./src/sanity/env";

const singletons = ["siteSettings", "profile"];

export default defineConfig({
  name: "default",
  title: "Shuili.dev 後台",
  projectId,
  dataset,
  // Embedded in the site at /edit — see src/app/(studio)/edit.
  basePath: "/edit",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("內容")
          .items([
            S.listItem()
              .title("網站設定")
              .id("siteSettings")
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("網站設定"),
              ),
            S.listItem()
              .title("個人資料")
              .id("profile")
              .icon(UserIcon)
              .child(
                S.document()
                  .schemaType("profile")
                  .documentId("profile")
                  .title("個人資料"),
              ),
            S.divider(),
            S.documentTypeListItem("post").title("文章").icon(DocumentTextIcon),
          ]),
    }),
    visionTool(),
    zhHantLocale(),
  ],
  schema: {
    types: schemaTypes,
    // keep singletons out of the global "create new" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletons.includes(context.schemaType)
        ? input.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? ""),
          )
        : input,
  },
});
