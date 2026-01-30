  'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchIndex,
  SearchResult,
  searchIndex,
  getResultUrl,
  highlightMatches,
} from '@/lib/search-index';

export default function DocSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load search index on first open
  useEffect(() => {
    if (isOpen && !index && !isLoading && !error) {
      setIsLoading(true);
      fetch('/search-index.min.json')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load search index');
          return res.json();
        })
        .then((data: SearchIndex) => {
          setIndex(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load search index:', err);
          setError('Failed to load search index');
          setIsLoading(false);
        });
    }
  }, [isOpen, index, isLoading, error]);

  // Perform search when query changes
  useEffect(() => {
    if (!index || !query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    
    const searchResults = searchIndex(index, query, 10);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, index]);

  // Navigate to selected result
  const navigateToResult = useCallback((result: SearchResult) => {
    const url = getResultUrl(result);
    setIsOpen(false);
    setQuery('');
    router.push(url);
  }, [router]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+/ or Ctrl+/ to open
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Cmd+K or Ctrl+K to open (common search shortcut)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle keyboard navigation within results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
    }
  };

  // Scroll selected result into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, results.length]);

  // Focus input when modal opens (handles iOS better than setTimeout)
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the input is rendered
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[400px]">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors w-full"
      >
        <span className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-mono bg-white rounded border border-gray-300">
          <span className="text-xs"><span className="os-mac:inline hidden">⌘</span><span className="os-other:inline hidden">Ctrl+</span></span>/
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-[11px] sm:absolute sm:left-0 sm:right-0 sm:-top-px sm:w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search documentation..."
              className="flex-1 text-base outline-none placeholder-gray-400"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 rounded border border-gray-200">
              esc
            </kbd>
          </div>
          {/* Results area */}
          <div className="max-h-[70vh] overflow-y-auto border-t border-gray-100" ref={resultsRef}>
            {isLoading && (
              <div className="p-4 text-center text-sm text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2"></div>
                Loading search index...
              </div>
            )}
            
            {error && (
              <div className="p-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            
            {!isLoading && !error && query.trim() === '' && (
              <div className="p-4 text-center text-sm text-gray-500">
                <p>Type to search documentation</p>
                <p className="text-xs mt-1 text-gray-400">Search titles, sections, and keywords</p>
              </div>
            )}
            
            {!isLoading && !error && query.trim() !== '' && results.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                <p>No results found for &quot;{query}&quot;</p>
                <p className="text-xs mt-1 text-gray-400">Try different keywords</p>
              </div>
            )}
            
            {results.map((result, idx) => (
              <button
                key={`${result.slug}-${result.anchor || 'main'}-${result.excerpt}`}
                onClick={() => navigateToResult(result)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                  idx === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {result.section ? (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title and section */}
                    <div className="text-sm font-medium text-gray-900">
                      {result.section ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatches(result.section, query),
                          }}
                        />
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatches(result.title, query),
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Breadcrumb */}
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {result.breadcrumb.slice(0, -1).join(' › ')}
                      {result.section && (
                        <span className="text-gray-400"> › {result.title}</span>
                      )}
                    </div>
                    
                    {/* Excerpt */}
                    {result.excerpt && (
                      <div
                        className="text-xs text-gray-600 mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(result.excerpt, query),
                        }}
                      />
                    )}
                  </div>
                  

                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
