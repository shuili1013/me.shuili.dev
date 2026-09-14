import type { Locale } from "@/i18n/config";
import type { SocialLink } from "@/sanity/types";
import { Socials } from "./Socials";

export function Footer({
  locale,
  copyright,
  socials,
}: {
  locale: Locale;
  copyright: string;
  socials: SocialLink[];
}) {
  // `{year}` in the copyright text becomes the build year.
  const text = copyright.replaceAll("{year}", String(new Date().getFullYear()));

  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{text}</p>
        <Socials socials={socials} locale={locale} />
      </div>
    </footer>
  );
}
