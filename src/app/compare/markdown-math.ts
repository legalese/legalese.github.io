import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

/**
 * Math-aware markdown renderer for model output on the compare page.
 *
 * Unlike the site-wide `markdownToHtml`, this pipeline runs
 * remark-math + rehype-katex so propositional/predicate-logic encodings
 * (\lor, \land, \forall, …) render as typeset math. Raw HTML in the
 * source is NOT passed through (remark-rehype default drops it), so
 * model output can't inject markup — everything in the result is either
 * escaped text or KaTeX-generated spans.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  // rehype-katex never throws on bad TeX — it renders the error inline —
  // and `strict: false` keeps it lenient about non-standard commands.
  .use(rehypeKatex, { strict: false })
  .use(rehypeStringify);

/**
 * remark-math only recognises $ / $$ delimiters, but models typically
 * emit LaTeX-style \[ … \] (display) and \( … \) (inline) — which plain
 * markdown then mangles by eating the backslash-escaped brackets.
 * Normalise those to $-delimiters before parsing.
 */
function normalizeMathDelimiters(md: string): string {
  return md
    .replace(/\\\[([\s\S]*?)\\\]/g, (_m, expr: string) => `\n$$\n${expr}\n$$\n`)
    .replace(/\\\((.*?)\\\)/g, (_m, expr: string) => `$${expr}$`);
}

export default async function markdownWithMathToHtml(
  markdown: string,
): Promise<string> {
  const file = await processor.process(normalizeMathDelimiters(markdown));
  return String(file);
}
