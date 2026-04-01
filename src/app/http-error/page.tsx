import { HttpErrorClient } from './client';
import Footer from '../_components/footer';

export default function HttpErrorPage() {
  return <HttpErrorClient footer={<Footer />} />;
}
