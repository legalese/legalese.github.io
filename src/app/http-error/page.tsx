'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { HttpError } from '../_components/http-error';

function HttpErrorContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');
  const code = codeParam ? parseInt(codeParam, 10) : 500;

  return <HttpError code={code} />;
}

export default function HttpErrorPage() {
  return (
    <Suspense fallback={<HttpError code={500} />}>
      <HttpErrorContent />
    </Suspense>
  );
}
