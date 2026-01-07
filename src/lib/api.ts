import { Post } from "@/interfaces/post";
import { Page } from "@/interfaces/page";
import { ExternalLink } from "@/interfaces/external-link";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");
const pagesDirectory = join(process.cwd(), "_pages");
const externalLinksDirectory = join(process.cwd(), "_external_links");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const slugs = getPostSlugs();
  const posts = slugs
    .filter((slug) => slug.endsWith('.md'))
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

// Pages API
export function getPageSlugs() {
  if (!fs.existsSync(pagesDirectory)) {
    return [];
  }
  return fs.readdirSync(pagesDirectory);
}

export function getPageBySlug(slug: string): Page | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(pagesDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content } as Page;
}

export function getAllPages(): Page[] {
  const slugs = getPageSlugs();
  const pages = slugs
    .filter((slug) => slug.endsWith('.md'))
    .map((slug) => getPageBySlug(slug))
    .filter((page): page is Page => page !== null);
  return pages;
}

export function getHeaderPages(): Page[] {
  return getAllPages()
    .filter((page) => page.showInHeader)
    .sort((a, b) => (a.headerOrder ?? 999) - (b.headerOrder ?? 999));
}

export function getFooterPages(column: "company" | "contact" | "legal"): Page[] {
  return getAllPages()
    .filter((page) => page.footerColumn === column)
    .sort((a, b) => (a.footerOrder ?? 999) - (b.footerOrder ?? 999));
}

// External Links API
export function getExternalLinkSlugs() {
  if (!fs.existsSync(externalLinksDirectory)) {
    return [];
  }
  return fs.readdirSync(externalLinksDirectory);
}

export function getExternalLinkBySlug(slug: string): ExternalLink | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(externalLinksDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);

  return { ...data, slug: realSlug } as ExternalLink;
}

export function getAllExternalLinks(): ExternalLink[] {
  const slugs = getExternalLinkSlugs();
  const links = slugs
    .filter((slug) => slug.endsWith('.md'))
    .map((slug) => getExternalLinkBySlug(slug))
    .filter((link): link is ExternalLink => link !== null);
  return links;
}

export function getFooterExternalLinks(column: "company" | "resources" | "contact"): ExternalLink[] {
  return getAllExternalLinks()
    .filter((link) => link.footerColumn === column)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
