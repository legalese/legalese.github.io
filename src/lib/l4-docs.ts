// L4 Documentation utilities (shared between client and server)
// Server-only functions (file system) are in l4-docs-server.ts

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export const DOC_TABS = [
  { name: 'Overview', slug: '' },
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
 * Extract table of contents from markdown content
 */
export function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headings: TableOfContentsItem[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const [, hashes, rawTitle] = match;
      const level = hashes.length;
      const title = stripMarkdown(rawTitle);
      const id = generateHeadingId(title);
      headings.push({ id, title, level });
    }
  }

  return headings;
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
  baseRoute: string = '/l4'
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
      return `[${text}](${baseRoute}/${slug.replace(/^\//, '')}${anchorSuffix})`;
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
 * Add IDs to headings for anchor navigation
 */
export function addHeadingIds(html: string): string {
  // Match h2-h4 tags with any content inside (including nested HTML like links)
  return html.replace(
    /<h([2-4])>([\s\S]*?)<\/h\1>/g,
    (match, level, content) => {
      // Strip HTML to get plain text, then generate ID
      const plainText = stripHtml(content).trim();
      const id = generateHeadingId(plainText);
      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
}


