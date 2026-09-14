import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts } from "@/sanity/queries";
import { WorkList } from "@/components/WorkList";
import { Scramble } from "@/components/Scramble";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: (await getDictionary(locale)).work.title };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, posts] = await Promise.all([
    getDictionary(locale),
    getAllPosts(locale),
  ]);

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-10">
      <Scramble
        as="h1"
        text={dict.work.title}
        className="block text-2xl font-bold sm:text-3xl"
      />
      <p className="mt-2 mb-8 text-muted">{dict.work.subtitle}</p>
      <WorkList posts={posts} locale={locale} dict={dict} />
    </section>
  );
}
