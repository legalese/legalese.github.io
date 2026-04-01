'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { HttpError } from '../_components/http-error';

function HttpErrorContent({ footer }: { footer?: ReactNode }) {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');
  const code = codeParam ? parseInt(codeParam, 10) : 500;

  return <HttpError code={code} footer={footer} />;
}

export function HttpErrorClient({ footer }: { footer?: ReactNode }) {
  return (
    <Suspense fallback={<HttpError code={500} footer={footer} />}>
      <HttpErrorContent footer={footer} />
    </Suspense>
  );
}
