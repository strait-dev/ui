import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Powers the cmd+K command palette: a static Orama index built from every
// docs page, queried client-side by the Fumadocs search dialog.
export const { GET } = createFromSource(source);
