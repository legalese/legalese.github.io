import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";
import Container from "../_components/container";
import Header from "../_components/header";
import { PageContent } from "../_components/page-content";
import { PageHeader } from "../_components/page-header";

export const metadata: Metadata = {
  title: "About Us | Legalese",
  description: "Software is eating law. Learn about Legalese and our mission to create L4, a domain-specific language for legal.",
};

export default async function AboutPage() {
  const page = getPageBySlug("about");

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
