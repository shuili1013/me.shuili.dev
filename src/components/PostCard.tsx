import Link from "next/link";
import type { PostMeta } from "@/sanity/types";
import type { Locale } from "@/i18n/config";

export function PostCard({ post, locale }: { post: PostMeta; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex items-start justify-between gap-4 py-4 transition-colors hover:bg-card"
    >
      <div>
        <p className="font-bold group-hover:underline">{post.title}</p>
        {post.summary && <p className="mt-1 text-muted">{post.summary}</p>}
        {post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-muted">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
      {post.date && (
        <span className="shrink-0 text-muted">{post.date}</span>
      )}
    </Link>
  );
}
