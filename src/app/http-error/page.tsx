import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CMS_NAME } from '@/lib/constants';
import Footer from '../_components/footer';
import { ErrorContent } from './error-content';

export const metadata: Metadata = {
  other: {
    error_code: '404',
  },
};

export default function HttpErrorPage() {
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
          <ErrorContent />
        </div>
      </div>

      <Footer />
    </div>
  );
}
