export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'Claude-Web',
          'anthropic-ai',
          'CCBot',
          'PerplexityBot',
          'Bytespider',
          'cohere-ai',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
