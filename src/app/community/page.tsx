import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";
import Container from "../_components/container";
import Header from "../_components/header";
import { PageContent } from "../_components/page-content";
import { PageHeader } from "../_components/page-header";

export const metadata: Metadata = {
  title: "Community & Contact | Legalese",
  description: "Join the Legalese community. Get support, engage with the team, and contribute to computational law.",
};

export default async function CommunityPage() {
  const page = getPageBySlug("community");

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
