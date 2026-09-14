import "../globals.css";
import type { Metadata } from "next";
import { fontVariables, themeScript } from "../shell";

// Title, description and favicon come from Sanity in [locale]/layout.tsx.
export const metadata: Metadata = {
  metadataBase: new URL("https://me.shuili.dev"),
};

export default function SiteRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
