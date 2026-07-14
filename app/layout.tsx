import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `Premium Dried Porcini Mushrooms Supplier | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    title: `Premium Dried Porcini Mushrooms Supplier | ${siteConfig.name}`,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `Premium Dried Porcini Mushrooms Supplier | ${siteConfig.name}`,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-brand-cream/30">
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </div>
      </body>
    </html>
  );
}
