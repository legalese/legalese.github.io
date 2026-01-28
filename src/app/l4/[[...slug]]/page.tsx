import { notFound } from 'next/navigation';
import markdownToHtml from '@/lib/markdownToHtml';
import DocLayout from '../_components/doc-layout';

import {
  parseSummary,
  extractTableOfContents,
  processMarkdownContent,
  addHeadingIds,
  DOC_TABS,
  NavSection,
  TableOfContentsItem,
} from '@/lib/l4-docs';
import { getDocContent, getDocumentList, embedL4Files } from '@/lib/l4-docs-server';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Generate static params from local documentation files at build time
export function generateStaticParams() {
  const paths: { slug?: string[] }[] = [];
  
  // Root path
  paths.push({ slug: undefined });
  
  // Tab paths
  for (const tab of DOC_TABS) {
    if (tab.slug) {
      paths.push({ slug: [tab.slug] });
    }
  }
  
  // Get document list from local files
  const docs = getDocumentList();
  
  for (const doc of docs) {
    // Remove .md extension and split into segments
    const slug = doc.replace(/\.md$/, '').replace(/\/README$/, '').split('/').filter(Boolean);
    if (slug.length > 0) {
      paths.push({ slug });
    }
  }
  
  return paths;
}

export default async function L4DocPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  
  // Determine the current tab and document path
  let currentTab = '';
  let docPath = '';
  let currentFolder = '';
  
  if (slug.length === 0) {
    // Root /l4 -> Overview tab, README.md
    currentTab = '';
    docPath = 'README.md';
    currentFolder = '';
  } else {
    // Check if first segment is a tab
    const firstSegment = slug[0];
    const tab = DOC_TABS.find((t) => t.slug === firstSegment);
    
    if (tab && tab.slug) {
      // It's a tab route like /l4/reference
      currentTab = tab.slug;
      if (slug.length === 1) {
        // Tab root -> README.md in that folder
        docPath = `${tab.slug}/README.md`;
        currentFolder = tab.slug;
      } else {
        // Nested path within tab
        const restPath = slug.slice(1).join('/');
        docPath = `${tab.slug}/${restPath}.md`;
        currentFolder = slug.slice(0, -1).join('/');
      }
    } else {
      // Not a tab, it's a document path from root
      docPath = `${slug.join('/')}.md`;
      currentFolder = slug.length > 1 ? slug.slice(0, -1).join('/') : '';
    }
  }
  
  // Read the document content from local files
  let content = getDocContent(docPath);
  
  // If not found, try as a directory with README.md
  if (!content && !docPath.endsWith('README.md')) {
    const dirPath = docPath.replace('.md', '/README.md');
    content = getDocContent(dirPath);
    if (content) {
      currentFolder = docPath.replace('.md', '');
    }
  }
  
  if (!content) {
    notFound();
  }
  
  // Read SUMMARY.md - walk up the directory tree until we find one
  let summaryContent: string | null = null;
  let summaryFolder = currentFolder;
  
  while (summaryContent === null) {
    const summaryPath = summaryFolder ? `${summaryFolder}/SUMMARY.md` : 'SUMMARY.md';
    summaryContent = getDocContent(summaryPath);
    
    if (summaryContent === null) {
      // Move up one directory
      if (!summaryFolder || !summaryFolder.includes('/')) {
        // We're at root or one level deep, try root SUMMARY.md and stop
        if (summaryFolder) {
          summaryContent = getDocContent('SUMMARY.md');
        }
        break;
      }
      summaryFolder = summaryFolder.split('/').slice(0, -1).join('/');
    }
  }
  
  let navSections: NavSection[] = [];
  if (summaryContent) {
    navSections = parseSummary(summaryContent);
    // Adjust nav items base path - use the folder where SUMMARY.md was found
    const navBaseFolder = summaryFolder || currentTab;
    if (navBaseFolder) {
      navSections = navSections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          href: item.href.startsWith('/') ? item.href : `${navBaseFolder}/${item.href}`,
          children: item.children?.map((child) => ({
            ...child,
            href: child.href.startsWith('/') ? child.href : `${navBaseFolder}/${child.href}`,
          })),
        })),
      }));
    }
  }
  
  // Extract table of contents from the content
  const toc: TableOfContentsItem[] = extractTableOfContents(content);
  
  // Embed .l4 file links as code blocks (must happen before markdown processing)
  const contentWithL4 = embedL4Files(content, currentFolder);
  
  // Process the markdown content (rewrite internal links)
  const processedContent = processMarkdownContent(contentWithL4, currentFolder);
  
  // Convert to HTML
  let htmlContent = await markdownToHtml(processedContent, { sanitize: false });
  
  // Add IDs to headings for anchor navigation
  htmlContent = addHeadingIds(htmlContent);
  
  return (
    <DocLayout 
      navSections={navSections} 
      toc={toc} 
      htmlContent={htmlContent} 
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  
  let title = 'L4 Documentation';
  if (slug.length > 0) {
    const docPath = slug.join('/');
    title = `${docPath.split('/').pop()?.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())} | L4 Documentation`;
  }
  
  return {
    title,
    description: 'L4 Language Reference and Documentation - Rules as Code',
    openGraph: {
      title,
      description: 'L4 Language Reference and Documentation - Rules as Code',
      images: ['/opengraph/l4-docs.jpeg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'L4 Language Reference and Documentation - Rules as Code',
      images: ['/opengraph/l4-docs.jpeg'],
    },
  };
}
