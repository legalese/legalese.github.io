'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    hljs: any;
  }
}

export default function HighlightInit() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.hljs) {
        // Register l4-file as an alias for l4 (used for embedded .l4 files)
        const l4Lang = window.hljs.getLanguage('l4');
        if (l4Lang) window.hljs.registerLanguage('l4-file', () => l4Lang);
        window.hljs.highlightAll();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);  // Re-run on pathname change (route navigation)

  return null;
}