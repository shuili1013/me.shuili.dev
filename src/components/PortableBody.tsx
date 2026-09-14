import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import { ModelViewer, type ModelLabels } from "./ModelViewer";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { alt?: string } }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlFor(value).width(1200).fit("max").url()}
        alt={value?.alt ?? ""}
        className="my-6 w-full rounded-lg border border-border"
      />
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 text-xl font-semibold">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-2 text-lg font-semibold">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-7 text-foreground/90">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-border pl-4 text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-1 pl-6 text-foreground/90">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-1 pl-6 text-foreground/90">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-[0.85em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="underline underline-offset-4">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-muted"
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableBody({
  value,
  modelLabels,
}: {
  value: PortableTextBlock[];
  modelLabels: ModelLabels;
}) {
  return (
    <PortableText
      value={value}
      components={{
        ...components,
        types: {
          ...components.types,
          modelBlock: ({ value }: { value: { src?: string } }) => (
            <ModelViewer src={value?.src} labels={modelLabels} />
          ),
        },
      }}
    />
  );
}
