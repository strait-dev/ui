import { loader } from "fumadocs-core/source";
import { docs } from "@/.source/server";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

type Page = NonNullable<ReturnType<typeof source.getPage>>;

/** Segments + URL for a page's generated OG image (served by /og/docs/...). */
export function getPageImage(page: Page) {
  const segments = [...page.slugs, "image.png"];
  return { segments, url: `/og/docs/${segments.join("/")}` };
}
