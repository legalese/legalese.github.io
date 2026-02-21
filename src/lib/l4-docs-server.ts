// L4 Documentation server-side utilities (Node.js file system operations)
// This file should only be imported in Server Components or build scripts
import fs from 'fs';
import path from 'path';
import { resolveRelativePath, DOC_TABS } from './l4-docs';

// Local path to cloned documentation (populated by scripts/fetch-l4-docs.sh)
const LOCAL_DOC_PATH = path.join(process.cwd(), '.l4-docs/doc');

/**
 * Read content from the local documentation directory
 */
export function getDocContent(docPath: string): string | null {
  const fullPath = path.join(LOCAL_DOC_PATH, docPath);
  try {
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf-8');
    }
    return null;
  } catch (error) {
    console.error(`Failed to read ${fullPath}:`, error);
    return null;
  }
}

/**
 * Read an L4 file from the local documentation directory
 */
export function getL4File(filePath: string): string | null {
  return getDocContent(filePath);
}

/**
 * Embed .l4 file links in markdown content as code blocks.
 * Replaces [text](path.l4) with ```l4 ... ``` code blocks.
 * This must be called from server-side code only.
 */
export function embedL4Files(content: string, currentFolder: string): string {
  let processed = content;
  
  const l4LinkRegex = /\[([^\]]+)\]\(([^)]+\.l4)\)/g;
  let match;
  
  while ((match = l4LinkRegex.exec(content)) !== null) {
    const [fullMatch, , filePath] = match;
    const resolvedPath = resolveRelativePath(filePath, currentFolder);
    const fileContent = getL4File(resolvedPath);
    
    if (fileContent) {
      // Replace the link with a fenced code block
      // Add newlines to ensure the code block is on its own line (required for markdown parsing)
      // Use 'l4-file' language identifier to distinguish from inline ```l4``` blocks
      const codeBlock = '\n\n```l4-file\n' + fileContent.trimEnd() + '\n```\n\n';
      processed = processed.replace(fullMatch, codeBlock);
    }
    // If file not found, leave the link as-is
  }
  
  return processed;
}

/**
 * Resolve a slug array to a document path and load its content.
 * Shared between the HTML page and the markdown route handler.
 */
export function resolveSlugToDoc(slug: string[]): {
  content: string;
  currentFolder: string;
  currentTab: string;
} | null {
  let currentTab = '';
  let docPath = '';
  let currentFolder = '';

  if (slug.length === 0) {
    currentTab = '';
    docPath = 'README.md';
    currentFolder = '';
  } else {
    const firstSegment = slug[0];
    const tab = DOC_TABS.find((t) => t.slug === firstSegment);

    if (tab && tab.slug) {
      currentTab = tab.slug;
      if (slug.length === 1) {
        docPath = `${tab.slug}/README.md`;
        currentFolder = tab.slug;
      } else {
        const restPath = slug.slice(1).join('/');
        docPath = `${tab.slug}/${restPath}.md`;
        currentFolder = slug.slice(0, -1).join('/');
      }
    } else {
      docPath = `${slug.join('/')}.md`;
      currentFolder = slug.length > 1 ? slug.slice(0, -1).join('/') : '';
    }
  }

  let content = getDocContent(docPath);

  if (!content && !docPath.endsWith('README.md')) {
    const dirPath = docPath.replace('.md', '/README.md');
    content = getDocContent(dirPath);
    if (content) {
      currentFolder = docPath.replace('.md', '');
    }
  }

  if (!content) {
    return null;
  }

  return { content, currentFolder, currentTab };
}

/**
 * Get list of all documentation files from local directory
 * Used at build time to generate static params
 */
export function getDocumentList(dirPath: string = ''): string[] {
  const docs: string[] = [];
  const fullPath = path.join(LOCAL_DOC_PATH, dirPath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.error(`Documentation directory not found: ${fullPath}`);
      console.error('Run "npm run fetch-docs" to fetch the documentation.');
      return docs;
    }
    
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const relativePath = dirPath ? `${dirPath}/${entry.name}` : entry.name;
      
      if (entry.isFile() && entry.name.endsWith('.md')) {
        docs.push(relativePath);
      } else if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'images') {
        // Recursively get files from subdirectories
        const subDocs = getDocumentList(relativePath);
        docs.push(...subDocs);
      }
    }
  } catch (error) {
    console.error(`Error reading document list:`, error);
  }
  
  return docs;
}
