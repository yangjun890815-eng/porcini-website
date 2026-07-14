import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })]
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 3 }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author",
      media: "mainImage"
    }
  }
});

