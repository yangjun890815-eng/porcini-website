import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionCta } from "@/components/section-cta";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 120;

export async function generateStaticParams() {
  return getPostSlugs();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: `Article Not Found | ${siteConfig.name}`
    };
  }

  return {
    title: post.seoTitle || `${post.title} | ${siteConfig.name}`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || `${post.title} | ${siteConfig.name}`,
      description: post.seoDescription || post.excerpt,
      type: "article",
      images: post.mainImage ? [post.mainImage] : [siteConfig.defaultOgImage]
    }
  };
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name
    },
    image: post.mainImage ? [post.mainImage] : [siteConfig.defaultOgImage],
    description: post.excerpt
  };

  return (
    <div className="section-space">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <div className="container-shell max-w-4xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-brand-brown/70 hover:text-brand-brown"
        >
          ← Back to blog
        </Link>
        <div className="mt-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-olive">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-brand-brown sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base text-brand-brown/70">By {post.author}</p>
        </div>
        <div className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-brand-sand shadow-soft">
            {post.mainImage ? (
              <Image src={post.mainImage} alt={post.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-brand-brown/55">
                Article image placeholder
              </div>
            )}
          </div>
        </div>
        <div className="rich-text mt-12 rounded-[2rem] border border-brand-stone bg-white p-8 shadow-soft">
          <PortableText value={post.body} />
        </div>
      </div>

      <SectionCta
        title="Need a supplier who understands buyer questions?"
        body="Use the inquiry form to ask about grades, sizes, packaging, certificates, and current export lead times."
        label="Send Inquiry"
        href="/contact"
      />
    </div>
  );
}
