"use client";

import { useEffect } from "react";

// The site is locale-prefixed (/en, /zh-TW). "/" redirects to the default
// locale. On Cloudflare Pages, public/_redirects handles this at the edge; this
// client redirect covers local preview and any other host.
export default function RootRedirect() {
  useEffect(() => {
    window.location.replace("/en/");
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <a href="/en/">Continue to the site →</a>
    </main>
  );
}
