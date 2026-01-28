'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DocHeader from './doc-header';
import DocSidebar from './doc-sidebar';
import DocToc from './doc-toc';
import DocContent from './doc-content';
import { NavSection, TableOfContentsItem } from '@/lib/l4-docs';

interface DocLayoutProps {
  navSections: NavSection[];
  toc: TableOfContentsItem[];
  htmlContent: string;
}

export default function DocLayout({ navSections, toc, htmlContent }: DocLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Close sidebar when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  
  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const hasNavigation = navSections.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <DocHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        hasNavigation={hasNavigation}
      />
      
      <div className="flex-1 flex">
        {/* Left Sidebar - Navigation from SUMMARY.md (mobile overlay) */}
        {hasNavigation && (
          <DocSidebar 
            sections={navSections} 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:px-8">
            <DocContent html={htmlContent} />
          </div>
        </main>
        
        {/* Right Sidebar - Table of Contents */}
        {toc.length > 0 && <DocToc items={toc} />}
      </div>
    </div>
  );
}
