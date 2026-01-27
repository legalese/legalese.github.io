import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

export interface MarkdownOptions {
  /** Whether to sanitize HTML in the output. Defaults to true. */
  sanitize?: boolean;
}

export default async function markdownToHtml(
  markdown: string,
  options: MarkdownOptions = {}
): Promise<string> {
  const { sanitize = true } = options;
  const result = await remark()
    .use(remarkGfm)  // GitHub Flavored Markdown: tables, strikethrough, autolinks, etc.
    .use(html, { sanitize })
    .process(markdown);
  return result.toString();
}
