import Link from "next/link";
import Image from "next/image";
import { CMS_NAME } from "@/lib/constants";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between py-8 mb-12">
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
        <Link href="/about" className="text-sm font-medium hover:text-pink-600 transition-colors font-merriweather">
          About us
        </Link>
        <Link href="/team" className="text-sm font-medium hover:text-pink-600 transition-colors font-merriweather">
          Team
        </Link>
        <Link href="/community" className="text-sm font-medium hover:text-pink-600 transition-colors font-merriweather">
          Community
        </Link>
        <Link href="/posts" className="text-sm font-medium hover:text-pink-600 transition-colors font-merriweather">
          Blog
        </Link>
        <a 
          href="https://l4.legalese.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors font-merriweather"
        >
          L4 - rules-as-code →
        </a>
      </nav>
    </header>
  );
};

export default Header;
