import { HttpError } from '../_components/http-error';

export default async function HttpErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code: codeParam } = await searchParams;
  const code = codeParam ? parseInt(codeParam, 10) : 500;

  return <HttpError code={code} />;
}
