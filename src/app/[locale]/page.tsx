import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getProfile } from "@/sanity/queries";
import { t } from "@/sanity/types";
import { Socials } from "@/components/Socials";
import { Scramble } from "@/components/Scramble";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const profile = await getProfile();
  const posts = (await getAllPosts(locale)).slice(0, 4);

  return (
    <div className="mx-auto max-w-2xl px-6 pt-10 pb-8">
      {/* Wordmark + tags */}
      <Scramble
        as="h1"
        text={profile.wordmark}
        className="block text-4xl font-bold sm:text-5xl"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {profile.tags.map((tag) => (
          <span
            key={t(tag, locale)}
            className="border border-border px-3 py-1 text-muted"
          >
            {t(tag, locale)}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <Socials socials={profile.socials} />
      </div>

      <p className="mt-6 leading-7 text-foreground/90">
        {t(profile.intro, locale)}
      </p>

      {/* Key-value rows */}
      <dl className="mt-8 border-t border-border">
        <div className="grid grid-cols-[72px_1fr] gap-4 border-b border-border py-3">
          <dt className="text-muted">{dict.home.email}</dt>
          <dd>
            <a
              href={`mailto:${profile.email}`}
              className="underline-offset-4 hover:underline"
            >
              {profile.email}
            </a>
          </dd>
        </div>
        <div className="grid grid-cols-[72px_1fr] gap-4 border-b border-border py-3">
          <dt className="text-muted">{dict.home.bio}</dt>
          <dd>
            <ul className="space-y-1">
              {profile.bio.map((item, i) => (
                <li key={i}>◦ {t(item, locale)}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {/* Skills */}
      <Scramble
        as="h2"
        text={dict.home.sectionSkills}
        className="mt-16 mb-6 block text-2xl font-bold"
      />
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill) => (
          <span key={skill} className="border border-border px-3 py-1 text-muted">
            {skill}
          </span>
        ))}
      </div>

      {/* Work Experience */}
      <Scramble
        as="h2"
        text={dict.home.sectionExperience}
        className="mt-16 mb-6 block text-2xl font-bold"
      />
      <ul className="space-y-5">
        {profile.experience.map((exp, i) => (
          <li key={i} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-bold">{t(exp.role, locale)}</p>
              <p className="text-muted">{t(exp.org, locale)}</p>
            </div>
            <span className="shrink-0 text-muted">{t(exp.period, locale)}</span>
          </li>
        ))}
      </ul>

      {/* Selected Work */}
      <div className="mt-16 mb-6 flex items-baseline justify-between">
        <Scramble
          as="h2"
          text={dict.home.sectionFeatured}
          className="text-2xl font-bold"
        />
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          {dict.home.viewAllWork}
        </Link>
      </div>
      <ul className="divide-y divide-border border-y border-border">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="group flex items-start justify-between gap-4 py-4 transition-colors hover:bg-card"
            >
              <div>
                <p className="font-bold group-hover:underline">{post.title}</p>
                {post.summary && (
                  <p className="mt-1 text-muted">{post.summary}</p>
                )}
              </div>
              <span className="shrink-0 text-muted">{post.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
