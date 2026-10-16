import Link from 'next/link';
import { DocPager } from '@/lib/l4-docs';

interface DocPagerLinksProps {
  pager: DocPager;
  baseRoute?: string;
}

/**
 * Previous / next links at the foot of a page, in sidebar order
 */
export default function DocPagerLinks({ pager, baseRoute = '/l4' }: DocPagerLinksProps) {
  const { prev, next } = pager;
  if (!prev && !next) return null;

  const hrefFor = (href: string) => (href.startsWith('/') ? href : [baseRoute, href].filter(Boolean).join('/'));

  return (
    <nav
      aria-label="Previous and next page"
      className="mt-12 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {prev ? (
        <Link
          href={hrefFor(prev.href)}
          className="group block rounded-md border border-gray-200 px-4 py-3 hover:border-accent/50 transition-colors"
        >
          <span className="block text-xs text-gray-500">Previous</span>
          <span className="block text-sm font-medium text-gray-900 group-hover:text-accent">
            ← {prev.title}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link
          href={hrefFor(next.href)}
          className="group block rounded-md border border-gray-200 px-4 py-3 text-right hover:border-accent/50 transition-colors"
        >
          <span className="block text-xs text-gray-500">Next</span>
          <span className="block text-sm font-medium text-gray-900 group-hover:text-accent">
            {next.title} →
          </span>
        </Link>
      )}
    </nav>
  );
}
