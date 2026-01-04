import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";
import Container from "../_components/container";
import Header from "../_components/header";
import { PageContent } from "../_components/page-content";
import { PageHeader } from "../_components/page-header";

export const metadata: Metadata = {
  title: "Privacy & Cookies Policy | Legalese",
  description: "Privacy and Cookies Policy for Legalese products and services.",
};

export default async function PrivacyPage() {
  const page = getPageBySlug("privacy");

  if (!page) {
    return notFound();
  }

  const content = await markdownToHtml(page.content || "");

  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32">
          <PageHeader 
            title={page.title} 
            lastModified={page.lastModified}
            effectiveDate={page.effectiveDate}
          />
          <PageContent content={content} />
        </article>
      </Container>
    </main>
  );
}
