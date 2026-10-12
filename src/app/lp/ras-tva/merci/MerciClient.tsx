"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Download, Play, MessageCircle } from "lucide-react";

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
// [À VALIDER : lien Calendly ou Google Agenda du consultant]
const CALENDAR_URL = "";
// [À VALIDER : fichier PDF de la check-list des 10 contrôles]
const CHECKLIST_PDF_URL = "";

/** Tampon "R.A.S., {Prénom}" — même composant visuel que la page principale, simplifié ici. */
function RasStampPersonalized({ prenom }: { prenom: string }) {
  const reduced = useReducedMotion();
  const label = prenom ? `R.A.S., ${prenom}` : "R.A.S.";
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 2.2 }}
      animate={reduced ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [2.2, 0.9, 1.05, 1], rotate: [-8, -8, -6, -8] }}
      transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.55, 0.8, 1] }}
      className="mx-auto"
      style={{ width: 180, height: 180 }}
    >
      <svg viewBox="0 0 220 180" width={180} height={160} role="img" aria-label={label}>
        <path
          d="M30 30 C 20 46, 26 66, 18 90 C 12 112, 28 128, 20 150 C 16 168, 40 174, 64 170 C 90 178, 116 172, 142 176 C 166 180, 196 170, 190 148 C 198 128, 186 110, 196 88 C 202 68, 188 48, 194 30 C 198 12, 174 20, 150 14 C 124 8, 100 16, 74 10 C 50 6, 40 16, 30 30 Z"
          fill="none"
          stroke="var(--color-ras)"
          strokeWidth="6"
        />
        <text
          x="110"
          y="90"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-sans)"
          fontWeight={800}
          fontSize={label.length > 10 ? Math.max(13, 24 - (label.length - 10) * 1.1) : prenom ? 24 : 34}
          letterSpacing="1"
          fill="var(--color-ras)"
        >
          {label}
        </text>
      </svg>
    </motion.div>
  );
}

function MerciContent() {
  const searchParams = useSearchParams();
  const prenomRaw = searchParams.get("prenom") || "";
  // Nettoyage défensif (lettres/espaces/tirets uniquement) — en plus de l'échappement automatique de React en JSX.
  const prenom = prenomRaw.replace(/[^\p{L}\s-]/gu, "").slice(0, 40);

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
      <div className="max-w-lg w-full text-center">
        <RasStampPersonalized prenom={prenom} />

        <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-4 mb-4 leading-snug">
          C&apos;est noté. Côté RAS TVA, ce sera bientôt « rien à signaler ».
        </h1>
        <p className="text-secondary leading-relaxed mb-8">
          Un consultant Thalès Informatique vous rappelle sous 24 heures ouvrées. Vous pouvez aussi choisir votre créneau dès maintenant :
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          {CALENDAR_URL ? (
            <iframe src={CALENDAR_URL} title="Prendre rendez-vous" className="w-full h-[480px] border-0 rounded-xl" />
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              <Calendar size={26} className="text-cta" aria-hidden="true" />
              <p className="text-sm text-secondary">Agenda en ligne à intégrer [À VALIDER : lien Calendly ou Google Agenda]</p>
              <a
                href="tel:+212522548780"
                className="inline-flex items-center gap-2 bg-cta text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Nous appeler directement <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <a
            href={CHECKLIST_PDF_URL || "#"}
            onClick={(e) => { if (!CHECKLIST_PDF_URL) e.preventDefault(); }}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 text-primary font-semibold text-sm px-5 py-3 rounded-xl hover:border-cta/40 hover:bg-blue-50 transition-colors"
          >
            <Download size={15} aria-hidden="true" /> Télécharger la check-list
          </a>
          <Link
            href="/lp/ras-tva#choisissez-votre-sage"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 text-primary font-semibold text-sm px-5 py-3 rounded-xl hover:border-cta/40 hover:bg-blue-50 transition-colors"
          >
            <Play size={15} aria-hidden="true" /> Voir la démo de votre ERP
          </Link>
        </div>

        <a
          href="https://wa.me/212661168354?text=Bonjour%2C%20je%20viens%20de%20demander%20un%20diagnostic%20RAS%20TVA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary text-sm font-medium transition-colors"
        >
          <MessageCircle size={16} aria-hidden="true" /> Une question ? Écrivez-nous sur WhatsApp
        </a>
      </div>
    </main>
  );
}

export default function MerciClient() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-bg" />}>
      <MerciContent />
    </Suspense>
  );
}
