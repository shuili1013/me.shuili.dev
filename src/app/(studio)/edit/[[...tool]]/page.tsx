import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";
import { metadata as studioMetadata } from "next-sanity/studio";
import config from "../../../../../sanity.config";

// Exported as a single static shell at /edit; the Studio routes client-side and
// public/_redirects serves this page for every /edit/* URL.
export const dynamic = "force-static";

export { viewport } from "next-sanity/studio";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "shuili",
};

export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <NextStudio config={config} />;
}
