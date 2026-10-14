import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CMS_NAME } from '@/lib/constants';
import { ErrorContent } from './error-content';
import { SignInLink } from '../_components/sign-in-link';

export const metadata: Metadata = {
  other: {
    error_code: '404',
  },
};

export default function HttpErrorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Image
                src="/assets/logos/legalese-logo.png"
                alt={CMS_NAME}
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-lg font-bold tracking-tight font-merriweather">{CMS_NAME}</span>
            </Link>
            <SignInLink className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
              Sign in
            </SignInLink>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center pb-24">
        <ErrorContent />
      </div>
    </div>
  );
}
