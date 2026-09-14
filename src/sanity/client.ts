import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  // "placeholder" keeps createClient from throwing before the project is set up;
  // queries guard on `hasSanity` so they no-op until env is configured.
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});
