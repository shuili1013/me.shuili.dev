import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables, themeScript } from "./shell";

// The app has two root layouts ((site) and (studio)), so the 404 page is global.
export const metadata: Metadata = {
  title: "404 · Shuili",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontVariables} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col items-center justify-center gap-4 px-6 antialiased">
        <p className="text-4xl font-bold">404</p>
        <p className="text-muted">Page not found · 找不到這個頁面</p>
        <div className="flex gap-4 text-sm">
          <Link href="/en/" className="underline underline-offset-4">
            Home
          </Link>
          <Link href="/zh-TW/" className="underline underline-offset-4">
            首頁
          </Link>
        </div>
      </body>
    </html>
  );
}
