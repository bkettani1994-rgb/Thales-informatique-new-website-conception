"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Building2,
  ShieldCheck,
  Calendar,
  ClipboardCheck,
  Cog,
  Receipt,
  Play,
  X,
  Loader2,
  Award,
  Trophy,
} from "lucide-react";
import { faqs } from "./data";

// Footer réel du site, chargé à la demande (bas de page) pour alléger le JS initial.
const Footer = dynamic(() => import("@/components/ui/Footer"));

/* ─────────────────────────────────────────────────────────
   Tracking — même helper que le reste du site (GA4 via gtag)
   + conversion LinkedIn Insight Tag sur la page de remerciement.
───────────────────────────────────────────────────────── */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
  }
}

function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }
}

/* ─────────────────────────────────────────────────────────
   État partagé — valeurs du simulateur, pour les transmettre
   au formulaire sans re-saisie.
───────────────────────────────────────────────────────── */

type FormFields = {
  nom: string;
  fonction: string;
  entreprise: string;
  email: string;
  telephone: string;
  erp: string;
  consentement: boolean;
  website: string; // honeypot
};

const EMAIL_FREE_DOMAINS = ["gmail.com", "hotmail.com", "hotmail.fr", "yahoo.com", "yahoo.fr", "outlook.com", "outlook.fr", "live.com", "icloud.com"];

function isProEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return !EMAIL_FREE_DOMAINS.includes(domain);
}

function isMoroccanPhone(phone: string) {
  const clean = phone.replace(/[\s.-]/g, "");
  return /^(0[5-7]\d{8}|\+212[5-7]\d{8})$/.test(clean);
}

type RasTvaContextValue = {
  form: FormFields;
  setField: <K extends keyof FormFields>(key: K, value: FormFields[K]) => void;
  loading: boolean;
  errorMsg: string;
  handleSubmit: (e: React.FormEvent) => void;
  scrollToForm: (origin: string) => void;
  montantSimule: number;
  setMontantSimule: (n: number) => void;
  retenueAnnuelleSimulee: number;
  setRetenueAnnuelleSimulee: (n: number) => void;
};

const RasTvaContext = createContext<RasTvaContextValue | null>(null);

function useRasTva() {
  const ctx = useContext(RasTvaContext);
  if (!ctx) throw new Error("useRasTva must be used within RasTvaProvider");
  return ctx;
}

function getUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
  };
}

/* ─────────────────────────────────────────────────────────
   Composants utilitaires
───────────────────────────────────────────────────────── */

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function formatDH(n: number) {
  const rounded = Math.round(n);
  const grouped = rounded.toLocaleString("fr-FR").replace(/[  ]/g, " ");
  return `${grouped} DH`;
}


/* ─────────────────────────────────────────────────────────
   Modale vidéo accessible (démo 45s)
───────────────────────────────────────────────────────── */

// [À VALIDER : URL de la vidéo de démo 45s]
const DEMO_VIDEO_ID = "";

function VideoModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], iframe, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label="Démo du module RAS TVA"
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-md" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-primary"
          onClick={(e) => e.stopPropagation()}
        >
          {DEMO_VIDEO_ID ? (
            <iframe
              src={`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?autoplay=1&rel=0`}
              title="Démo du module RAS TVA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/60">
              <Play size={32} aria-hidden="true" />
              <p className="text-sm font-medium">Vidéo de démo à intégrer [À VALIDER : URL vidéo]</p>
            </div>
          )}
        </motion.div>
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 cursor-pointer z-10"
          aria-label="Fermer la vidéo"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 1 — Hero
───────────────────────────────────────────────────────── */

function Hero() {
  const { scrollToForm } = useRasTva();

  return (
    <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 bg-bg" id="hero">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block text-[11px] font-bold text-cta uppercase tracking-widest mb-4">
          DAF · RAF · COMPTABLES
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-5">
          La RAS TVA, calculée automatiquement. <span className="text-ras">Sans aucune saisie.</span>
        </h1>
        <p className="text-lg text-secondary leading-relaxed mb-3 max-w-xl mx-auto">
          Intégrée à votre logiciel de gestion, la retenue se calcule à chaque facture. Votre équipe ne saisit rien de plus.
        </p>
        <button
          onClick={() => scrollToForm("hero")}
          className="inline-flex items-center gap-2 bg-ras text-white font-bold px-7 py-4 rounded-xl hover:bg-ras-dark transition-colors duration-200 cursor-pointer"
        >
          Réserver mon diagnostic gratuit <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   « Ce que vous ne ferez plus » — la preuve par métier
───────────────────────────────────────────────────────── */

const noMoreTasksColumns = [
  {
    role: "Vous êtes DAF",
    tasks: [
      "Vous demander si l'équipe applique le bon calcul",
      "Ajouter une nouvelle contrainte au planning de l'équipe",
      "Gérer un outil de plus",
    ],
  },
  {
    role: "Vous êtes RAF",
    tasks: [
      "Tenir un fichier Excel de suivi à côté",
      "Contrôler les montants ressaisis",
    ],
  },
  {
    role: "Vous êtes comptable",
    tasks: [
      "Calculer la retenue à la main",
      "Ressaisir le montant dans la comptabilité",
      "Vérifier le net à payer à la calculatrice",
    ],
  },
];

function NoMoreTasksSection() {
  return (
    <section className="py-16 lg:py-20 bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">
            « Ce que vous ne ferez plus » — la preuve par métier
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5">
          {noMoreTasksColumns.map((col, i) => (
            <FadeIn key={col.role} delay={i * 0.08}>
              <div className="bg-white rounded-2xl border border-slate-200 h-full overflow-hidden">
                <p className="text-sm font-bold text-primary bg-bg border-b border-slate-200 px-5 py-3">{col.role}</p>
                <ul className="px-5 py-4 space-y-3">
                  {col.tasks.map((t) => (
                    <li key={t} className="text-sm text-secondary line-through decoration-signal decoration-2">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 2 — Le problème en clair
───────────────────────────────────────────────────────── */

const problemCards = [
  {
    icon: Building2,
    title: "12 000 DH facturés, 10 500 DH encaissés",
    desc: "Votre client garde une partie de la TVA et la verse directement à la DGI.",
  },
  {
    icon: ShieldCheck,
    title: "75 % ou 100 %",
    desc: "Le taux dépend de l'attestation fiscale du fournisseur, qui doit avoir moins de 6 mois.",
  },
  {
    icon: Calendar,
    title: "Déclaration chaque mois",
    desc: "La TVA retenue se reverse le mois suivant, avec un relevé détaillé.",
  },
];

function ProblemSection() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">Ce que la RAS TVA change pour vous</h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5">
          {problemCards.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.08}>
              <div className="bg-bg rounded-2xl border border-slate-200 p-6 h-full">
                <span className="w-11 h-11 rounded-xl bg-cta/10 flex items-center justify-center mb-4">
                  <c.icon size={20} className="text-cta" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-bold text-primary mb-1.5">{c.title}</h3>
                <p className="text-xs text-secondary leading-relaxed">{c.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 3 — Le simulateur
───────────────────────────────────────────────────────── */

function SimulatorSection() {
  const { setMontantSimule, setRetenueAnnuelleSimulee, scrollToForm } = useRasTva();
  const [montantHT, setMontantHT] = useState(1_000_000);
  const [avecAttestation, setAvecAttestation] = useState(true);
  const usedOnce = useRef(false);

  const taux = avecAttestation ? 0.75 : 1;
  const retenueMensuelle = montantHT * 0.2 * taux;
  const retenueAnnuelle = retenueMensuelle * 12;

  useEffect(() => {
    setMontantSimule(montantHT);
    setRetenueAnnuelleSimulee(Math.round(retenueAnnuelle));
  }, [montantHT, retenueAnnuelle, setMontantSimule, setRetenueAnnuelleSimulee]);

  const markUsed = () => {
    if (!usedOnce.current) {
      usedOnce.current = true;
      track("simulator_used");
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-bg" id="simulateur">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">Combien la RAS TVA retient-elle sur votre trésorerie ?</h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
            <label htmlFor="montant-ht" className="text-sm font-bold text-primary block mb-2">
              Montant HT concerné par mois (DH)
            </label>
            <input
              id="montant-ht"
              type="number"
              min={0}
              step={1000}
              value={montantHT}
              onChange={(e) => {
                setMontantHT(Math.max(0, Number(e.target.value) || 0));
                markUsed();
              }}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-primary focus:border-cta focus:ring-1 focus:ring-cta outline-none mb-5"
            />

            <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 mb-6">
              <span className="text-sm font-semibold text-primary">
                {avecAttestation ? "Avec attestation (75 %)" : "Sans attestation (100 %)"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={avecAttestation}
                aria-label="Avec ou sans attestation de régularité fiscale"
                onClick={() => {
                  setAvecAttestation((v) => !v);
                  markUsed();
                }}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${avecAttestation ? "bg-ras" : "bg-signal"}`}
              >
                <motion.span
                  animate={{ x: avecAttestation ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-0 w-5 h-5 rounded-full bg-white shadow"
                />
              </button>
            </div>

            <p aria-live="polite" className="text-center text-primary mb-1">
              <span className="block text-sm text-secondary mb-1">TVA retenue</span>
              <span className="text-2xl font-black">{formatDH(retenueMensuelle)}</span>
              <span className="text-sm text-secondary"> par mois, soit </span>
              <span className="text-2xl font-black text-ras-dark">{formatDH(retenueAnnuelle)}</span>
              <span className="text-sm text-secondary"> par an</span>
            </p>
            <p className="text-[11px] text-slate-400 text-center mb-6">Calcul indicatif au taux de 20 %.</p>

            <button
              onClick={() => scrollToForm("simulateur")}
              className="w-full inline-flex items-center justify-center gap-2 bg-ras text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-ras-dark transition-colors cursor-pointer"
            >
              Faire le point avec un consultant <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 4 — Comment ça marche
───────────────────────────────────────────────────────── */

const steps = [
  { num: "01", title: "Vous saisissez la facture", icon: ClipboardCheck },
  { num: "02", title: "Le module vérifie l'attestation", icon: ShieldCheck },
  { num: "03", title: "Il calcule la retenue et le net à payer", icon: Cog },
  { num: "04", title: "Il prépare le bordereau et le relevé", icon: Receipt },
] as const;

const erpBadges = ["Sage 100 · PME", "Sage X3 · ETI et grandes entreprises", "Sage FRP 1000 · Groupes et secteur public"];

function HowItWorksSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="py-16 lg:py-20 bg-white" id="comment-ca-marche">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-12">Votre Sage s&apos;occupe de tout</h2>
        </FadeIn>

        <div className="grid sm:grid-cols-4 gap-5 mb-12">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 0.06}>
              <div className="text-center">
                <span className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={20} className="text-cta" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-primary leading-snug">{s.title}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        {/* [À VALIDER : fonctionnalités réelles du module] */}

        <FadeIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            {erpBadges.map((b) => (
              <span key={b} className="text-xs font-semibold text-secondary bg-bg border border-slate-200 rounded-full px-4 py-2">
                {b}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="text-center">
            <button
              onClick={() => {
                setVideoOpen(true);
                track("demo_video_open");
              }}
              className="inline-flex items-center gap-2 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
            >
              <Play size={14} aria-hidden="true" /> Voir la démo en 45 secondes
            </button>
          </div>
        </FadeIn>
      </div>

      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 5 — Pourquoi Thalès Informatique
───────────────────────────────────────────────────────── */

const proofStats = [
  { value: "30 ans", label: "d'expertise Sage" },
  { value: "3", label: "ERP couverts" },
  { value: "30 min", label: "de diagnostic offert" },
];

function WhySection() {
  return (
    <section className="py-16 lg:py-20 bg-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-10">Pourquoi Thalès Informatique</h2>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {proofStats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-black text-primary">{s.value}</p>
                <p className="text-[11px] text-secondary font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-xs font-semibold text-secondary">
            <span className="flex items-center gap-1.5"><Trophy size={14} className="text-cta" aria-hidden="true" /> Meilleure Dynamique Commerciale Sage Maroc 2024</span>
            <span className="flex items-center gap-1.5"><Award size={14} className="text-cta" aria-hidden="true" /> Premier Partenaire North Africa 2017</span>
          </div>
        </FadeIn>

        {/* [À VALIDER : témoignage client] */}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 6 — Formulaire + FAQ
───────────────────────────────────────────────────────── */

function DiagnosticForm({ id }: { id?: string }) {
  const { form, setField, loading, errorMsg, handleSubmit } = useRasTva();

  return (
    <div id={id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
      <h3 className="text-lg font-bold text-primary mb-1">Votre diagnostic RAS TVA, offert</h3>
      <p className="text-secondary text-sm mb-5 leading-relaxed">30 minutes avec un consultant Sage. Gratuit, sans engagement.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="website">Site web</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setField("website", e.target.value)} />
        </div>

        <input
          type="text" placeholder="Prénom et nom *" required value={form.nom}
          onChange={(e) => setField("nom", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none"
        />
        <select
          aria-label="Votre fonction"
          required value={form.fonction} onChange={(e) => setField("fonction", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-cta focus:ring-1 focus:ring-cta outline-none"
        >
          <option value="">Votre fonction *</option>
          {["DAF / RAF", "Chef comptable", "Comptable", "DG", "DSI", "Autre"].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <input
          type="text" placeholder="Entreprise *" required value={form.entreprise}
          onChange={(e) => setField("entreprise", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none"
        />
        <input
          type="email" placeholder="Email professionnel *" required value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none"
        />
        <input
          type="tel" placeholder="Téléphone (06, 07, 05 ou +212) *" required value={form.telephone}
          onChange={(e) => setField("telephone", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none"
        />
        <select
          aria-label="Votre ERP"
          required value={form.erp} onChange={(e) => setField("erp", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-cta focus:ring-1 focus:ring-cta outline-none"
        >
          <option value="">Votre ERP *</option>
          {["Sage 100", "Sage X3", "Sage FRP 1000", "Autre"].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox" required checked={form.consentement}
            onChange={(e) => setField("consentement", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-cta focus:ring-cta focus:ring-1 cursor-pointer"
          />
          <span className="text-xs text-secondary leading-relaxed">
            J&apos;accepte que Thalès Informatique utilise ces informations pour me recontacter, conformément à la loi 09-08. Voir la{" "}
            <Link href="/politique-de-confidentialite" className="text-cta underline">politique de confidentialité</Link>.
          </span>
        </label>

        {errorMsg && (
          <p role="alert" className="text-xs text-signal-dark bg-signal/10 border border-signal/30 rounded-lg px-3 py-2">
            {errorMsg}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-ras text-white font-bold px-6 py-3.5 rounded-xl hover:bg-ras-dark transition-colors duration-200 disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {loading ? "Envoi en cours..." : "Je réserve mon diagnostic"}
        </button>
      </form>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <h3>
        <button onClick={onToggle} aria-expanded={open} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer">
          <span className="font-semibold text-primary text-sm">{q}</span>
          <ChevronDown size={18} className={`text-cta shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </h3>
      {open && (
        <div className="px-5 pb-4 text-sm text-secondary leading-relaxed">
          {a.split(/(\[À VALIDER[^\]]*\])/g).map((part, i) =>
            part.startsWith("[À VALIDER") ? <span key={i} className="text-signal-dark font-medium">{part}</span> : <span key={i}>{part}</span>
          )}
        </div>
      )}
    </div>
  );
}

function FormFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-20 bg-white" id="formulaire-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <FadeIn>
            <DiagnosticForm id="formulaire-final" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-xl font-bold text-primary mb-5">Questions fréquentes</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <FaqItem
                  key={f.q} q={f.q} a={f.a} open={openIndex === i}
                  onToggle={() => {
                    const next = openIndex === i ? null : i;
                    setOpenIndex(next);
                    if (next !== null) track("faq_interaction", { question: f.q });
                  }}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Barre mobile fixe
───────────────────────────────────────────────────────── */

function MobileStickyBar() {
  const { scrollToForm } = useRasTva();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("formulaire-final");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
        formVisible ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <button
        onClick={() => scrollToForm("sticky-mobile")}
        className="w-full inline-flex items-center justify-center gap-2 bg-ras text-white font-bold py-3 rounded-xl cursor-pointer"
      >
        Réserver mon diagnostic
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────── */

export default function RasTvaClient() {
  const router = useRouter();

  const [form, setForm] = useState<FormFields>({
    nom: "", fonction: "", entreprise: "", email: "", telephone: "", erp: "", consentement: false, website: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [montantSimule, setMontantSimule] = useState(1_000_000);
  const [retenueAnnuelleSimulee, setRetenueAnnuelleSimulee] = useState(1_800_000);
  const prefersReducedMotion = useReducedMotion();

  const setField = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const scrollToForm = (origin: string) => {
    track("cta_click", { origin });
    document.getElementById("formulaire-final")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.website) return; // honeypot rempli → bot
    if (!isProEmail(form.email)) {
      setErrorMsg("Merci d'indiquer votre email professionnel.");
      return;
    }
    if (!isMoroccanPhone(form.telephone)) {
      setErrorMsg("Merci d'indiquer un numéro marocain valide (06, 07, 05 ou +212).");
      return;
    }
    if (!form.consentement) {
      setErrorMsg("Merci d'accepter d'être recontacté·e pour continuer.");
      return;
    }

    setLoading(true);
    const utm = getUtmParams();
    const payload = {
      ...form,
      montant_simule: montantSimule,
      retenue_annuelle_simulee: retenueAnnuelleSimulee,
      ...utm,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      horodatage: new Date().toISOString(),
      source: "landing-ras-tva",
    };

    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_RASTVA_LEADS_URL!, { method: "POST", body: JSON.stringify(payload) });
      setLoading(false);
      router.push("/lp/ras-tva/merci");
    } catch (_) {
      setLoading(false);
      setErrorMsg("La connexion a été interrompue. Vos informations sont conservées — réessayez dans un instant.");
    }
  };

  const ctxValue: RasTvaContextValue = {
    form, setField, loading, errorMsg, handleSubmit, scrollToForm,
    montantSimule, setMontantSimule, retenueAnnuelleSimulee, setRetenueAnnuelleSimulee,
  };

  return (
    <RasTvaContext.Provider value={ctxValue}>
      <main className="overflow-x-hidden bg-bg pb-20 lg:pb-0">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" aria-label="Thalès Informatique" className="flex items-center">
              <img
                src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png"
                alt="Thalès Informatique"
                width={149}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => scrollToForm("header")}
              className="inline-flex items-center gap-1.5 bg-ras text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-ras-dark transition-colors cursor-pointer"
            >
              Réserver mon diagnostic <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </header>

        <Hero />
        <NoMoreTasksSection />
        <ProblemSection />
        <SimulatorSection />
        <HowItWorksSection />
        <WhySection />
        <FormFaqSection />
        <Footer />
      </main>

      <MobileStickyBar />
    </RasTvaContext.Provider>
  );
}
