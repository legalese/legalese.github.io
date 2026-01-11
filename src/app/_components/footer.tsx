import Container from "@/app/_components/container";
import { CMS_NAME } from "@/lib/constants";
import { getFooterPages, getFooterExternalLinks } from "@/lib/api";
import Link from "next/link";
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Get pages by footer column
  const companyPages = getFooterPages("company");
  const contactPages = getFooterPages("contact");
  const legalPages = getFooterPages("legal");
  
  // Get external links by column
  const companyExternalLinks = getFooterExternalLinks("company");
  const resourcesExternalLinks = getFooterExternalLinks("resources");
  const contactExternalLinks = getFooterExternalLinks("contact");

  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center">
                <Image
                  src="/assets/logos/legalese-logo.png"
                  alt="§"
                  width={36}
                  height={36}
                    className="rounded invert"
                />
                <h3 className="text-2xl font-bold tracking-tight ml-1">{CMS_NAME}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Software is eating law.
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Company</h4>
              <ul className="space-y-2">
                {companyPages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/${page.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {page.navTitle || page.title}
                    </Link>
                  </li>
                ))}
                {companyExternalLinks.map((link) => (
                  <li key={link.slug}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/posts" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Resources</h4>
              <ul className="space-y-2">
                {resourcesExternalLinks.map((link) => (
                  <li key={link.slug}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Contact</h4>
              <ul className="space-y-2">
                {contactPages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/${page.slug}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {page.navTitle || page.title}
                    </Link>
                  </li>
                ))}
                {contactExternalLinks.map((link) => (
                  <li key={link.slug}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Legalese Pte. Ltd., Singapore. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legalPages.map((page) => (
                <Link 
                  key={page.slug}
                  href={`/${page.slug}`} 
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  {page.navTitle || page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
