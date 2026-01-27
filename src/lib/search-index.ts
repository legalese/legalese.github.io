// Search index types and utilities for L4 documentation search

export interface SearchIndexEntry {
  /** Document title (from first h1 or filename) */
  title: string;
  /** URL slug for the document */
  slug: string;
  /** Section heading (h2/h3) if this entry is for a specific section */
  section?: string;
  /** Anchor ID for the section */
  anchor?: string;
  /** Keywords extracted from content */
  keywords: string[];
  /** Brief excerpt/description */
  excerpt: string;
  /** Breadcrumb path for display */
  breadcrumb: string[];
}

export interface SearchIndex {
  version: number;
  generatedAt: string;
  entries: SearchIndexEntry[];
}

export interface SearchResult extends SearchIndexEntry {
  /** Relevance score (higher is better) */
  score: number;
  /** Which fields matched the query */
  matchedFields: ('title' | 'section' | 'keywords' | 'excerpt')[];
}

/**
 * Search the index for matching entries
 */
/**
 * Strip HTML tags from text
 */
function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '');
}

export function searchIndex(
  index: SearchIndex,
  query: string,
  maxResults: number = 10
): SearchResult[] {
  const queryLower = query.toLowerCase().trim();
  
  if (!queryLower) return [];
  
  // Split query into terms for multi-word search
  const queryTerms = queryLower.split(/\s+/).filter(t => t.length >= 3); // Increased from 2 to 3 for stricter matching
  
  if (queryTerms.length === 0) return [];
  
  const results: SearchResult[] = [];
  
  for (const entry of index.entries) {
    let score = 0;
    const matchedFields: SearchResult['matchedFields'] = [];
    
    // Check title match (highest weight)
    const titleLower = entry.title.toLowerCase();
    if (titleLower.includes(queryLower)) {
      score += 100;
      matchedFields.push('title');
    } else if (queryTerms.some(term => titleLower.includes(term))) {
      score += 50;
      matchedFields.push('title');
    }
    
    // Check section match (high weight)
    if (entry.section) {
      const sectionLower = entry.section.toLowerCase();
      if (sectionLower.includes(queryLower)) {
        score += 80;
        matchedFields.push('section');
      } else if (queryTerms.some(term => sectionLower.includes(term))) {
        score += 40;
        matchedFields.push('section');
      }
    }
    
    // Check keywords match (medium weight)
    const matchedKeywords = entry.keywords.filter(kw => 
      queryTerms.some(term => kw.toLowerCase().includes(term) || term.includes(kw.toLowerCase()))
    );
    if (matchedKeywords.length > 0) {
      score += matchedKeywords.length * 10;
      matchedFields.push('keywords');
    }
    
    // Check excerpt match (lower weight) - strip HTML first
    const cleanExcerpt = stripHtml(entry.excerpt);
    const excerptLower = cleanExcerpt.toLowerCase();
    if (excerptLower.includes(queryLower)) {
      score += 20;
      matchedFields.push('excerpt');
    } else if (queryTerms.some(term => excerptLower.includes(term))) {
      score += 10;
      matchedFields.push('excerpt');
    }
    
    // Remove breadcrumb matching to prevent irrelevant results
    
    // Boost exact matches
    if (titleLower === queryLower || entry.section?.toLowerCase() === queryLower) {
      score += 200;
    }
    
    // Slight penalty for section entries (prefer document-level matches)
    if (entry.section && score > 0) {
      score *= 0.9;
    }
    
    if (score > 0) {
      results.push({
        ...entry,
        score,
        matchedFields,
      });
    }
  }
  
  // Sort by keyword match first, then by score descending, then by title for stable ordering
  results.sort((a, b) => {
    const aHasKeywords = a.matchedFields.includes('keywords');
    const bHasKeywords = b.matchedFields.includes('keywords');
    if (aHasKeywords !== bHasKeywords) {
      return aHasKeywords ? -1 : 1;
    }
    if (b.score !== a.score) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });
  
  // Deduplicate: if both doc and section match, show both but group them
  // For now, just return top results
  return results.slice(0, maxResults);
}

/**
 * Build the full URL for a search result
 */
export function getResultUrl(result: SearchIndexEntry, baseRoute: string = '/l4'): string {
  const base = `${baseRoute}/${result.slug}`.replace(/\/+/g, '/');
  if (result.anchor) {
    return `${base}#${result.anchor}`;
  }
  return base;
}

/**
 * Highlight matching terms in text
 */
export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
  if (terms.length === 0) return text;
  
  // Create a regex that matches any of the terms (case insensitive)
  const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}
