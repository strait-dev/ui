import { Badge } from "@strait/ui/components/badge";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { getStatusBadge } from "@/src/lib/component-status";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const MDXContent = page.data.body;

  // Component pages live at /docs/components/<slug>; surface a status pill for
  // the documented non-stable exceptions.
  const slug = params.slug ?? [];
  const status =
    slug[0] === "components" && slug[1] ? getStatusBadge(slug[1]) : null;

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <div className="flex flex-wrap items-center gap-3">
        <DocsTitle>{page.data.title}</DocsTitle>
        {status && (
          <Badge size="sm" variant={status.variant}>
            {status.label}
          </Badge>
        )}
      </div>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="flex items-center gap-2 border-fd-border border-b pb-4">
        <MarkdownCopyButton markdownUrl={`/llms.mdx${page.url}`} />
        <ViewOptionsPopover
          githubUrl={`https://github.com/strait-dev/ui/blob/main/apps/docs/content/docs/${page.path}`}
          markdownUrl={`/llms.mdx${page.url}`}
        />
      </div>
      <DocsBody>
        <MDXContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const image = getPageImage(page).url;
  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: { images: image },
    twitter: { card: "summary_large_image", images: image },
  };
}
