import Container from "@/app/_components/container";
import { CMS_NAME } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              <p className="text-gray-500 text-sm">
                Legalese Pte. Ltd.<br />
                Singapore
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/media" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Press & Media
                  </Link>
                </li>
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
                <li>
                  <a 
                    href="https://l4.legalese.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    L4 Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="https://jl4.legalese.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    L4 Web IDE
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/smucclaw/l4-ide" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Community & Legal */}
            <div>
              <h4 className="font-bold mb-4 text-gray-300">Community</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/community" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/legalese" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <Link href="/code-of-conduct" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Code of Conduct
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Legalese Pte. Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-sm">
                Terms of Use
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-sm">
                Privacy & Cookies
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
