import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { t, type L, type SocialLink } from "@/sanity/types";
import { Socials } from "./Socials";

export function Footer({
  locale,
  dict,
  name,
  socials,
}: {
  locale: Locale;
  dict: Dictionary;
  name: L;
  socials: SocialLink[];
}) {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 {t(name, locale)}. {dict.footer.rights}
        </p>
        <Socials socials={socials} />
      </div>
    </footer>
  );
}
