import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getProfile, getSiteSettings } from "@/sanity/queries";
import { t } from "@/sanity/types";
import { Socials } from "@/components/Socials";
import { Scramble } from "@/components/Scramble";

const row = "grid grid-cols-[72px_1fr] gap-4 border-b border-border py-3";

/** Site paths get the locale prefix; absolute URLs pass through. */
function projectHref(url: string, locale: Locale) {
  if (!url.startsWith("/")) return url;
  return /^\/(en|zh-TW)(\/|$)/.test(url) ? url : `/${locale}${url}`;
}

// Every section renders only when its content is filled in the Studio.
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dict, profile, settings, allPosts] = await Promise.all([
    getDictionary(locale),
    getProfile(),
    getSiteSettings(),
    getAllPosts(locale),
  ]);
  const posts = allPosts.slice(0, 4);
  const wordmark = t(profile.wordmark, locale);
  const intro = t(profile.intro, locale);
  const hasRows = Boolean(
    profile.email || profile.bio.length > 0 || profile.resumeUrl,
  );

  return (
    <div className="mx-auto max-w-2xl px-6 pt-10 pb-8">
      {wordmark && (
        <Scramble
          as="h1"
          text={wordmark}
          className="block text-4xl font-bold sm:text-5xl"
        />
      )}
      {profile.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.tags.map((tag, i) => (
            <span key={i} className="border border-border px-3 py-1 text-muted">
              {t(tag, locale)}
            </span>
          ))}
        </div>
      )}

      {settings.socials.length > 0 && (
        <div className="mt-4">
          <Socials socials={settings.socials} locale={locale} />
        </div>
      )}

      {intro && <p className="mt-6 leading-7 text-foreground/90">{intro}</p>}

      {/* Key-value rows */}
      {hasRows && (
        <dl className="mt-8 border-t border-border">
          {profile.email && (
            <div className={row}>
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
          )}
          {profile.bio.length > 0 && (
            <div className={row}>
              <dt className="text-muted">{dict.home.bio}</dt>
              <dd>
                <ul className="space-y-1">
                  {profile.bio.map((item, i) => {
                    const period = t(item.period, locale);
                    return (
                      <li key={i} className="flex items-baseline justify-between gap-4">
                        <span>◦ {t(item.text, locale)}</span>
                        {period && (
                          <span className="shrink-0 text-sm text-muted">{period}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          )}
          {profile.resumeUrl && (
            <div className={row}>
              <dt className="text-muted">{dict.home.resume}</dt>
              <dd className="break-all">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {profile.resumeUrl.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <>
          <Scramble
            as="h2"
            text={dict.home.sectionSkills}
            className="mt-16 mb-6 block text-2xl font-bold"
          />
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span key={i} className="border border-border px-3 py-1 text-muted">
                {t(skill, locale)}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Experience: projects */}
      {profile.experience.length > 0 && (
        <>
          <Scramble
            as="h2"
            text={dict.home.sectionExperience}
            className="mt-16 mb-6 block text-2xl font-bold"
          />
          <ul className="space-y-6">
            {profile.experience.map((item, i) => {
              const title = t(item.title, locale);
              const description = t(item.description, locale);
              const period = t(item.period, locale);
              const href = item.url ? projectHref(item.url, locale) : undefined;
              const external = Boolean(href && !href.startsWith("/"));
              return (
                <li key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold">
                      {href ? (
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel="noreferrer"
                          className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                        >
                          {title}
                          {external && " ↗"}
                        </a>
                      ) : (
                        title
                      )}
                    </p>
                    {description && <p className="mt-1 text-muted">{description}</p>}
                    {item.postSlug && (
                      <Link
                        href={`/${locale}/blog/${item.postSlug}`}
                        className="mt-2 inline-block border border-border px-3 py-1 text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {dict.home.readPost}
                      </Link>
                    )}
                  </div>
                  {period && <span className="shrink-0 text-muted">{period}</span>}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Selected Work */}
      {posts.length > 0 && (
        <>
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
        </>
      )}
    </div>
  );
}
