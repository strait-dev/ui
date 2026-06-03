import { generateOGImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";

export const revalidate = false;

// Dynamic 1200x630 OG image per docs page.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  // slug is [...pageSlugs, "image.png"]; drop the trailing filename.
  const page = source.getPage(slug.slice(0, -1));
  if (!page) {
    notFound();
  }

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "Strait UI",
  });
}
