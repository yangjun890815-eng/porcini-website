import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/studio", label: "CMS" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-stone/70 bg-white/90 backdrop-blur">
      <div className="container-shell flex h-20 items-center justify-between gap-8">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Porcini Origin
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-brand-brown/80 hover:text-brand-brown"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-brand-olive px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-olive/90"
        >
          Request Quote
        </Link>
      </div>
    </header>
  );
}

