"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    lintrk?: (...args: unknown[]) => void;
  }
}

export default function MerciClient() {
  // Déclenché une seule fois, au chargement de cette page de confirmation —
  // c'est la cible de la règle de conversion LinkedIn Ads (visite d'URL)
  // et l'évènement GA4 de conversion pour la campagne Sage 100.
  useEffect(() => {
    trackEvent("generate_lead", { campaign: "linkedin-sage100-decideurs" });
    if (typeof window !== "undefined" && window.lintrk) {
      window.lintrk("track", { conversion_id: "sage100_decideurs_demo_request" });
    }
  }, []);

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-slate-800 to-slate-900" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 text-center shadow-xl"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={28} className="text-emerald-600" aria-hidden="true" />
        </div>

        <span className="text-xs font-bold text-cta tracking-widest uppercase">Demande envoyée</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-2 mb-4">
          Merci, votre demande a bien été reçue !
        </h1>
        <p className="text-secondary leading-relaxed mb-8">
          Un consultant certifié Sage 100 de Thalès Informatique va étudier votre demande et vous contacter très prochainement pour organiser votre démonstration personnalisée.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors duration-200"
          >
            Retour à l&apos;accueil <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="tel:+212522548780"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 text-primary font-semibold px-6 py-3.5 rounded-xl hover:border-cta/40 hover:bg-blue-50 transition-colors duration-200"
          >
            <Phone size={16} aria-hidden="true" /> +212 5 22 54 87 80
          </a>
        </div>
      </motion.div>
    </main>
  );
}
