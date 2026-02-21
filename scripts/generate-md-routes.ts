#!/usr/bin/env npx ts-node
/**
 * Generate processed .md files alongside the static HTML export.
 *
 * For every L4 doc page at /l4/<slug>, this script writes a sibling
 * .md file at out/l4/<slug>.md so crawlers and AI agents can fetch
 * the raw markdown instead of the rendered HTML.
 *
 * Run: npx ts-node scripts/generate-md-routes.ts
 * (called automatically as part of `npm run build`)
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Inline the minimal helpers we need (avoids @/ alias issues with ts-node)
// ---------------------------------------------------------------------------

const LOCAL_DOC_PATH = path.join(process.cwd(), '.l4-docs/doc');

const DOC_TABS = [
  { name: 'Home', slug: '' },
  { name: 'Reference', slug: 'reference' },
  { name: 'Courses', slug: 'courses' },
  { name: 'Tutorials', slug: 'tutorials' },
  { name: 'Concepts', slug: 'concepts' },
] as const;

function getDocContent(docPath: string): string | null {
  const fullPath = path.join(LOCAL_DOC_PATH, docPath);
  try {
    if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, 'utf-8');
    return null;
  } catch { return null; }
}

function getDocumentList(dirPath: string = ''): string[] {
  const docs: string[] = [];
  const fullPath = path.join(LOCAL_DOC_PATH, dirPath);
  if (!fs.existsSync(fullPath)) return docs;
  for (const entry of fs.readdirSync(fullPath, { withFileTypes: true })) {
    const rel = dirPath ? `${dirPath}/${entry.name}` : entry.name;
    if (entry.isFile() && entry.name.endsWith('.md')) docs.push(rel);
    else if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'images')
      docs.push(...getDocumentList(rel));
  }
  return docs;
}

function resolveRelativePath(p: string, currentFolder: string): string {
  let clean = p.replace(/^\.\//g, '');
  const parts = currentFolder ? currentFolder.split('/') : [];
  while (clean.startsWith('../')) { clean = clean.slice(3); parts.pop(); }
  if (p.startsWith('/')) return clean;
  return parts.length > 0 ? `${parts.join('/')}/${clean}` : clean;
}

function convertDocPathToSlug(docPath: string): string {
  return docPath.replace(/^\.\//, '').replace(/\.md$/, '').replace(/README$/, '').replace(/\/$/, '');
}

/** Embed .l4 file links as code blocks */
function embedL4Files(content: string, currentFolder: string): string {
  let processed = content;
  const re = /\[([^\]]+)\]\(([^)]+\.l4)\)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const [full, , fp] = m;
    const resolved = resolveRelativePath(fp, currentFolder);
    const fc = getDocContent(resolved);
    if (fc) processed = processed.replace(full, '\n\n```l4-file\n' + fc.trimEnd() + '\n```\n\n');
  }
  return processed;
}

/** Rewrite internal links & images, keeping .md extension on links */
function processMarkdown(content: string, currentFolder: string): string {
  let out = content.replace(
    /\[([^\]]+)\]\((?!https?:\/\/)([^)]+\.md)(#[^)]*)?\)/g,
    (_m, text, p, anchor) => {
      const slug = convertDocPathToSlug(resolveRelativePath(p, currentFolder));
      return `[${text}](/l4/${slug.replace(/^\//, '')}.md${anchor || ''})`;
    }
  );
  out = out.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
    (_m, alt, src) => `![${alt}](/doc-images/${resolveRelativePath(src, currentFolder)})`
  );
  return out;
}

// ---------------------------------------------------------------------------

function resolveSlugToDoc(slug: string[]): { content: string; currentFolder: string } | null {
  let docPath = '';
  let currentFolder = '';

  if (slug.length === 0) {
    docPath = 'README.md';
    currentFolder = '';
  } else {
    const first = slug[0];
    const tab = DOC_TABS.find(t => t.slug === first);
    if (tab && tab.slug) {
      if (slug.length === 1) {
        docPath = `${tab.slug}/README.md`;
        currentFolder = tab.slug;
      } else {
        docPath = `${tab.slug}/${slug.slice(1).join('/')}.md`;
        currentFolder = slug.slice(0, -1).join('/');
      }
    } else {
      docPath = `${slug.join('/')}.md`;
      currentFolder = slug.length > 1 ? slug.slice(0, -1).join('/') : '';
    }
  }

  let content = getDocContent(docPath);
  if (!content && !docPath.endsWith('README.md')) {
    const dir = docPath.replace('.md', '/README.md');
    content = getDocContent(dir);
    if (content) currentFolder = docPath.replace('.md', '');
  }
  return content ? { content, currentFolder } : null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const outDir = path.join(process.cwd(), 'out/l4');

  // Collect all slugs (same logic as generateStaticParams in page.tsx)
  const slugs: string[][] = [];
  slugs.push([]); // root
  for (const tab of DOC_TABS) { if (tab.slug) slugs.push([tab.slug]); }
  for (const doc of getDocumentList()) {
    const s = doc.replace(/\.md$/, '').replace(/\/README$/, '').split('/').filter(Boolean);
    if (s.length > 0) slugs.push(s);
  }

  let count = 0;
  for (const slug of slugs) {
    const resolved = resolveSlugToDoc(slug);
    if (!resolved) continue;

    const withL4 = embedL4Files(resolved.content, resolved.currentFolder);
    const processed = processMarkdown(withL4, resolved.currentFolder);

    // Determine output path: slug [] → index.md, ['reference'] → reference.md, etc.
    const relPath = slug.length === 0 ? 'index.md' : `${slug.join('/')}.md`;
    const outPath = path.join(outDir, relPath);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, processed, 'utf-8');
    count++;
  }

  console.log(`Generated ${count} markdown files in out/l4/`);
}

main();
