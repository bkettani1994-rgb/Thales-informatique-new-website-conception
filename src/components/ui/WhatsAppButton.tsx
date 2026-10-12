"use client";

import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/212661168354"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp"
      onClick={() => trackEvent("whatsapp_click", { location: "floating_button" })}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-[300] w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] shadow-lg flex items-center justify-center"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 0C7.166 0 0 7.166 0 16.004c0 2.82.736 5.587 2.135 8.013L.057 31.91a.6.6 0 0 0 .735.735l7.964-2.073a15.93 15.93 0 0 0 7.248 1.766c8.838 0 16.004-7.166 16.004-16.004S24.842 0 16.004 0Zm0 29.27a13.2 13.2 0 0 1-6.738-1.86l-.484-.288-4.99 1.299 1.327-4.86-.317-.5a13.227 13.227 0 0 1-2.06-7.058c0-7.318 5.953-13.27 13.262-13.27 7.318 0 13.27 5.952 13.27 13.27 0 7.318-5.952 13.267-13.27 13.267Zm7.275-9.94c-.397-.199-2.353-1.16-2.718-1.292-.364-.133-.63-.199-.895.199-.265.397-1.027 1.292-1.26 1.557-.232.265-.464.298-.86.099-2.327-1.165-3.852-2.077-5.385-4.708-.407-.7.407-.651 1.165-2.164.133-.265.066-.497-.066-.696-.133-.199-.997-2.394-1.36-3.193-.357-.78-.722-.674-.997-.687-.265-.013-.564-.013-.86-.013s-.795.099-1.226.497c-.43.397-1.65 1.616-1.65 3.94 0 2.327 1.683 4.576 1.915 4.89.232.299 3.245 4.948 7.86 6.74 1.005.39 1.79.625 2.402.799.857.243 1.638.21 2.255.127.688-.103 2.353-.963 2.685-1.892.331-.93.331-1.726.232-1.892-.099-.166-.364-.265-.762-.464Z" />
      </svg>
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </motion.a>
  );
}
