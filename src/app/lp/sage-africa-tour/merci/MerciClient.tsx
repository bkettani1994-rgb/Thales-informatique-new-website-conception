"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CalendarCheck2, ArrowRight, Calendar, MapPin } from "lucide-react";

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

export default function MerciClient() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("generate_lead", { campaign: "sage-africa-tour" });
    if (typeof window !== "undefined" && window.lintrk) {
      window.lintrk("track", { conversion_id: "sage_africa_tour_inscription" });
    }
  }, []);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-cta/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CalendarCheck2 size={28} className="text-cta" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Votre inscription est confirmée.</h1>
        <p className="text-secondary leading-relaxed mb-6">
          Un appel de confirmation vous sera passé par notre équipe. On vous attend au Sage Africa Tour !
        </p>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 text-left space-y-2">
          <p className="flex items-center gap-2 text-sm text-secondary">
            <Calendar size={15} className="text-cta shrink-0" aria-hidden="true" /> Mardi 08 décembre 2026, 14h30 – 18h00
          </p>
          <p className="flex items-center gap-2 text-sm text-secondary">
            <MapPin size={15} className="text-cta shrink-0" aria-hidden="true" /> Le Carré d&apos;Or, Casablanca
          </p>
        </div>
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
