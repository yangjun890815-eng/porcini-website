# Dried Porcini B2B Site

B2B foreign-trade website for dried porcini mushrooms built with Next.js App Router, Tailwind CSS, and Sanity Studio. The project includes CMS-driven products and blog content, a buyer-facing inquiry flow, and deployment-ready SEO foundations.

## Stack

- Next.js App Router
- Tailwind CSS
- Sanity Studio
- Airtable inquiry storage
- Resend email notifications

## Quick Start

1. Copy `.env.example` to `.env.local`
2. Install dependencies with `npm.cmd install`
3. Fill in the required environment variables
4. Start dev server with `npm.cmd run dev`

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000

AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=Inquiries
NOTIFICATION_EMAIL=you@example.com
RESEND_API_KEY=

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```

`RESEND_API_KEY` is optional. If it is missing, inquiries are still written to Airtable and the API responds with partial success.

## Airtable Table Checklist

Use an `Inquiries` table with the following fields:

| Field | Type | Notes |
|---|---|---|
| `Name` | Single line text | Required |
| `Email` | Email | Required |
| `Company` | Single line text | Optional |
| `Product` | Single line text | Optional, product name preferred |
| `Message` | Long text | Required |
| `Source` | Single line text | Fixed value: `website-contact-form` |
| `SubmittedAt` | Date and time | ISO timestamp |

## Deployment Guide

### Vercel

1. Import the repository into Vercel.
2. Add every variable from `.env.example` into the Vercel project settings.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Deploy and verify `/`, `/products`, `/contact`, `/blog`, `/studio`, `/robots.txt`, and `/sitemap.xml`.

### Sanity Studio

1. Create a Sanity project and dataset.
2. Copy the Sanity project ID and dataset name into `.env.local` and Vercel.
3. Open `/studio` locally or in deployment to manage products, company information, home settings, and blog posts.
4. Publish at least one `company`, one `homeSettings`, several `product`, and optional `post` documents to replace fallback data.

### Airtable and Resend

1. Create an Airtable base with an `Inquiries` table matching the checklist above.
2. Add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` to the environment.
3. Set `NOTIFICATION_EMAIL` to the inbox that should receive inquiry alerts.
4. Optionally add `RESEND_API_KEY` to enable notification emails after Airtable writes succeed.

## Current Features

- Home page with CMS-backed hero, selling points, featured products, and CTA
- Product listing and product detail pages with fallback data support
- About page with origin story, gallery, certificates, and quality workflow
- Blog listing and article detail pages with fallback article content
- Inquiry form with Airtable submission and optional Resend notification
- Sanity Studio route at `/studio`
- `robots.txt`, sitemap generation, and structured data on key pages
