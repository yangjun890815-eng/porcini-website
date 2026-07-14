import { defineArrayMember, defineField, defineType } from "sanity";

export const companyType = defineType({
  name: "company",
  title: "Company Profile",
  type: "document",
  fields: [
    defineField({ name: "companyName", title: "Company Name", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4 }),
    defineField({
      name: "originRegions",
      title: "Origin Regions",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "factoryGallery",
      title: "Factory Gallery",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })]
    }),
    defineField({
      name: "certificates",
      title: "Certificates",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "qualitySteps",
      title: "Quality Steps",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "whatsApp", title: "WhatsApp", type: "string" }),
    defineField({ name: "wechat", title: "WeChat", type: "string" })
  ]
});

