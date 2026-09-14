import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Cubic 11 — Traditional-Chinese pixel font (also covers Latin/ASCII). OFL.
const cubic = localFont({
  src: "../fonts/Cubic_11.woff2",
  variable: "--font-cubic",
  weight: "400",
  display: "swap",
});

// No-flash theme init. Lives in the root layout (which is NOT re-rendered when
// switching locale), so the <script> is never reconciled on the client → no
// React-19 "script tag while rendering" warning. Default dark unless the user
// picked light. Also sets <html lang> from the URL on first paint.
const themeScript = `(function(){try{var e=document.documentElement;var t=localStorage.getItem('theme');var d=t!=='light';e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';var l=location.pathname.split('/')[1];if(l==='zh-TW'||l==='en')e.lang=l;}catch(_){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://me.shuili.dev"),
  title: {
    default: "Shuili",
    template: "%s · Shuili",
  },
  description: "Personal site & portfolio of Shuili — projects, writing, and 3D.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cubic.variable} ${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
