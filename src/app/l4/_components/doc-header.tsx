'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CMS_NAME } from '@/lib/constants';
import { DOC_TABS } from '@/lib/l4-docs';
import { usePathname } from 'next/navigation';
import DocSearch from './doc-search';

export default function DocHeader() {
  const pathname = usePathname();
  
  // Determine active tab from pathname
  const getActiveTab = () => {
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length <= 1) return ''; // /l4 -> Overview
    const firstSegment = pathParts[1];
    const tab = DOC_TABS.find(t => t.slug === firstSegment);
    return tab ? tab.slug : '';
  };
  
  const activeTab = getActiveTab();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/assets/logos/legalese-logo.png"
            alt="§"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="text-xl font-bold tracking-tight font-merriweather">{CMS_NAME}</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-1">
            {DOC_TABS.map((tab) => (
              <Link
                key={tab.slug}
                href={`/l4${tab.slug ? `/${tab.slug}` : ''}`}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.slug
                    ? 'bg-accent/10 text-accent'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
          
          <DocSearch />
        </div>
      </div>
      
      {/* Mobile tabs */}
      <div className="md:hidden overflow-x-auto border-t border-gray-100">
        <nav className="flex px-4 py-2 gap-1">
          {DOC_TABS.map((tab) => (
            <Link
              key={tab.slug}
              href={`/l4${tab.slug ? `/${tab.slug}` : ''}`}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.slug
                  ? 'bg-accent/10 text-accent'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
