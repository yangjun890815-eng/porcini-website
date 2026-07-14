import { defineArrayMember, defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })]
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      options: { list: ["A", "B", "C"] }
    }),
    defineField({ name: "size", title: "Size", type: "string" }),
    defineField({ name: "moistureContent", title: "Moisture Content", type: "string" }),
    defineField({ name: "packaging", title: "Packaging", type: "string" }),
    defineField({ name: "shelfLife", title: "Shelf Life", type: "string" }),
    defineField({ name: "moq", title: "MOQ", type: "string" }),
    defineField({ name: "leadTime", title: "Lead Time", type: "string" }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })]
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "mainImage"
    }
  }
});

