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

// [À VALIDER : ID de conversion LinkedIn dédié à la campagne RAS TVA]
const LINKEDIN_CONVERSION_ID = "";

export default function MerciClient() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("form_submit", { campaign: "landing-ras-tva" });
    if (typeof window !== "undefined" && window.lintrk && LINKEDIN_CONVERSION_ID) {
      window.lintrk("track", { conversion_id: LINKEDIN_CONVERSION_ID });
    }
  }, []);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-ras/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={28} className="text-ras" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">C&apos;est noté.</h1>
        <p className="text-secondary leading-relaxed mb-8">
          Un consultant Thalès Informatique vous rappelle sous 24 heures ouvrées.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors"
        >
          Retour à l&apos;accueil <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
