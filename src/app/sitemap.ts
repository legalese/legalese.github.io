export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { DOC_TABS } from '@/lib/l4-docs';
import { getDocumentList } from '@/lib/l4-docs-server';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Site root
  entries.push({ url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 });

  // L4 markdown docs root
  entries.push({ url: `${SITE_URL}/l4/index.md`, changeFrequency: 'weekly', priority: 0.9 });

  // Tab roots
  for (const tab of DOC_TABS) {
    if (tab.slug) {
      entries.push({
        url: `${SITE_URL}/l4/${tab.slug}.md`,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // All documentation pages
  const docs = getDocumentList();
  for (const doc of docs) {
    const segments = doc
      .replace(/\.md$/, '')
      .replace(/\/README$/, '')
      .split('/')
      .filter(Boolean);

    if (segments.length > 0) {
      entries.push({
        url: `${SITE_URL}/l4/${segments.join('/')}.md`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
