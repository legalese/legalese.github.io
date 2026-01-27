'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem, NavSection } from '@/lib/l4-docs';

interface DocSidebarProps {
  sections: NavSection[];
  baseRoute?: string;
}

export default function DocSidebar({ sections, baseRoute = '/l4' }: DocSidebarProps) {
  const pathname = usePathname();

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const href = item.href.startsWith('/') ? item.href : `${baseRoute}/${item.href}`;
    const isActive = pathname === href || pathname === `${href}/`;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.href} className="my-0.5">
        <Link
          href={href}
          className={`block py-1.5 px-3 text-sm rounded-md transition-colors ${
            isActive
              ? 'bg-accent/10 text-accent font-medium'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          {item.title}
        </Link>
        {hasChildren && (
          <ul className="mt-0.5">
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50/50 overflow-y-auto">
      <div className="p-4">
        {sections.map((section, index) => (
          <div key={section.title} className={index > 0 ? 'mt-8' : ''}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => renderNavItem(item))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
