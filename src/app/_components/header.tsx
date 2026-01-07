import Link from "next/link";
import Image from "next/image";
import { CMS_NAME } from "@/lib/constants";
import { getHeaderPages, getFooterExternalLinks } from "@/lib/api";

const Header = () => {
  const headerPages = getHeaderPages();
  const headerExternalLinks = getFooterExternalLinks("resources").slice(0, 1); // Get first resource link for header

  return (
    <header className="flex flex-col md:flex-row items-center justify-between py-8 mb-6">
      <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
        <Image
          src="/assets/logos/legalese-logo.png"
          alt="§"
          width={42}
          height={42}
          className="rounded"
        />
        <span className="text-2xl font-bold tracking-tight font-merriweather">{CMS_NAME}</span>
      </Link>
      <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
        {headerPages.map((page) => (
          <Link 
            key={page.slug}
            href={`/${page.slug}`} 
            className="text-sm font-medium hover:text-accent transition-colors font-merriweather"
          >
            {page.navTitle || page.title}
          </Link>
        ))}
        <Link href="/posts" className="text-sm font-medium hover:text-accent transition-colors font-merriweather">
          Blog
        </Link>
        {headerExternalLinks.map((link) => (
          <a 
            key={link.slug}
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors font-merriweather"
          >
            {link.title} →
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
