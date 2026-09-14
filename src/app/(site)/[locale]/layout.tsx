import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LocaleHtml } from "@/components/LocaleHtml";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteSettings } from "@/sanity/queries";
import { t } from "@/sanity/types";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const settings = await getSiteSettings();
  const title = t(settings.title, locale);
  const template = t(settings.titleTemplate, locale);
  const { favicon } = settings;

  return {
    title: {
      default: title,
      template: template.includes("%s") ? template : `%s · ${title}`,
    },
    description: t(settings.description, locale),
    icons: favicon && {
      icon: { url: favicon.url, type: favicon.type },
      apple: favicon.appleUrl,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Params & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, settings] = await Promise.all([
    getDictionary(locale),
    getSiteSettings(),
  ]);

  return (
    <>
      <LocaleHtml locale={locale} />
      <Nav
        locale={locale}
        wordmark={t(settings.wordmark, locale)}
        items={settings.navItems}
        langToggle={
          settings.showLangToggle
            ? {
                label: t(settings.langToggleLabel, locale),
                ariaLabel: dict.common.langToggleAria,
              }
            : null
        }
        themeToggleAria={
          settings.showThemeToggle ? dict.common.themeToggleAria : null
        }
      />
      <main className="flex-1">{children}</main>
      <Footer
        locale={locale}
        copyright={t(settings.copyright, locale)}
        socials={settings.socials}
      />
    </>
  );
}
