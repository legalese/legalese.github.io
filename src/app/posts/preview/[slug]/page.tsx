import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "../../../../lib/api";
import { CMS_NAME } from "../../../../lib/constants";
import markdownToHtml from "../../../../lib/markdownToHtml";
import Alert from "../../../_components/alert";
import Container from "../../../_components/container";
import Header from "../../../_components/header";
import { PostBody } from "../../../_components/post-body";
import { PostHeader } from "../../../_components/post-header";

export default async function PreviewPost({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Alert preview={true} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const title = `PREVIEW ${post.title} | ${CMS_NAME}`;

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

// Generate static paths for all posts (including unpublished ones)
export async function generateStaticParams() {
  const fs = require('fs');
  const { join } = require('path');
  const postsDirectory = join(process.cwd(), "_posts");
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const slugs = fs.readdirSync(postsDirectory);
  
  return slugs
    .filter((slug: string) => slug.endsWith('.md'))
    .map((slug: string) => ({
      slug: slug.replace(/\.md$/, ''),
    }));
}
