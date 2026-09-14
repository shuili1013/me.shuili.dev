import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

// Shared by the site root layout and global-not-found.

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Cubic 11 — Traditional-Chinese pixel font (also covers Latin/ASCII). OFL.
const cubic = localFont({
  src: "../fonts/Cubic_11.woff2",
  variable: "--font-cubic",
  weight: "400",
  display: "swap",
});

export const fontVariables = `${cubic.variable} ${geistSans.variable} ${geistMono.variable}`;

// No-flash theme init. Lives in the root layout (which is NOT re-rendered when
// switching locale), so the <script> is never reconciled on the client → no
// React-19 "script tag while rendering" warning. Default dark unless the user
// picked light. Also sets <html lang> from the URL on first paint.
export const themeScript = `(function(){try{var e=document.documentElement;var t=localStorage.getItem('theme');var d=t!=='light';e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';var l=location.pathname.split('/')[1];if(l==='zh-TW'||l==='en')e.lang=l;}catch(_){}})();`;
