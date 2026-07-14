import type { Metadata } from "next";
import { BlogPostCard } from "@/components/blog-post-card";
import { getAllPosts } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "Buyer-focused articles on dried porcini grades, storage, sourcing, and wholesale purchasing considerations."
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="section-space">
      <div className="container-shell">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
            Blog
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-brand-brown sm:text-5xl">
            Insights for dried porcini buyers and importers
          </h1>
          <p className="mt-6 text-lg leading-8 text-brand-brown/80">
            Practical content for wholesalers, foodservice supply chains, and
            sourcing teams evaluating dried porcini formats, grades, packaging,
            and storage.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
