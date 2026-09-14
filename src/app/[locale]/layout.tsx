import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LocaleHtml } from "@/components/LocaleHtml";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProfile } from "@/sanity/queries";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const profile = await getProfile();

  return (
    <>
      <LocaleHtml locale={locale} />
      <Nav locale={locale} dict={dict} wordmark={profile.wordmark} />
      <main className="flex-1">{children}</main>
      <Footer
        locale={locale}
        dict={dict}
        name={profile.name}
        socials={profile.socials}
      />
    </>
  );
}
