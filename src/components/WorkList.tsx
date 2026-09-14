"use client";

import { useMemo, useState } from "react";
import { PostCard } from "./PostCard";
import type { PostMeta } from "@/sanity/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function WorkList({
  posts,
  locale,
  dict,
}: {
  posts: PostMeta[];
  locale: Locale;
  dict: Dictionary;
}) {
  const tags = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
    [posts],
  );
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  if (posts.length === 0) {
    return <p className="text-muted">{dict.work.empty}</p>;
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={`underline-offset-4 transition-colors hover:text-foreground ${
              active === null ? "text-foreground underline" : "text-muted"
            }`}
          >
            {dict.work.all}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag)}
              className={`underline-offset-4 transition-colors hover:text-foreground ${
                active === tag ? "text-foreground underline" : "text-muted"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <ul className="divide-y divide-border border-y border-border">
        {shown.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
