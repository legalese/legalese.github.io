import { Metadata } from 'next';
import Script from 'next/script';
import './doc.css';
import HighlightInit from './_components/HighlightInit';
import OsDetect from './_components/OsDetect';

export const metadata: Metadata = {
  title: 'L4 Documentation',
  description: 'L4 Language Reference and Documentation - Rules as Code',
  openGraph: {
    title: 'L4 Documentation',
    description: 'L4 Language Reference and Documentation - Rules as Code',
    images: ['/opengraph/software-is-eating-law.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'L4 Documentation',
    description: 'L4 Language Reference and Documentation - Rules as Code',
    images: ['/opengraph/software-is-eating-law.jpg'],
  },
};

const hljsStyles = `
pre code.hljs{display:block;overflow-x:auto;padding:0.2rem 0.4rem;font-size:13px;color:#104e64;background:#fdfdfd}
code.hljs .hljs-keyword{color:#0000ff;font-weight:500}
code.hljs .hljs-literal{color:#0000ff}
code.hljs .hljs-built_in{color:#267f99}
code.hljs .hljs-string{color:#a31515}
code.hljs .hljs-number{color:#098658}
code.hljs .hljs-comment{color:#008000;font-style:italic}
code.hljs .hljs-title{color:#795e26;font-weight:600}
code.hljs .hljs-variable{color:#001080}
code.hljs .hljs-doctag{color:#ffbd33}
code.hljs .hljs-formula{color:#af00db;font-weight:500}
`;

export default function L4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" />
      <Script src="/hljs-l4/l4.min.js" />
      <HighlightInit />
      <OsDetect />
      <style dangerouslySetInnerHTML={{ __html: hljsStyles }} />
    </>
  );
}
