"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
  }
}

function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }
}

// [À VALIDER : ID de conversion LinkedIn — à renseigner uniquement si vous utilisez un suivi par
// événement plutôt qu'une règle de conversion basée sur l'URL /thank-you dans Campaign Manager]
const LINKEDIN_CONVERSION_ID = "";

export default function ThankYouClient() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // GA4
    trackEvent("generate_lead", { campaign: "landing-ras-tva", page: "thank-you" });

    // LinkedIn — le tag de base (Insight Tag) est déjà chargé sur tout le site via le layout
    // racine : il détecte automatiquement la visite de cette page pour une règle de conversion
    // basée sur l'URL (configurée dans Campaign Manager sur https://thales.ma/thank-you).
    // Cet appel supplémentaire n'est utile que si vous passez à un suivi par ID de conversion.
    if (typeof window !== "undefined" && typeof window.lintrk === "function" && LINKEDIN_CONVERSION_ID) {
      window.lintrk("track", { conversion_id: LINKEDIN_CONVERSION_ID });
    }
  }, []);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-cta/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={28} className="text-cta" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">C&apos;est noté.</h1>
        <p className="text-secondary leading-relaxed mb-8">
          Un consultant Thalès Informatique vous rappelle sous 24 heures ouvrées.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-cta-hover transition-colors"
        >
          Retour à l&apos;accueil <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
