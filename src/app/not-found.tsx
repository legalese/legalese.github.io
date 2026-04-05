import { HttpError } from './_components/http-error';

export default function NotFound() {
  return <HttpError code={404} />;
}
