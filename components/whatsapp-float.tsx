import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/8613800000000"
      target="_blank"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
    </Link>
  );
}

