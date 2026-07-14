import { defineArrayMember, defineField, defineType } from "sanity";

export const homeSettingsType = defineType({
  name: "homeSettings",
  title: "Home Settings",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "string" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "text", rows: 4 }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "sellingPoints",
      title: "Selling Points",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 })
          ]
        })
      ]
    }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA Link", type: "string" })
  ]
});

