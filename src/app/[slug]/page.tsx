import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPages, getPageBySlug } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";
import Container from "../_components/container";
import Header from "../_components/header";
import { PageContent } from "../_components/page-content";
import { PageHeader } from "../_components/page-header";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | Legalese",
    };
  }

  const description =
    page.description || `${page.title} - Legalese products and services.`;

  return {
    title: `${page.title} | Legalese`,
    description,
  };
}

export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function DynamicPage({ params }: Params) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return notFound();
  }

  const content = await markdownToHtml(page.content || "");

  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32">
          <PageHeader title={page.title} />
          <PageContent content={content} />
        </article>
      </Container>
    </main>
  );
}
