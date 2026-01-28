'use client';

import { useEffect } from 'react';

export default function OsDetect() {
  useEffect(() => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 
      || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
    
    document.documentElement.classList.add(isMac ? 'os-mac' : 'os-other');
  }, []);

  return null;
}
