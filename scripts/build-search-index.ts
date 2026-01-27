#!/usr/bin/env npx ts-node
/**
 * Build search index for L4 documentation
 * 
 * This script reads all markdown files from .l4-docs/doc and creates
 * a JSON search index that can be used by the client-side search.
 * 
 * Run: npx ts-node scripts/build-search-index.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface SearchIndexEntry {
  /** Document title (from first h1 or filename) */
  title: string;
  /** URL slug for the document */
  slug: string;
  /** Section heading (h2/h3) if this entry is for a specific section */
  section?: string;
  /** Anchor ID for the section */
  anchor?: string;
  /** Keywords extracted from content */
  keywords: string[];
  /** Brief excerpt/description */
  excerpt: string;
  /** Breadcrumb path for display */
  breadcrumb: string[];
}

interface SearchIndex {
  version: number;
  generatedAt: string;
  entries: SearchIndexEntry[];
}

const LOCAL_DOC_PATH = path.join(process.cwd(), '.l4-docs/doc');
const OUTPUT_PATH = path.join(process.cwd(), 'public/search-index.json');

// Common stop words to filter out from keywords
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'this', 'can', 'could', 'would', 'should', 'have', 'has', 'had',
  'but', 'not', 'you', 'your', 'we', 'our', 'they', 'their', 'i', 'me', 'my',
  'if', 'then', 'else', 'when', 'which', 'who', 'what', 'how', 'why', 'where',
  'also', 'just', 'only', 'more', 'some', 'any', 'all', 'each', 'other', 'such',
  'no', 'so', 'than', 'too', 'very', 'use', 'used', 'using', 'uses',
]);

// L4-specific important keywords to always include
const L4_KEYWORDS = new Set([
  'l4', 'rule', 'rules', 'contract', 'contracts', 'law', 'legal', 'legislation',
  'obligation', 'permission', 'prohibition', 'power', 'liability', 'immunity',
  'duty', 'right', 'party', 'parties', 'agreement', 'clause', 'condition',
  'boolean', 'arithmetic', 'function', 'type', 'class', 'record', 'enum',
  'declare', 'define', 'decide', 'means', 'given', 'giveth', 'if', 'then', 'else',
  'and', 'or', 'not', 'implies', 'iff', 'forall', 'exists', 'sum', 'product',
  'minimum', 'maximum', 'number', 'integer', 'fraction', 'money', 'date', 'time',
  'duration', 'string', 'boolean', 'true', 'false', 'list', 'set', 'map',
  'must', 'may', 'shant', 'hence', 'lest', 'within', 'before', 'after',
  'scenario', 'assert', 'trace', 'test', 'example', 'syntax', 'semantics',
]);

/**
 * Generate a heading ID from text (matches l4-docs.ts logic)
 */
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Strip markdown formatting from text to produce plain text
 */
function stripMarkdown(text: string): string {
  return text
    // Remove fenced code blocks (``` or ~~~) - handle unclosed blocks too
    .replace(/```[\s\S]*?(```|$)/g, '')
    .replace(/~~~[\s\S]*?(~~~|$)/g, '')
    // Remove indented code blocks (4 spaces or tab at start of line)
    .replace(/^(?: {4}|\t).+$/gm, '')
    // Remove images ![alt](url) or ![alt][ref]
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    // Remove links [text](url) or [text][ref] - keep the text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    // Remove reference-style link definitions [ref]: url
    .replace(/^\[[^\]]+\]:\s*.+$/gm, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove bold **text** or __text__ (handle nested/unmatched)
    .replace(/\*\*([^*]*?)\*\*/g, '$1')
    .replace(/__([^_]*?)__/g, '$1')
    // Remove italic *text* or _text_ (be careful not to match list items)
    .replace(/(?<!^|\n)\*([^*\n]+)\*/g, '$1')
    .replace(/(?<!^|\n|\s)_([^_\n]+)_(?!\w)/g, '$1')
    // Remove strikethrough ~~text~~
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove inline code `text` (handle multiple backticks too)
    .replace(/`{3,}[^`]*`{3,}/g, '')
    .replace(/``([^`]*)``/g, '$1')
    .replace(/`([^`\n]*)`/g, '$1')
    // Remove stray backticks
    .replace(/`/g, '')
    // Remove heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s?/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove list markers (unordered: -, *, +)
    .replace(/^\s*[-*+]\s+/gm, '')
    // Remove list markers (ordered: 1., 2., etc.)
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove task list markers [ ] or [x]
    .replace(/\[[ x]\]\s*/gi, '')
    // Remove footnote references [^1]
    .replace(/\[\^[^\]]+\]/g, '')
    // Remove GFM table separator lines (|---|---| or ---|--- with optional alignment colons)
    .replace(/^\|?[\s:]*-{3,}[\s:]*(?:\|[\s:]*-{3,}[\s:]*)+\|?\s*$/gm, '')
    // Remove table row formatting - extract cell content
    .replace(/^\|(.*)\|\s*$/gm, (_, content) => 
      content.split('|').map((cell: string) => cell.trim()).join(' ')
    )
    // Handle tables without leading/trailing pipes
    .replace(/^([^|\n]+(?:\|[^|\n]+)+)$/gm, (match) => {
      // Skip if it looks like a separator line
      if (/^[\s|:-]+$/.test(match)) return '';
      return match.split('|').map(cell => cell.trim()).join(' ');
    })
    // Remove remaining unmatched bold/italic markers
    .replace(/\*{1,2}/g, '')
    .replace(/_{1,2}/g, ' ')
    // Remove remaining tilde markers
    .replace(/~~/g, '')
    // Clean up escaped characters
    .replace(/\\([\[\](){}*_`#>+\-.!~])/g, '$1')
    // Collapse multiple spaces
    .replace(/  +/g, ' ')
    // Collapse multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  const cleanText = stripMarkdown(text).toLowerCase();
  
  // Split into words and filter
  const words = cleanText
    .split(/[\s\-_.,;:!?()\[\]{}"'`<>\/\\]+/)
    .filter(word => word.length >= 2)
    .filter(word => !STOP_WORDS.has(word) || L4_KEYWORDS.has(word))
    .filter(word => !/^\d+$/.test(word)); // Remove pure numbers
  
  // Count frequency
  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  
  // Sort by frequency and take top keywords
  // Prioritize L4-specific keywords
  const sorted = Array.from(freq.entries())
    .sort((a, b) => {
      const aIsL4 = L4_KEYWORDS.has(a[0]) ? 1 : 0;
      const bIsL4 = L4_KEYWORDS.has(b[0]) ? 1 : 0;
      if (aIsL4 !== bIsL4) return bIsL4 - aIsL4;
      return b[1] - a[1];
    })
    .slice(0, 20)
    .map(([word]) => word);
  
  return sorted;
}

/**
 * Check if a paragraph looks like a code block or code-heavy content
 */
function isCodeBlock(text: string): boolean {
  const trimmed = text.trim();
  // Fenced code blocks
  if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) return true;
  // Indented code (all lines start with 4 spaces or tab)
  const lines = trimmed.split('\n').filter(l => l.trim());
  if (lines.length > 0 && lines.every(l => l.startsWith('    ') || l.startsWith('\t'))) return true;
  // L4 code patterns (DECLARE, DECIDE, GIVEN, etc.)
  if (/^(DECLARE|DECIDE|GIVEN|DEFINE|RULE|SCENARIO|ASSERT|#EVAL)\b/i.test(trimmed)) return true;
  // Lines that look like code (high density of special characters)
  const specialCharRatio = (trimmed.match(/[{}()\[\]<>=|&:;]/g) || []).length / trimmed.length;
  if (specialCharRatio > 0.1) return true;
  return false;
}

/**
 * Extract first paragraph or meaningful excerpt from content
 */
function extractExcerpt(content: string, maxLength: number = 150): string {
  // Skip front matter
  let text = content.replace(/^---[\s\S]*?---\n?/, '');
  
  // Remove all fenced code blocks first (they can span "paragraphs")
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/~~~[\s\S]*?~~~/g, '');
  
  // Skip title
  text = text.replace(/^#\s+.+\n?/, '');
  
  // Get first meaningful paragraph
  const paragraphs = text.split(/\n\n+/);
  for (const para of paragraphs) {
    // Skip code blocks
    if (isCodeBlock(para)) continue;
    
    const clean = stripMarkdown(para).trim();
    // Skip empty, headings, or lines that still look like code
    if (!clean || clean.startsWith('#') || clean.length <= 20) continue;
    
    if (clean.length <= maxLength) return clean;
    return clean.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }
  
  return '';
}

/**
 * Convert doc path to URL slug
 */
function docPathToSlug(docPath: string): string {
  return docPath
    .replace(/\.md$/, '')
    .replace(/\/README$/, '')
    .replace(/^\.\//, '');
}

/**
 * Generate breadcrumb from path
 */
function pathToBreadcrumb(docPath: string): string[] {
  const slug = docPathToSlug(docPath);
  const parts = slug.split('/').filter(Boolean);
  
  return parts.map(part => 
    part
      .replace(/^\d+-/, '') // Remove leading numbers like "01-"
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  );
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, filename: string): string {
  // Try to find h1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return stripMarkdown(h1Match[1]);
  }
  
  // Try front matter title
  const frontMatterMatch = content.match(/^---[\s\S]*?title:\s*(.+?)[\n\r][\s\S]*?---/);
  if (frontMatterMatch) {
    return frontMatterMatch[1].replace(/^["']|["']$/g, '');
  }
  
  // Fall back to filename
  return filename
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Extract sections (h2 and h3 headings) from content
 */
function extractSections(content: string): Array<{ title: string; level: number; content: string }> {
  const sections: Array<{ title: string; level: number; content: string }> = [];
  const lines = content.split('\n');
  let currentSection: { title: string; level: number; lines: string[] } | null = null;
  
  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    
    if (h2Match || h3Match) {
      // Save previous section
      if (currentSection) {
        sections.push({
          title: currentSection.title,
          level: currentSection.level,
          content: currentSection.lines.join('\n'),
        });
      }
      
      // Start new section
      currentSection = {
        title: stripMarkdown(h2Match ? h2Match[1] : h3Match![1]),
        level: h2Match ? 2 : 3,
        lines: [],
      };
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }
  
  // Save last section
  if (currentSection && currentSection.lines.length > 0) {
    sections.push({
      title: currentSection.title,
      level: currentSection.level,
      content: currentSection.lines.join('\n'),
    });
  }
  
  return sections;
}

/**
 * Process a single markdown file
 */
function processFile(filePath: string, relativePath: string): SearchIndexEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(relativePath);
  const entries: SearchIndexEntry[] = [];
  
  const title = extractTitle(content, filename);
  const slug = docPathToSlug(relativePath);
  const breadcrumb = pathToBreadcrumb(relativePath);
  
  // Main document entry
  entries.push({
    title,
    slug,
    keywords: extractKeywords(content),
    excerpt: extractExcerpt(content),
    breadcrumb,
  });
  
  // Section entries
  const sections = extractSections(content);
  for (const section of sections) {
    if (section.content.trim().length > 50) { // Only index substantial sections
      const anchor = generateHeadingId(section.title);
      entries.push({
        title,
        slug,
        section: section.title,
        anchor,
        keywords: extractKeywords(section.content),
        excerpt: extractExcerpt(section.content, 100),
        breadcrumb: [...breadcrumb, section.title],
      });
    }
  }
  
  return entries;
}

/**
 * Recursively get all markdown files
 */
function getMarkdownFiles(dir: string, base: string = ''): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = base ? `${base}/${entry.name}` : entry.name;
    
    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'SUMMARY.md') {
      files.push(relativePath);
    } else if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'images') {
      files.push(...getMarkdownFiles(fullPath, relativePath));
    }
  }
  
  return files;
}

/**
 * Main build function
 */
function buildSearchIndex(): void {
  console.log('Building search index...');
  
  if (!fs.existsSync(LOCAL_DOC_PATH)) {
    console.error(`Documentation directory not found: ${LOCAL_DOC_PATH}`);
    console.error('Run "npm run fetch-docs" first.');
    process.exit(1);
  }
  
  const markdownFiles = getMarkdownFiles(LOCAL_DOC_PATH);
  console.log(`Found ${markdownFiles.length} markdown files`);
  
  const entries: SearchIndexEntry[] = [];
  
  for (const file of markdownFiles) {
    const fullPath = path.join(LOCAL_DOC_PATH, file);
    try {
      const fileEntries = processFile(fullPath, file);
      entries.push(...fileEntries);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log(`Generated ${entries.length} search index entries`);
  
  const index: SearchIndex = {
    version: 1,
    generatedAt: new Date().toISOString(),
    entries,
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));
  console.log(`Search index written to ${OUTPUT_PATH}`);
  
  // Also output a minified version for production
  const minifiedPath = OUTPUT_PATH.replace('.json', '.min.json');
  fs.writeFileSync(minifiedPath, JSON.stringify(index));
  console.log(`Minified search index written to ${minifiedPath}`);
}

// Run the build
buildSearchIndex();
