'use client';

import { useEffect, useState } from 'react';
import { TableOfContentsItem } from '@/lib/l4-docs';

interface DocTocProps {
  items: TableOfContentsItem[];
}

export default function DocToc({ items }: DocTocProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Track active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-64 2xl:w-72 flex-shrink-0">
      <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          On this page
        </h3>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block py-1 text-sm transition-colors ${
                  activeId === item.id
                    ? 'text-accent font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
    </nav>
    </aside>
  );
}
