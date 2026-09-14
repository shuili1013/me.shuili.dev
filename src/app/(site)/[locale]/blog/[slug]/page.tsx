import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost } from "@/sanity/queries";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ModelViewer } from "@/components/ModelViewer";
import { PortableBody } from "@/components/PortableBody";
import { Scramble } from "@/components/Scramble";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  // `output: "export"` rejects an empty list (e.g. a fresh Sanity dataset with
  // no posts yet); emit one placeholder that renders notFound().
  if (slugs.length === 0) return [{ slug: "__placeholder__" }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPost(slug, locale);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = await getPost(slug, locale);
  if (!post) notFound();

  const dict = await getDictionary(locale);
  const modelLabels = {
    loading: dict.common.modelLoading,
    error: dict.common.modelError,
    hint: dict.common.modelHint,
    zoomHint: dict.common.modelZoomHint,
    zoomIn: dict.common.modelZoomIn,
    zoomOut: dict.common.modelZoomOut,
    reset: dict.common.modelReset,
  };

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link
        href={`/${locale}/blog`}
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        {dict.post.backToWork}
      </Link>

      <header className="mt-6 mb-2">
        <Scramble
          as="h1"
          text={post.title}
          className="block text-2xl font-bold sm:text-3xl"
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {post.date && <time>{post.date}</time>}
          {post.client && <span>{post.client}</span>}
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      {/* Cover, body and models in the order set in the Studio. */}
      {post.sections.map((section) => {
        switch (section) {
          case "cover":
            return post.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={section}
                src={`${post.cover}?w=1200&fit=max&auto=format`}
                alt=""
                className="mt-6 w-full rounded-lg border border-border"
              />
            ) : null;
          case "body":
            return (
              <div key={section} className="mt-6">
                <PortableBody value={post.body} modelLabels={modelLabels} />
              </div>
            );
          case "models":
            return post.models.length > 0 ? (
              <div key={section}>
                {post.models.map((model, i) => (
                  <figure key={i}>
                    <ModelViewer src={model.src} labels={modelLabels} />
                    {model.caption && (
                      <figcaption className="-mt-4 mb-6 text-center text-sm text-muted">
                        {model.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            ) : null;
        }
      })}

      <hr className="my-10 border-border" />
      <Link
        href={`/${locale}`}
        className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
      >
        {dict.post.backHome}
      </Link>
    </article>
  );
}
