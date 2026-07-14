import Image from "next/image";
import Link from "next/link";
import type { BlogPostCardData } from "@/lib/types";

export function BlogPostCard({ post }: { post: BlogPostCardData }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-brand-stone bg-white shadow-soft">
      <div className="relative aspect-[16/10] bg-brand-sand">
        {post.mainImage ? (
          <Image src={post.mainImage} alt={post.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-brown/55">
            Article image placeholder
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm text-brand-brown/60">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}{" "}
          · {post.author}
        </p>
        <h2 className="mt-3 text-2xl font-bold text-brand-brown">{post.title}</h2>
        <p className="mt-4 text-sm leading-7 text-brand-brown/75">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-cream px-3 py-1 text-xs font-medium text-brand-brown"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-6 inline-flex rounded-full border border-brand-brown/20 px-4 py-2 text-sm font-semibold text-brand-brown hover:border-brand-brown/40"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
}
