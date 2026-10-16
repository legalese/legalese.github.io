// L4 Documentation utilities (shared between client and server)
// Server-only functions (file system) are in l4-docs-server.ts

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export interface NavSection {
  /** Empty for the links a SUMMARY.md lists above its first `##` heading */
  title: string;
  items: NavItem[];
}

/** The pages before and after the current one, in SUMMARY.md order */
export interface DocPager {
  prev?: NavItem;
  next?: NavItem;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export const DOC_TABS = [
  { name: 'Home', slug: '' },
  { name: 'Reference', slug: 'reference' },
  { name: 'Courses', slug: 'courses' },
  { name: 'Tutorials', slug: 'tutorials' },
  { name: 'Concepts', slug: 'concepts' },
] as const;

/**
 * Parse SUMMARY.md to extract navigation structure with sections
 */
export function parseSummary(content: string): NavSection[] {
  const lines = content.split('\n');
  const sections: NavSection[] = [];
  let currentSection: NavSection | null = null;
  let itemStack: { items: NavItem[]; indent: number }[] = [];

  for (const line of lines) {
    // Match section headers: ## Section Title
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      // Start a new section
      currentSection = {
        title: headerMatch[1].trim(),
        items: [],
      };
      sections.push(currentSection);
      itemStack = [{ items: currentSection.items, indent: -1 }];
      continue;
    }

    // Match markdown links: - [Title](path.md) or * [Title](path.md)
    const linkMatch = line.match(/^(\s*)[-*]\s*\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && !currentSection) {
      // Links above the first `##` form a group without a heading
      currentSection = { title: '', items: [] };
      sections.push(currentSection);
      itemStack = [{ items: currentSection.items, indent: -1 }];
    }
    if (linkMatch && currentSection) {
      const [, spaces, title, href] = linkMatch;
      const indent = spaces.length;

      const item: NavItem = {
        title,
        href: convertDocPathToSlug(href),
      };

      // Find the right parent based on indentation
      while (itemStack.length > 1 && itemStack[itemStack.length - 1].indent >= indent) {
        itemStack.pop();
      }

      const parent = itemStack[itemStack.length - 1];
      parent.items.push(item);

      // Prepare for potential children
      item.children = [];
      itemStack.push({ items: item.children, indent });
    }
  }

  // Clean up empty children arrays
  const cleanChildren = (items: NavItem[]) => {
    for (const item of items) {
      if (item.children && item.children.length === 0) {
        delete item.children;
      } else if (item.children) {
        cleanChildren(item.children);
      }
    }
  };
  
  for (const section of sections) {
    cleanChildren(section.items);
  }

  return sections;
}

/**
 * Prefix every nav href, at any depth, with the folder its SUMMARY.md lives in
 */
export function prefixNavHrefs(sections: NavSection[], folder: string): NavSection[] {
  const prefix = (items: NavItem[]): NavItem[] =>
    items.map((item) => ({
      ...item,
      href: item.href.startsWith('/') ? item.href : [folder, item.href].filter(Boolean).join('/'),
      children: item.children && prefix(item.children),
    }));
  return sections.map((section) => ({ ...section, items: prefix(section.items) }));
}

/**
 * Find the previous and next page around `currentHref` (a nav href such as
 * "reference/functions/DECIDE"), walking the nav depth-first.
 */
export function findPager(sections: NavSection[], currentHref: string): DocPager {
  const flat: NavItem[] = [];
  const walk = (items: NavItem[]) => {
    for (const item of items) {
      flat.push(item);
      if (item.children) walk(item.children);
    }
  };
  for (const section of sections) walk(section.items);

  const index = flat.findIndex((item) => item.href === currentHref);
  if (index === -1) return {};
  return { prev: flat[index - 1], next: flat[index + 1] };
}

/**
 * Convert a documentation path to a route slug
 * e.g., "./10-boolean-logic.md" -> "10-boolean-logic"
 * e.g., "libraries/daydate.md" -> "libraries/daydate"
 */
export function convertDocPathToSlug(docPath: string): string {
  return docPath
    .replace(/^\.\//, '') // Remove leading ./
    .replace(/\.md$/, '') // Remove .md extension
    .replace(/README$/, '') // Remove README (use directory as path)
    .replace(/\/$/, ''); // Remove trailing slash
}

/**
 * Convert a route slug back to a documentation path
 */
export function convertSlugToDocPath(slug: string[]): string {
  if (slug.length === 0) {
    return 'README.md';
  }
  const path = slug.join('/');
  // Check if it's a directory (should load README.md)
  // We'll handle this in the component by trying README.md first
  return `${path}.md`;
}

/**
 * Get the folder path from a slug
 */
export function getFolderFromSlug(slug: string[]): string {
  if (slug.length === 0) return '';
  // If it's a nested path like "libraries/daydate", the folder is "libraries"
  if (slug.length > 1) {
    return slug.slice(0, -1).join('/');
  }
  return '';
}

/**
 * Strip markdown formatting from text (links, bold, italic, code)
 */
function stripMarkdown(text: string): string {
  return text
    // Replace markdown links [text](url) with just text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove italic *text* or _text_
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove inline code `text`
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

/**
 * Strip HTML tags from text to get plain text content
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Generate a consistent ID from text (used for both TOC and heading IDs)
 */
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Return a function that turns heading text into an ID, suffixing repeats
 * ("setup", "setup-1", "setup-2") so every anchor on a page is unique.
 */
function createHeadingIdGenerator(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = generateHeadingId(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

/**
 * Extract table of contents from markdown content
 */
export function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headings: TableOfContentsItem[] = [];
  const lines = content.split('\n');
  const nextId = createHeadingIdGenerator();
  let fence: string | null = null;

  for (const line of lines) {
    // Lines inside fenced code blocks are not headings
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1].startsWith(fence)) fence = null;
      continue;
    }
    if (fence) continue;

    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const [, hashes, rawTitle] = match;
      const level = hashes.length;
      const title = stripMarkdown(rawTitle);
      headings.push({ id: nextId(title), title, level });
    }
  }

  return headings;
}

/**
 * The page's H1, as plain text, or null when it has none
 */
export function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? stripMarkdown(match[1]) : null;
}

/**
 * The first prose paragraph after the H1, as plain text of at most
 * `maxLength` characters, or null when the page opens with something else
 */
export function extractDescription(content: string, maxLength: number = 160): string | null {
  const afterTitle = content.split(/^#\s+.+$/m)[1] ?? content;
  const paragraph = afterTitle
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !/^(#|```|~~~|[-*>|!<]|\d+\.\s|\*\*Prerequisites)/.test(block));
  if (!paragraph) return null;

  const text = stripMarkdown(paragraph.replace(/\s+/g, ' '));
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength - 1)) + '…';
}

/**
 * Resolve a relative path against a current folder
 * Handles ./, ../, and plain relative paths
 */
export function resolveRelativePath(path: string, currentFolder: string): string {
  // Remove leading ./ if present
  let cleanPath = path.replace(/^\.\//g, '');
  
  // Handle ../ navigation
  const parts = currentFolder ? currentFolder.split('/') : [];
  while (cleanPath.startsWith('../')) {
    cleanPath = cleanPath.slice(3);
    parts.pop();
  }
  
  // If the path is absolute (starts with /) or has no current folder context, use it directly
  if (path.startsWith('/')) {
    return cleanPath;
  }
  
  // Combine current folder with the relative path
  if (parts.length > 0) {
    return `${parts.join('/')}/${cleanPath}`;
  }
  
  return cleanPath;
}

/**
 * Process markdown content to rewrite internal links.
 * Note: .l4 file embedding is handled by embedL4Files in l4-docs-server.ts
 */
export function processMarkdownContent(
  content: string,
  currentFolder: string,
  baseRoute: string = '/l4',
  { keepMdExtension = false }: { keepMdExtension?: boolean } = {}
): string {
  // Rewrite internal markdown links to use the l4 route
  // Match [text](path.md) or [text](path.md#anchor) but not external links
  let processedContent = content.replace(
    /\[([^\]]+)\]\((?!https?:\/\/)([^)]+\.md)(#[^)]*)?\)/g,
    (match, text, path, anchor) => {
      // First resolve the relative path, then convert to slug
      const resolvedPath = resolveRelativePath(path, currentFolder);
      const slug = convertDocPathToSlug(resolvedPath);
      const anchorSuffix = anchor || '';
      const ext = keepMdExtension ? '.md' : '';
      return `[${text}](${baseRoute}/${slug.replace(/^\//, '')}${ext}${anchorSuffix})`;
    }
  );

  // Rewrite image paths to use /doc-images/ as base path
  processedContent = processedContent.replace(
    /!\[([^\]]+)\]\((?!https?:\/\/)([^)]+)\)/g,
    (match, alt, src) => {
      // Resolve relative image paths
      const resolvedSrc = resolveRelativePath(src, currentFolder);
      return `![${alt}](/doc-images/${resolvedSrc})`;
    }
  );

  return processedContent;
}

/**
 * Add IDs to headings for anchor navigation.
 *
 * When the page's table of contents lists the same headings, its IDs are
 * used in order, so TOC links always land; otherwise IDs are derived from
 * the rendered heading text.
 */
export function addHeadingIds(html: string, toc: TableOfContentsItem[] = []): string {
  const headingPattern = /<h([2-4])>([\s\S]*?)<\/h\1>/g;
  const headingCount = html.match(headingPattern)?.length ?? 0;
  const useToc = headingCount === toc.length;
  const nextId = createHeadingIdGenerator();
  let index = 0;

  // Match h2-h4 tags with any content inside (including nested HTML like links)
  return html.replace(headingPattern, (match, level, content) => {
    const id = useToc ? toc[index].id : nextId(decodeEntities(stripHtml(content)).trim());
    index++;
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}


