import { HttpError } from './_components/http-error';
import Footer from './_components/footer';

export default function NotFound() {
  return <HttpError code={404} footer={<Footer />} />;
}
