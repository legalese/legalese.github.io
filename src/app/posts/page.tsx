import { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { Posts } from "@/app/_components/posts";
import { getAllPosts } from "../../lib/api";

export const metadata: Metadata = {
  title: "Blog | Legalese",
  description: "Updates, insights, and news from the Legalese team about computational law, L4, and legal technology.",
};

export default function BlogIndex() {
  const allPosts = getAllPosts();

  return (
    <main>
      <Container>
        <Header />
        <Suspense
          fallback={
            <div className="max-w-6xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none">
                Blog
              </h1>
            </div>
          }
        >
          <Posts allPosts={allPosts} />
        </Suspense>
      </Container>
    </main>
  );
}
