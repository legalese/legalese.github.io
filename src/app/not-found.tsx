import Link from 'next/link';
import Image from 'next/image';
import { CMS_NAME } from '@/lib/constants';
import Footer from './_components/footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-5 flex-1 flex flex-col">
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
        </header>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6 py-16">
            <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-merriweather">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
