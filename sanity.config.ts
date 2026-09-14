import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { projectId, dataset } from "./src/sanity/env";

const singletons = ["profile"];

export default defineConfig({
  name: "default",
  title: "me.shuili.dev",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Profile")
              .id("profile")
              .child(
                S.document().schemaType("profile").documentId("profile"),
              ),
            S.divider(),
            S.documentTypeListItem("post").title("Posts"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // keep the singleton out of the global "create new" menu
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
