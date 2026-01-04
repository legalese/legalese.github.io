import { Metadata } from "next";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { HeroPost } from "@/app/_components/hero-post";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "../../lib/api";

export const metadata: Metadata = {
  title: "Blog | Legalese",
  description: "Updates, insights, and news from the Legalese team about computational law, L4, and legal technology.",
};

export default function BlogIndex() {
  const allPosts = getAllPosts();

  if (allPosts.length === 0) {
    return (
      <main>
        <Container>
          <Header />
          <div className="max-w-4xl mx-auto mb-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-8">
              Blog
            </h1>
            <p className="text-xl text-gray-600">
              No posts yet. Check back soon for updates from the Legalese team.
            </p>
          </div>
        </Container>
      </main>
    );
  }

  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Header />
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none">
            Blog
          </h1>
        </div>
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
}
