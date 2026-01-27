// L4 Documentation server-side utilities (Node.js file system operations)
// This file should only be imported in Server Components or build scripts
import fs from 'fs';
import path from 'path';
import { resolveRelativePath } from './l4-docs';

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
