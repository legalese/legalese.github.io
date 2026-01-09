"use client";

import { useSearchParams } from "next/navigation";
import { HeroPost } from "@/app/_components/hero-post";
import { MoreStories } from "@/app/_components/more-stories";
import { Post } from "@/interfaces/post";

export function Posts({ allPosts }: { allPosts: Post[] }) {
  const searchParams = useSearchParams();
  const authorFilter = searchParams.get("author");

  // Filter posts by author if filter is provided
  const filteredPosts = authorFilter
    ? allPosts.filter((post) =>
        post.author.name.toLowerCase().includes(authorFilter.toLowerCase())
      )
    : allPosts;

  if (filteredPosts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mb-32">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-8">
          Blog
        </h1>
        {authorFilter ? (
          <div>
            <p className="text-xl text-gray-600 mb-4">
              No posts found by author:{" "}
              <span className="font-semibold">{authorFilter}</span>
            </p>
            <a
              href="/posts"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View all posts
            </a>
          </div>
        ) : (
          <p className="text-xl text-gray-600">
            No posts yet. Check back soon for updates from the Legalese team.
          </p>
        )}
      </div>
    );
  }

  const heroPost = filteredPosts[0];
  const morePosts = filteredPosts.slice(1);

  return (
    <>
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
          Blog
        </h1>
        {authorFilter && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Filtered by author:</span>
            <span className="font-semibold">{authorFilter}</span>
            <a
              href="/posts"
              className="text-accent hover:text-accent underline"
            >
              Clear filter
            </a>
          </div>
        )}
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
    </>
  );
}
