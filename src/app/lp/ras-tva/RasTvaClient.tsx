"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Building2,
  Landmark,
  ShieldCheck,
  Users,
  Sparkles,
  Loader2,
  MessageCircle,
  Check,
  Fuel,
  FileWarning,
  Receipt,
  Calendar,
  HelpCircle,
  X,
  Play,
  ChevronsLeftRight,
  ClipboardCheck,
  Server,
  Cog,
  Network,
  Layers,
  Quote,
} from "lucide-react";
import dynamic from "next/dynamic";

// Chargés à la demande : composants situés en bas de page, pour alléger le JS initial (hero + conversion au-dessus de la ligne de flottaison).
const Awards = dynamic(() => import("@/components/sections/Awards"));
const Footer = dynamic(() => import("@/components/ui/Footer"));
import { SEUIL_DATE_ISO, faqs, milestones } from "./data";

/* ─────────────────────────────────────────────────────────
   Tracking — même helper que le reste du site (GA4 via gtag),
   + conversions LinkedIn Insight Tag propres à cette campagne.
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
   État partagé de la page — profil, ERP, simulateur, jeu —
   pour préremplir le formulaire où qu'il soit affiché.
───────────────────────────────────────────────────────── */

type Situation = "" | "client" | "fournisseur" | "les_deux" | "je_ne_sais_pas";
type Echeance = "" | "deja_concerne" | "janvier_2027" | "plus_tard" | "je_ne_sais_pas";

type FormFields = {
  situation: Situation;
  erp: string;
  echeance: Echeance;
  nom: string;
  fonction: string;
  entreprise: string;
  email: string;
  telephone: string;
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
  formStep: 0 | 1;
  goToStep: (step: 0 | 1) => void;
  loading: boolean;
  errorMsg: string;
  handleSubmit: (e: React.FormEvent) => void;
  scrollToForm: (origin: string) => void;
  profile: Situation;
  setProfile: (p: Situation) => void;
  montantSimule: number;
  setMontantSimule: (n: number) => void;
  retenueAnnuelleSimulee: number;
  setRetenueAnnuelleSimulee: (n: number) => void;
  scoreJeu: number | null;
  setScoreJeu: (n: number) => void;
  formStarted: boolean;
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

function FadeIn({ children, delay = 0, className, y = 24 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Tampon encreur "R.A.S." en SVG — élément signature de la page. */
function RasStamp({
  size = 160,
  trigger = true,
  label = "R.A.S.",
  className = "",
}: {
  size?: number;
  trigger?: boolean;
  label?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 2.4 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1 }
          : trigger
          ? { opacity: 1, scale: [2.4, 0.9, 1.05, 1], rotate: [-8, -8, -6, -8] }
          : { opacity: 0, scale: 2.4 }
      }
      transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.55, 0.8, 1] }}
      className={className}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={label}>
        <path
          d="M28 36 C 20 50, 24 70, 18 92 C 12 112, 26 128, 20 150 C 16 168, 36 176, 58 172 C 82 180, 104 174, 128 178 C 150 182, 176 172, 172 150 C 180 130, 170 112, 178 90 C 184 70, 172 50, 176 32 C 180 14, 158 22, 136 16 C 112 10, 90 18, 66 12 C 44 8, 36 20, 28 36 Z"
          fill="none"
          stroke="var(--color-ras)"
          strokeWidth="6"
        />
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-sans)"
          fontWeight={800}
          fontSize="40"
          letterSpacing="2"
          fill="var(--color-ras)"
        >
          {label}
        </text>
      </svg>
    </motion.div>
  );
}

/** Chiffre façon panneau "split-flap" (afficheur de gare), bascule une fois au chargement. */
function SplitFlapDigit({ value }: { value: string }) {
  const reduced = useReducedMotion();
  return (
    <span className="relative inline-flex items-center justify-center w-[1ch] overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={reduced ? false : { rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function useDaysUntilSeuil() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(SEUIL_DATE_ISO).getTime();
    const nowCasa = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })
    ).getTime();
    const diff = Math.ceil((target - nowCasa) / (1000 * 60 * 60 * 24));
    setDays(diff);
  }, []);
  return days;
}

/* ─────────────────────────────────────────────────────────
   Section 0 — Bandeau compte à rebours
───────────────────────────────────────────────────────── */

function CountdownBar() {
  const { scrollToForm } = useRasTva();
  const days = useDaysUntilSeuil();

  if (days === null) return <div className="h-10 bg-primary" aria-hidden="true" />;

  const passed = days <= 0;
  const digits = String(Math.max(days, 0)).padStart(2, "0").split("");

  return (
    <div className="relative z-[60] bg-primary text-white text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-10 flex items-center justify-center gap-2 text-center">
        {passed ? (
          <span className="font-semibold">Le palier 350 MDH est en vigueur depuis le 1er janvier 2027.</span>
        ) : (
          <span className="font-semibold flex items-center gap-1.5 flex-wrap justify-center">
            <span>
              J-
              {digits.map((d, i) => (
                <SplitFlapDigit key={i} value={d} />
              ))}
            </span>
            <span>avant le palier RAS TVA de 350&nbsp;MDH · 1er janvier 2027</span>
          </span>
        )}
        <button
          onClick={() => scrollToForm("countdown-bar")}
          className="hidden sm:inline-flex items-center gap-1 font-bold text-signal hover:text-signal/80 transition-colors cursor-pointer shrink-0"
        >
          Réserver mon diagnostic <ArrowRight size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Formulaire de diagnostic (2 étapes) — un seul composant,
   réutilisé dans le hero (carte collante) et en section 11.
───────────────────────────────────────────────────────── */

const situationOptions: { value: Situation; label: string }[] = [
  { value: "client", label: "Je retiens la TVA de mes fournisseurs" },
  { value: "fournisseur", label: "On retient ma TVA quand mes clients me paient" },
  { value: "les_deux", label: "Les deux" },
  { value: "je_ne_sais_pas", label: "Je ne sais pas" },
];

const erpOptions = ["Sage 100", "Sage X3", "Sage FRP 1000", "Autre Sage", "Autre ERP", "Excel"];

const echeanceOptions: { value: Echeance; label: string }[] = [
  { value: "deja_concerne", label: "Déjà concerné" },
  { value: "janvier_2027", label: "Le 1er janvier 2027" },
  { value: "plus_tard", label: "Plus tard" },
  { value: "je_ne_sais_pas", label: "Je ne sais pas" },
];

function DiagnosticForm({ id, variant = "card" }: { id?: string; variant?: "card" | "full" }) {
  const { form, setField, formStep, goToStep, loading, errorMsg, handleSubmit } = useRasTva();

  return (
    <div id={id} className={variant === "card" ? "bg-white rounded-3xl p-6 shadow-xl border border-slate-100" : "bg-white rounded-3xl p-7 md:p-10 shadow-xl max-w-xl mx-auto"}>
      <div className="inline-flex items-center gap-2 bg-ras/10 text-ras-dark text-[11px] font-bold px-3 py-1.5 rounded-full mb-4">
        <Image
          src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780929211/logo_thales_informatique_favicon_amxxo8.png"
          alt=""
          width={14}
          height={14}
          className="rounded-sm"
          aria-hidden="true"
        />
        Meilleure Dynamique Commerciale Sage Maroc 2024
      </div>

      <h3 className="text-lg font-bold text-primary mb-1">Votre diagnostic RAS TVA, offert</h3>
      <p className="text-secondary text-sm leading-relaxed mb-5">
        30 minutes avec un consultant Sage pour savoir où vous en êtes et ce qu&apos;il reste à faire avant le 1er janvier.
      </p>

      {/* Barre de progression */}
      <div className="flex gap-2 mb-2">
        {[0, 1].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= formStep ? "bg-cta" : "bg-slate-200"}`} />
        ))}
      </div>
      <p className="text-[11px] font-bold text-cta tracking-widest uppercase mb-5">Étape {formStep + 1} sur 2</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* honeypot anti-spam */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor={`website-${variant}`}>Site web</label>
          <input
            id={`website-${variant}`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
          />
        </div>

        {formStep === 0 && (
          <div className="space-y-5">
            <fieldset>
              <legend className="font-bold text-primary text-sm mb-2.5">Votre situation</legend>
              <div className="grid grid-cols-1 gap-2">
                {situationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("situation", opt.value)}
                    aria-pressed={form.situation === opt.value}
                    className={`px-3.5 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer ${
                      form.situation === opt.value ? "border-cta bg-blue-50 text-cta" : "border-slate-200 text-secondary hover:border-cta/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-bold text-primary text-sm mb-2.5">Votre ERP</legend>
              <div className="grid grid-cols-2 gap-2">
                {erpOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setField("erp", opt)}
                    aria-pressed={form.erp === opt}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer ${
                      form.erp === opt ? "border-cta bg-blue-50 text-cta" : "border-slate-200 text-secondary hover:border-cta/40"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-bold text-primary text-sm mb-2.5">Votre échéance</legend>
              <div className="grid grid-cols-2 gap-2">
                {echeanceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("echeance", opt.value)}
                    aria-pressed={form.echeance === opt.value}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer ${
                      form.echeance === opt.value ? "border-cta bg-blue-50 text-cta" : "border-slate-200 text-secondary hover:border-cta/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              disabled={!form.situation || !form.erp || !form.echeance}
              onClick={() => goToStep(1)}
              className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Continuer <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        {formStep === 1 && (
          <div className="space-y-3.5">
            <div>
              <label htmlFor={`nom-${variant}`} className="sr-only">Prénom et nom</label>
              <input
                id={`nom-${variant}`}
                type="text"
                placeholder="Prénom et nom *"
                required
                value={form.nom}
                onChange={(e) => setField("nom", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor={`fonction-${variant}`} className="sr-only">Fonction</label>
              <select
                id={`fonction-${variant}`}
                required
                value={form.fonction}
                onChange={(e) => setField("fonction", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
              >
                <option value="">Votre fonction *</option>
                {["DAF / RAF", "Chef comptable", "Comptable", "DG", "DSI", "Autre"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`entreprise-${variant}`} className="sr-only">Entreprise</label>
              <input
                id={`entreprise-${variant}`}
                type="text"
                placeholder="Entreprise *"
                required
                value={form.entreprise}
                onChange={(e) => setField("entreprise", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor={`email-${variant}`} className="sr-only">Email professionnel</label>
              <input
                id={`email-${variant}`}
                type="email"
                placeholder="Email professionnel *"
                required
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor={`telephone-${variant}`} className="sr-only">Téléphone</label>
              <input
                id={`telephone-${variant}`}
                type="tel"
                placeholder="Téléphone (06, 07, 05 ou +212) *"
                required
                value={form.telephone}
                onChange={(e) => setField("telephone", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
              />
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.consentement}
                onChange={(e) => setField("consentement", e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-cta focus:ring-cta focus:ring-1 cursor-pointer"
              />
              <span className="text-xs text-secondary leading-relaxed">
                J&apos;accepte que Thalès Informatique utilise ces informations pour me recontacter, conformément à la loi 09-08. Voir la{" "}
                <Link href="/politique-de-confidentialite" className="text-cta underline">politique de confidentialité</Link>.
              </span>
            </label>

            {errorMsg && (
              <div role="alert" className="text-xs text-signal-dark bg-signal/10 border border-signal/30 rounded-lg px-3 py-2 space-y-1.5">
                <p>{errorMsg}</p>
                <a
                  href="https://wa.me/212661168354?text=Bonjour%2C%20je%20souhaite%20un%20diagnostic%20RAS%20TVA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2"
                >
                  <MessageCircle size={13} aria-hidden="true" /> Nous écrire sur WhatsApp
                </a>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToStep(0)}
                className="inline-flex items-center gap-1.5 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} aria-hidden="true" /> Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-ras text-white font-bold px-6 py-3.5 rounded-xl hover:bg-ras-dark transition-colors duration-200 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                {loading ? "Envoi en cours..." : "Je réserve mon diagnostic"}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Gratuit · 30 minutes · sans engagement · réponse sous 24 heures ouvrées
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 1 — Hero "La facture qui se coupe"
───────────────────────────────────────────────────────── */

function HeroSplitInvoice() {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const play = inView && !reduced;
  // Avec "prefers-reduced-motion", on affiche directement l'état final (rien n'est masqué) — pas d'animation.
  const settled = reduced || inView;

  return (
    <div ref={ref} className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Facture initiale — disparaît une fois "réduite" aux deux montants */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={play ? { opacity: [1, 1, 0] } : {}}
          transition={{ duration: 0.4, delay: 0.9, times: [0, 0.7, 1] }}
          className="absolute inset-x-8 top-6 bg-white rounded-xl shadow-lg border border-slate-200 p-4 text-left"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Facture n° 2027-014</p>
          <p className="text-2xl font-black text-primary">12 000 DH <span className="text-sm font-semibold text-secondary">TTC</span></p>
        </motion.div>
      )}

      {/* Montant fournisseur */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 0, y: 40 }}
        animate={settled ? { opacity: 1, x: -70, y: 70 } : {}}
        transition={{ duration: 0.6, delay: reduced ? 0 : 1.0, ease: "easeOut" }}
        className="absolute inset-x-8 top-6 flex flex-col items-center gap-1.5"
      >
        <span className="w-11 h-11 rounded-full bg-cta/10 flex items-center justify-center">
          <Building2 size={20} className="text-cta" aria-hidden="true" />
        </span>
        <span className="bg-white rounded-lg shadow-md border border-slate-200 px-3 py-1.5 text-sm font-bold text-primary">10 500 DH</span>
        <span className="text-[10px] font-semibold text-secondary">Fournisseur</span>
      </motion.div>

      {/* Montant DGI */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 0, y: 40 }}
        animate={settled ? { opacity: 1, x: 70, y: 70 } : {}}
        transition={{ duration: 0.6, delay: reduced ? 0 : 1.0, ease: "easeOut" }}
        className="absolute inset-x-8 top-6 flex flex-col items-center gap-1.5"
      >
        <span className="w-11 h-11 rounded-full bg-signal/10 flex items-center justify-center">
          <Landmark size={20} className="text-signal-dark" aria-hidden="true" />
        </span>
        <span className="bg-white rounded-lg shadow-md border border-slate-200 px-3 py-1.5 text-sm font-bold text-primary">1 500 DH</span>
        <span className="text-[10px] font-semibold text-secondary">DGI</span>
      </motion.div>

      {/* Tampon R.A.S. */}
      <motion.div
        animate={!reduced && play ? { x: [0, -3, 3, -2, 0] } : {}}
        transition={{ duration: 0.4, delay: 1.9 }}
        className="absolute inset-x-0 bottom-4 flex justify-center"
      >
        <RasStamp size={120} trigger={settled} />
      </motion.div>
    </div>
  );
}

function Hero() {
  const { scrollToForm } = useRasTva();

  return (
    <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 bg-bg overflow-hidden" id="hero">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <FadeIn>
              <span className="inline-block text-[11px] font-bold text-cta uppercase tracking-widest mb-4">
                Module RAS TVA · Sage 100 · Sage X3 · Sage FRP 1000
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-primary leading-tight mb-5">
                Retenue à la source de la TVA ? <span className="text-ras">Rien à signaler.</span>
              </h1>
              <p className="text-lg text-secondary leading-relaxed mb-7 max-w-lg">
                Le module RAS TVA s&apos;ajoute à votre Sage 100, X3 ou FRP 1000 et gère chaque retenue à votre place.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-xl">
                {[
                  { icon: Sparkles, label: "S'installe sur votre Sage" },
                  { icon: Users, label: "Côté client et côté fournisseur" },
                  { icon: ShieldCheck, label: "30 ans d'expertise Sage" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-3">
                    <b.icon size={18} className="text-cta shrink-0" aria-hidden="true" />
                    <span className="text-xs font-medium text-secondary">{b.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <HeroSplitInvoice />
            </FadeIn>

            {/* Mobile : simple bouton, le formulaire est plus bas / dans la barre fixe */}
            <div className="lg:hidden mt-8">
              <button
                onClick={() => scrollToForm("hero-mobile")}
                className="w-full inline-flex items-center justify-center gap-2 bg-ras text-white font-bold px-6 py-4 rounded-xl hover:bg-ras-dark transition-colors duration-200 cursor-pointer"
              >
                Réserver mon diagnostic <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Carte formulaire collante — desktop uniquement */}
          <div className="hidden lg:block sticky top-6">
            <DiagnosticForm id="formulaire-hero" variant="card" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 2 — "Quel camp êtes-vous ?"
───────────────────────────────────────────────────────── */

function ProfileCard({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={`relative text-left p-6 rounded-2xl border-2 transition-colors duration-200 cursor-pointer ${
        active ? "border-ras bg-ras/5" : "border-slate-200 bg-white hover:border-ras/40"
      }`}
    >
      <span
        className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
          active ? "border-ras bg-ras" : "border-slate-300"
        }`}
      >
        {active && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
            <Check size={16} className="text-white" aria-hidden="true" />
          </motion.span>
        )}
      </span>
      <p className="text-base font-bold text-primary pr-10 leading-snug">{label}</p>
    </button>
  );
}

function ProfileSection() {
  const { profile, setProfile, scrollToForm } = useRasTva();

  return (
    <section className="py-16 lg:py-20 bg-white" id="profil">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">
            La RAS TVA vous concerne de quel côté ?
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div role="radiogroup" aria-label="Votre situation face à la RAS TVA" className="grid sm:grid-cols-2 gap-4">
            <ProfileCard
              label="Je retiens la TVA de mes fournisseurs"
              active={profile === "client"}
              onSelect={() => {
                setProfile("client");
                track("profile_selected", { profile: "client" });
              }}
            />
            <ProfileCard
              label="On retient ma TVA quand mes clients me paient"
              active={profile === "fournisseur"}
              onSelect={() => {
                setProfile("fournisseur");
                track("profile_selected", { profile: "fournisseur" });
              }}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={() => {
                setProfile("les_deux");
                track("profile_selected", { profile: "les_deux" });
              }}
              className={`text-sm font-medium underline-offset-4 cursor-pointer ${
                profile === "les_deux" ? "text-ras-dark font-bold underline" : "text-secondary hover:text-cta hover:underline"
              }`}
            >
              Les deux
            </button>
          </div>
        </FadeIn>

        {profile && (
          <FadeIn delay={0.2}>
            <div className="text-center mt-8">
              <button
                onClick={() => scrollToForm("profile-section")}
                className="inline-flex items-center gap-1.5 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
              >
                Voir ce que ça change pour vous <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 3 — Le compteur de trésorerie
───────────────────────────────────────────────────────── */

const MONTANT_MIN = 50_000;
const MONTANT_MAX = 10_000_000;

function formatDH(n: number) {
  const rounded = Math.round(n);
  const grouped = rounded.toLocaleString("fr-FR").replace(/[  ]/g, " ");
  return `${grouped} DH`;
}

// Progression non linéaire (échelle logarithmique) : précis sur les petits montants, large sur les gros.
function montantToSliderPos(montant: number) {
  const ratio = Math.log(montant / MONTANT_MIN) / Math.log(MONTANT_MAX / MONTANT_MIN);
  return Math.round(ratio * 1000);
}
function sliderPosToMontant(pos: number) {
  const ratio = pos / 1000;
  return Math.round(MONTANT_MIN * Math.pow(MONTANT_MAX / MONTANT_MIN, ratio));
}

function RollingDigit({ d }: { d: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <span className="inline-flex w-[0.62em] justify-center">{d}</span>;
  }
  return (
    <span className="relative inline-flex w-[0.62em] h-[1.1em] overflow-hidden justify-center align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={d}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -22, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function RollingAmount({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex items-baseline tabular-nums ${className ?? ""}`}>
      {text.split("").map((c, i) =>
        /\d/.test(c) ? (
          <RollingDigit key={i} d={c} />
        ) : (
          <span key={i} className={c === " " ? "inline-block w-[0.28em]" : undefined}>
            {c}
          </span>
        )
      )}
    </span>
  );
}

function profileLabelSimulateur(profile: Situation) {
  if (profile === "client") return "TVA à retenir, reverser et déclarer";
  if (profile === "fournisseur") return "TVA non encaissée, à suivre et à récupérer";
  return "TVA concernée par la retenue";
}

function SimulatorSection() {
  const { profile, setMontantSimule, setRetenueAnnuelleSimulee, scrollToForm } = useRasTva();
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-2">
            Combien la RAS TVA retient-elle sur votre trésorerie ?
          </h2>
          <p className="text-secondary text-center text-sm mb-10">{profileLabelSimulateur(profile)}</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2.5">
                <label htmlFor="montant-slider" className="text-sm font-bold text-primary">
                  Montant HT concerné par mois
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    aria-label="Montant HT concerné par mois, en dirhams"
                    min={MONTANT_MIN}
                    max={MONTANT_MAX}
                    step={1000}
                    value={montantHT}
                    onChange={(e) => {
                      const v = Math.min(MONTANT_MAX, Math.max(MONTANT_MIN, Number(e.target.value) || MONTANT_MIN));
                      setMontantHT(v);
                      markUsed();
                    }}
                    className="w-32 text-right px-2 py-1 rounded-lg border border-slate-200 text-sm font-bold text-primary focus:border-cta focus:ring-1 focus:ring-cta outline-none"
                  />
                  <span className="text-sm font-bold text-secondary">DH</span>
                </div>
              </div>
              <input
                id="montant-slider"
                type="range"
                min={0}
                max={1000}
                step={1}
                value={montantToSliderPos(montantHT)}
                onChange={(e) => {
                  setMontantHT(sliderPosToMontant(Number(e.target.value)));
                  markUsed();
                }}
                className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-cta cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>50 000 DH</span>
                <span>10 000 000 DH</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 mb-7">
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

            {/* Compteur façon pompe à essence */}
            <div
              aria-live="polite"
              className="bg-primary rounded-2xl px-5 py-6 sm:px-8 sm:py-7 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3 text-white/50">
                <Fuel size={14} aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Retenue en temps réel</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
                <div>
                  <RollingAmount text={formatDH(retenueMensuelle)} className="text-2xl sm:text-3xl font-black text-white" />
                  <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wide mt-1">par mois</p>
                </div>
                <div className="sm:border-l sm:border-white/15">
                  <RollingAmount text={formatDH(retenueAnnuelle)} className="text-2xl sm:text-3xl font-black text-accent" />
                  <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wide mt-1">par an</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">Calcul indicatif au taux normal de 20 %.</p>

            <div className="text-center mt-6">
              <button
                onClick={() => scrollToForm("simulateur")}
                className="inline-flex items-center gap-2 bg-ras text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-ras-dark transition-colors cursor-pointer"
              >
                Recevoir ce calcul et mon diagnostic <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 4 — "Trouvez l'erreur"
───────────────────────────────────────────────────────── */

const invoiceErrors = [
  {
    id: "attestation",
    icon: Calendar,
    zoneLabel: "Attestation de régularité fiscale — datée de 7 mois",
    explanation: "L'attestation doit avoir moins de 6 mois. Sans attestation valide, la retenue passe à 100 %.",
  },
  {
    id: "travaux",
    icon: FileWarning,
    zoneLabel: "Travaux d'aménagement — RAS 75 %",
    explanation: "Pour les travaux, une attestation valide évite en principe la retenue. Le taux de 75 % ne s'applique pas ici.",
  },
  {
    id: "bordereau",
    icon: Receipt,
    zoneLabel: "Aucune ligne de relevé ni de bordereau",
    explanation: "La TVA retenue doit être reversée le mois suivant, avec un relevé détaillé joint à la déclaration.",
  },
] as const;

function Confetti() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const colors = ["var(--color-ras)", "var(--color-accent)", "var(--color-cta)", "var(--color-signal)"];
  const pieces = Array.from({ length: 26 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const color = colors[i % colors.length];
        const rotate = Math.random() * 360;
        return (
          <motion.span
            key={i}
            initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: 220, opacity: 0, rotate }}
            transition={{ duration: 1.1 + Math.random() * 0.4, delay, ease: "easeIn" }}
            className="absolute top-0 w-2 h-3 rounded-sm"
            style={{ left: `${left}%`, backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}

function InvoiceErrorGame() {
  const { setScoreJeu, scrollToForm } = useRasTva();
  const [found, setFound] = useState<Set<string>>(new Set());
  const [openTip, setOpenTip] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const completedOnce = useRef(false);

  const score = found.size;

  useEffect(() => {
    setScoreJeu(score);
    if (score === 3 && !completedOnce.current) {
      completedOnce.current = true;
      track("game_completed", { score });
    }
  }, [score, setScoreJeu]);

  const toggleZone = (id: string) => {
    setFound((f) => new Set(f).add(id));
    setOpenTip((t) => (t === id ? null : id));
  };

  const revealAll = () => {
    setFound(new Set(invoiceErrors.map((e) => e.id)));
    setRevealed(true);
  };

  return (
    <section className="py-16 lg:py-20 bg-white" id="jeu">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-2">
            3 erreurs se cachent sur cette facture. Vous les trouvez ?
          </h2>
          <p className="text-secondary text-center text-sm mb-10">Cliquez sur les zones suspectes pour vérifier.</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative">
            <div className="relative bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 sm:p-8 lg:cursor-zoom-in">
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <p className="font-bold text-primary">Exemple Conseil SARL</p>
                  <p className="text-xs text-secondary">Facture n° 2027-014</p>
                </div>
                <p className="text-xs text-secondary">12 février 2027</p>
              </div>

              <table className="w-full text-sm mb-5">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="pb-2 font-semibold">Désignation</th>
                    <th className="pb-2 font-semibold text-right">Montant HT</th>
                    <th className="pb-2 font-semibold text-right">TVA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="py-2.5 text-secondary">Prestation de services</td>
                    <td className="py-2.5 text-right text-primary font-medium">10 000 DH</td>
                    <td className="py-2.5 text-right text-primary font-medium">20 %</td>
                  </tr>
                  <tr className="border-t border-slate-100 relative">
                    <td colSpan={3} className="py-1">
                      <button
                        type="button"
                        onClick={() => toggleZone("travaux")}
                        className={`w-full flex items-center justify-between gap-2 text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          found.has("travaux") ? "bg-signal/10" : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-secondary">Travaux d&apos;aménagement — <span className="font-semibold">RAS 75 %</span></span>
                        {found.has("travaux") && <span className="text-[10px] font-bold text-signal-dark bg-signal/20 px-2 py-0.5 rounded-full shrink-0 -rotate-6">ERREUR</span>}
                      </button>
                      {openTip === "travaux" && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-signal-dark bg-signal/5 border border-signal/20 rounded-lg px-3 py-2 mt-1">
                          {invoiceErrors[1].explanation}
                        </motion.p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                type="button"
                onClick={() => toggleZone("attestation")}
                className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 rounded-lg border mb-2 transition-colors cursor-pointer ${
                  found.has("attestation") ? "border-signal bg-signal/10" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2 text-xs text-secondary">
                  <Calendar size={14} className="shrink-0" aria-hidden="true" />
                  Attestation de régularité fiscale jointe — datée du 14 juillet 2026
                </span>
                {found.has("attestation") && <span className="text-[10px] font-bold text-signal-dark bg-signal/20 px-2 py-0.5 rounded-full shrink-0 -rotate-6">ERREUR</span>}
              </button>
              {openTip === "attestation" && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-signal-dark bg-signal/5 border border-signal/20 rounded-lg px-3 py-2 mb-3">
                  {invoiceErrors[0].explanation}
                </motion.p>
              )}

              <button
                type="button"
                onClick={() => toggleZone("bordereau")}
                className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                  found.has("bordereau") ? "border-signal bg-signal/10" : "border-dashed border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2 text-xs text-secondary">
                  <Receipt size={14} className="shrink-0" aria-hidden="true" />
                  (aucune pièce jointe "relevé" ou "bordereau-avis")
                </span>
                {found.has("bordereau") && <span className="text-[10px] font-bold text-signal-dark bg-signal/20 px-2 py-0.5 rounded-full shrink-0 -rotate-6">ERREUR</span>}
              </button>
              {openTip === "bordereau" && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-signal-dark bg-signal/5 border border-signal/20 rounded-lg px-3 py-2 mt-1">
                  {invoiceErrors[2].explanation}
                </motion.p>
              )}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <span aria-live="polite" className="text-sm font-bold text-primary">
                  Score : <span className={score === 3 ? "text-ras-dark" : "text-primary"}>{score}/3</span>
                </span>
                {!revealed && score < 3 && (
                  <button type="button" onClick={revealAll} className="text-xs font-semibold text-cta hover:text-blue-700 cursor-pointer flex items-center gap-1">
                    <HelpCircle size={13} aria-hidden="true" /> Voir les réponses
                  </button>
                )}
              </div>
            </div>
            {score === 3 && <Confetti />}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="text-center mt-8">
            {score === 3 ? (
              <>
                <p className="font-semibold text-primary mb-4">Bravo. Et votre équipe ? Recevez la check-list des 10 contrôles avant paiement.</p>
                <button
                  onClick={() => scrollToForm("jeu-3-3")}
                  className="inline-flex items-center gap-2 bg-ras text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-ras-dark transition-colors cursor-pointer"
                >
                  Recevoir la check-list <ArrowRight size={14} aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold text-secondary mb-4">Rassurez-vous : votre Sage peut faire ces contrôles à votre place.</p>
                <button
                  onClick={() => scrollToForm("jeu-incomplet")}
                  className="inline-flex items-center gap-2 bg-cta text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Réserver mon diagnostic <ArrowRight size={14} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Modale vidéo accessible — réutilisée sections 5 et 7
   (même logique que VideoModal de Testimonials.tsx : overlay
   flouté, fermeture au clic extérieur / Échap, focus géré).
───────────────────────────────────────────────────────── */

// [À VALIDER : URL des vidéos de démo 45s par ERP]
const demoVideos: Record<string, string> = {
  "Sage 100": "",
  "Sage X3": "",
  "Sage FRP 1000": "",
};

function VideoModal({ videoId, title, onClose }: { videoId: string; title: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Focus piégé : Tab/Shift+Tab bouclent entre les éléments focusables de la modale.
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
        );
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
        aria-label={title}
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
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/60">
              <Play size={32} aria-hidden="true" />
              <p className="text-sm font-medium">Vidéo « {title} » à intégrer</p>
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
   Section 5 — Avant / Après
───────────────────────────────────────────────────────── */

function BeforeAfterSection() {
  const { form } = useRasTva();
  const [pos, setPos] = useState(50);
  const [videoOpen, setVideoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, ratio)));
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (draggingRef.current) updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const demoErp = form.erp && demoVideos[form.erp] !== undefined ? form.erp : "Sage 100";

  return (
    <section className="py-16 lg:py-20 bg-bg" id="avant-apres">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">Même facture. Zéro question.</h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 shadow-sm select-none touch-none"
            onPointerDown={(e) => {
              draggingRef.current = true;
              updateFromClientX(e.clientX);
            }}
          >
            {/* Après — Sage, en fond */}
            <div className="absolute inset-0 bg-white p-5 sm:p-7">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="ml-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Sage — RAS TVA</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-ras/5 border border-ras/20 rounded-lg p-3">
                  <p className="text-[10px] text-secondary mb-1">Retenue calculée</p>
                  <p className="text-lg font-black text-ras-dark">1 500 DH</p>
                </div>
                <div className="bg-cta/5 border border-cta/20 rounded-lg p-3">
                  <p className="text-[10px] text-secondary mb-1">Net à payer</p>
                  <p className="text-lg font-black text-cta">10 500 DH</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                {[90, 75, 60].map((w, i) => (
                  <div key={i} className="h-2.5 bg-slate-100 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
              <RasStamp size={64} trigger={true} />
            </div>

            {/* Avant — Excel, révélé par découpe */}
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <div className="absolute inset-0 bg-slate-700 p-5 sm:p-7 text-left">
                <p className="text-[10px] font-mono text-slate-300 mb-3">RAS_TVA_v12_FINAL_vraiment.xlsx</p>
                <div className="grid grid-cols-4 gap-px bg-slate-600 text-[9px] sm:text-[10px]">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const isRed = [2, 5, 9, 13].includes(i);
                    return (
                      <div key={i} className={`h-6 sm:h-7 flex items-center justify-center ${isRed ? "bg-signal/30 text-white font-bold" : "bg-slate-600/60 text-slate-300"}`}>
                        {isRed ? "#ERR" : ""}
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-14 right-4 bg-yellow-200 text-slate-800 text-[9px] font-semibold px-2 py-1.5 rounded shadow rotate-3 max-w-[90px]">
                  75 % ou 100 % ?
                </div>
                <div className="absolute top-28 left-6 bg-yellow-200 text-slate-800 text-[9px] font-semibold px-2 py-1.5 rounded shadow -rotate-2 max-w-[90px]">
                  attestation OK ?
                </div>
                <div className="absolute bottom-6 right-6 bg-yellow-200 text-slate-800 text-[9px] font-semibold px-2 py-1.5 rounded shadow rotate-1 max-w-[90px]">
                  bordereau ??
                </div>
              </div>
            </div>

            {/* Poignée */}
            <div className="absolute inset-y-0 w-0.5 bg-white pointer-events-none" style={{ left: `${pos}%` }} />
            <button
              type="button"
              role="slider"
              aria-label="Comparer avant et après"
              aria-valuenow={Math.round(pos)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              className="absolute top-1/2 w-11 h-11 rounded-full bg-white border-2 border-cta shadow-lg flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
              style={{ left: `${pos}%` }}
              onPointerDown={(e) => {
                e.stopPropagation();
                draggingRef.current = true;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
                if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
              }}
            >
              <ChevronsLeftRight size={18} className="text-cta" aria-hidden="true" />
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="text-center mt-7">
            <button
              onClick={() => {
                setVideoOpen(true);
                track("demo_video_open", { erp: demoErp });
              }}
              className="inline-flex items-center gap-2 bg-cta text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <Play size={14} aria-hidden="true" /> Voir la démo en 45 secondes
            </button>
          </div>
        </FadeIn>
      </div>

      {videoOpen && (
        <VideoModal videoId={demoVideos[demoErp]} title={`Démo ${demoErp}`} onClose={() => setVideoOpen(false)} />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 6 — Comment ça marche
───────────────────────────────────────────────────────── */

const howItWorksSteps = [
  { num: "01", title: "Vous saisissez la facture, comme d'habitude, dans Sage.", icon: ClipboardCheck },
  { num: "02", title: "Le module vérifie la nature de l'opération et la validité de l'attestation du fournisseur.", icon: Calendar },
  { num: "03", title: "Il calcule la retenue et le net à payer, et passe les écritures.", icon: Cog },
  { num: "04", title: "Il prépare le bordereau-avis et le relevé détaillé pour votre déclaration.", icon: Receipt },
] as const;

function HowItWorksMock({ activeStep }: { activeStep: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 w-full">
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="ml-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Sage — RAS TVA</span>
      </div>
      <div className={`rounded-lg p-3 mb-2.5 border transition-colors duration-300 ${activeStep === 0 ? "border-cta bg-cta/5" : "border-slate-100"}`}>
        <p className="text-[10px] text-secondary mb-1">Saisie facture</p>
        <div className="h-2.5 bg-slate-100 rounded w-3/4" />
      </div>
      <div className={`rounded-lg p-3 mb-2.5 border transition-colors duration-300 ${activeStep === 1 ? "border-cta bg-cta/5" : "border-slate-100"}`}>
        <p className="text-[10px] text-secondary mb-1">Contrôle attestation</p>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} className={activeStep === 1 ? "text-cta" : "text-slate-300"} aria-hidden="true" />
          <div className="h-2.5 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className={`rounded-lg p-3 mb-2.5 border transition-colors duration-300 ${activeStep === 2 ? "border-ras bg-ras/5" : "border-slate-100"}`}>
        <p className="text-[10px] text-secondary mb-1">Retenue calculée</p>
        <p className={`text-base font-black transition-colors duration-300 ${activeStep === 2 ? "text-ras-dark" : "text-slate-300"}`}>1 500 DH</p>
      </div>
      <div className={`rounded-lg p-3 border transition-colors duration-300 ${activeStep === 3 ? "border-accent bg-accent/10" : "border-slate-100"}`}>
        <p className="text-[10px] text-secondary mb-1">Bordereau-avis</p>
        <div className="flex items-center gap-1.5">
          <Receipt size={13} className={activeStep === 3 ? "text-cta" : "text-slate-300"} aria-hidden="true" />
          <div className="h-2.5 bg-slate-100 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const { scrollToForm } = useRasTva();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const ratio = scrolled / Math.max(total, 1);
      setActiveStep(Math.min(3, Math.floor(ratio * howItWorksSteps.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-16 lg:py-20 bg-white" id="comment-ca-marche">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-12 lg:mb-16">Comment ça marche</h2>
        </FadeIn>

        {/* Desktop : défilement collant */}
        <div ref={sectionRef} className="hidden lg:grid grid-cols-2 gap-14" style={{ minHeight: `${howItWorksSteps.length * 70}vh` }}>
          <div className="space-y-[40vh] pt-[10vh] pb-[20vh]">
            {howItWorksSteps.map((s, i) => (
              <div key={s.num} className={`transition-opacity duration-300 ${activeStep === i ? "opacity-100" : "opacity-40"}`}>
                <span className="text-xs font-bold text-cta tracking-widest">ÉTAPE {s.num}</span>
                <p className="text-xl font-bold text-primary mt-2 max-w-sm">{s.title}</p>
              </div>
            ))}
          </div>
          <div className="sticky top-24 h-fit">
            <HowItWorksMock activeStep={activeStep} />
          </div>
        </div>

        {/* Mobile : cartes empilées */}
        <div className="lg:hidden space-y-5">
          {howItWorksSteps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 0.08}>
              <div className="bg-bg rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-lg bg-cta/10 flex items-center justify-center shrink-0">
                    <s.icon size={16} className="text-cta" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold text-cta tracking-widest">ÉTAPE {s.num}</span>
                </div>
                <p className="text-sm font-semibold text-primary mb-4">{s.title}</p>
                <HowItWorksMock activeStep={i} />
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <div className="text-center mt-14">
            <p className="font-bold text-primary mb-4">4 étapes. Vous n&apos;en faites qu&apos;une.</p>
            <button
              onClick={() => scrollToForm("comment-ca-marche")}
              className="inline-flex items-center gap-2 bg-ras text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-ras-dark transition-colors cursor-pointer"
            >
              Réserver mon diagnostic <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 7 — Choisissez votre Sage
───────────────────────────────────────────────────────── */

const sageCards = [
  {
    key: "Sage 100",
    icon: Server,
    audience: "Pour les PME",
    desc: "Suivez la TVA retenue par vos clients, rapprochez vos encaissements et gérez la retenue sur vos prestataires.",
  },
  {
    key: "Sage X3",
    icon: Network,
    audience: "Pour les ETI et grandes entreprises",
    desc: "Traitez la retenue en masse sur des centaines de fournisseurs, avec contrôle des attestations et reporting.",
  },
  {
    key: "Sage FRP 1000",
    icon: Layers,
    audience: "Pour les groupes et le secteur public",
    desc: "Gérez la retenue par entité et gardez une piste d'audit consolidée.",
  },
] as const;

function SageCard({ card, onPick, onPlay }: { card: (typeof sageCards)[number]; onPick: () => void; onPlay: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();
  return (
    <div
      className="relative h-64 [perspective:1200px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFlipped(false);
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
        className="relative w-full h-full [transform-style:preserve-3d]"
      >
        {/* Face avant */}
        <button
          type="button"
          onClick={onPick}
          className="absolute inset-0 [backface-visibility:hidden] bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-cta/40 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
        >
          <span className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center mb-4">
            <card.icon size={22} className="text-cta" aria-hidden="true" />
          </span>
          <h3 className="text-base font-bold text-primary mb-1">{card.key}</h3>
          <p className="text-xs font-semibold text-cta mb-3">{card.audience}</p>
          <p className="text-xs text-secondary leading-relaxed">{card.desc}</p>
        </button>

        {/* Face arrière */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3"
        >
          <div className="w-full h-20 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-2">
            <span className="w-8 h-8 rounded bg-ras/20 flex items-center justify-center"><Check size={14} className="text-ras" aria-hidden="true" /></span>
            <span className="w-8 h-8 rounded bg-cta/20 flex items-center justify-center"><Receipt size={14} className="text-accent" aria-hidden="true" /></span>
          </div>
          <p className="text-white text-xs font-medium">Aperçu de l&apos;écran {card.key}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="inline-flex items-center gap-1.5 bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-white/90"
          >
            <Play size={12} aria-hidden="true" /> Voir la démo
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SageChoiceSection() {
  const { setField } = useRasTva();
  const [videoKey, setVideoKey] = useState<string | null>(null);

  return (
    <section className="py-16 lg:py-20 bg-bg" id="choisissez-votre-sage">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">Choisissez votre Sage</h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5">
          {sageCards.map((card, i) => (
            <FadeIn key={card.key} delay={i * 0.08}>
              <SageCard
                card={card}
                onPick={() => {
                  setField("erp", card.key);
                  track("erp_selected", { erp: card.key });
                }}
                onPlay={() => {
                  setVideoKey(card.key);
                  track("demo_video_open", { erp: card.key, origin: "sage-choice" });
                }}
              />
            </FadeIn>
          ))}
        </div>
      </div>

      {videoKey && (
        <VideoModal videoId={demoVideos[videoKey] ?? ""} title={`Démo ${videoKey}`} onClose={() => setVideoKey(null)} />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 8 — La frise des paliers
───────────────────────────────────────────────────────── */

function useTodayRatio() {
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    const first = new Date(milestones[0].iso).getTime();
    const last = new Date(milestones[milestones.length - 1].iso).getTime();
    const today = Date.now();
    setRatio(Math.min(1, Math.max(0, (today - first) / (last - first))));
  }, []);
  return ratio;
}

function TimelineSection() {
  const { scrollToForm } = useRasTva();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const todayRatio = useTodayRatio();

  return (
    <section className="py-16 lg:py-20 bg-white" id="frise">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-14" ref={ref as never}>
            Où en êtes-vous sur la ligne du temps ?
          </h2>
        </FadeIn>

        {/* Desktop : horizontale */}
        <div className="hidden md:block relative pt-4 pb-10">
          <svg className="absolute top-4 left-0 w-full h-1" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="#E2E8F0" strokeWidth="1" />
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="var(--color-signal)"
              strokeWidth="1.5"
              initial={reduced ? false : { pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </svg>

          {todayRatio !== null && todayRatio >= 0 && todayRatio <= 1 && (
            <div className="absolute top-4 -translate-y-1/2 flex flex-col items-center" style={{ left: `${todayRatio * 100}%` }}>
              <motion.span
                animate={reduced ? {} : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-3 h-3 rounded-full bg-cta"
              />
              <span className="mt-1.5 text-[10px] font-bold text-cta whitespace-nowrap">Vous êtes ici</span>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mt-8">
            {milestones.map((m, i) => (
              <FadeIn key={m.date} delay={0.15 + i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <span className={`w-4 h-4 rounded-full mb-3 ${m.highlight ? "bg-signal ring-4 ring-signal/20" : "bg-cta"}`} />
                  <span className={`text-sm font-bold mb-1 ${m.highlight ? "text-signal-dark" : "text-primary"}`}>{m.date}</span>
                  <span className="text-xs font-semibold text-secondary mb-1.5">{m.label}</span>
                  <p className="text-[11px] text-secondary leading-relaxed">{m.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Mobile : verticale */}
        <div className="md:hidden relative pl-8">
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" aria-hidden="true" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <FadeIn key={m.date} delay={i * 0.08} className="relative">
                <span className={`absolute -left-8 top-0.5 w-4 h-4 rounded-full ${m.highlight ? "bg-signal ring-4 ring-signal/20" : "bg-cta"}`} />
                <span className={`text-sm font-bold block mb-1 ${m.highlight ? "text-signal-dark" : "text-primary"}`}>{m.date}</span>
                <span className="text-xs font-semibold text-secondary block mb-1">{m.label}</span>
                <p className="text-[11px] text-secondary leading-relaxed">{m.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.2}>
          <div className="text-center mt-10">
            <p className="font-semibold text-primary mb-4">Votre entreprise passe le palier en janvier ?</p>
            <button
              onClick={() => scrollToForm("frise")}
              className="inline-flex items-center gap-2 bg-signal-dark text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-signal-dark/90 transition-colors cursor-pointer"
            >
              Vérifions-le ensemble <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 9 — La preuve
───────────────────────────────────────────────────────── */

const proofStats = [
  { value: 30, suffix: "+", label: "ans d'expertise Sage" },
  { value: 3, suffix: "", label: "ERP couverts" },
  { value: 30, suffix: "", label: "min de diagnostic offert" },
  { value: 0, suffix: "", label: "[À VALIDER : nombre de clients Sage accompagnés]" },
] as const;

function ProofCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const total = 50;
    const id = setInterval(() => {
      frame++;
      setCount(Math.round((frame / total) * target));
      if (frame >= total) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [inView, reduced, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

function ProofSection() {
  return (
    <section className="py-16 lg:py-20 bg-primary" id="preuve">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
            {proofStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-white mb-1.5">
                  <ProofCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[11px] text-white/60 font-medium leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Témoignage */}
        <FadeIn delay={0.1}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-12 max-w-2xl mx-auto text-center">
            <Quote size={24} className="text-accent mx-auto mb-4" aria-hidden="true" />
            <p className="text-white/85 text-sm sm:text-base leading-relaxed italic mb-5">
              « [À VALIDER : témoignage client pilote sur le module RAS TVA] »
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                <Users size={16} aria-hidden="true" />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-white">[À VALIDER : nom]</p>
                <p className="text-[11px] text-white/50">[À VALIDER : fonction, entreprise]</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Vidéo "Le contrôleur R.A.S." */}
        <FadeIn delay={0.15}>
          <div className="max-w-xl mx-auto aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 mb-12">
            <Play size={28} className="text-white/40" aria-hidden="true" />
            <p className="text-xs text-white/50">Vidéo « Le contrôleur R.A.S. » à intégrer [À VALIDER : fichier vidéo]</p>
          </div>
        </FadeIn>
      </div>

      {/* Trophées — composant réel du site, mêmes visuels que la page d'accueil */}
      <div className="bg-slate-50">
        <Awards />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 10 — FAQ
───────────────────────────────────────────────────────── */

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
        >
          <span className="font-semibold text-primary text-sm">{q}</span>
          <ChevronDown size={18} className={`text-cta shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </h3>
      {open && (
        <div className="px-5 pb-4 text-sm text-secondary leading-relaxed">
          {a.split(/(\[À VALIDER[^\]]*\])/g).map((part, i) =>
            part.startsWith("[À VALIDER") ? (
              <span key={i} className="text-signal-dark font-medium">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      )}
    </div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-20 bg-bg" id="faq">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">Questions fréquentes</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={openIndex === i}
                onToggle={() => {
                  const next = !(openIndex === i) ? i : null;
                  setOpenIndex(next);
                  if (next !== null) track("faq_interaction", { question: f.q });
                }}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 11 — Dernier appel
───────────────────────────────────────────────────────── */

function FinalCtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-primary relative overflow-hidden" id="dernier-appel">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-primary to-primary" aria-hidden="true" />
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-10">
          Le 1er janvier arrive vite. Votre RAS TVA, elle, peut être prête la semaine prochaine.
        </h2>

        <div className="flex justify-center mb-8">
          <RasStamp size={130} trigger={inView} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <DiagnosticForm id="formulaire-final" variant="full" />

          <a
            href="https://wa.me/212661168354?text=Bonjour%2C%20je%20souhaite%20un%20diagnostic%20RAS%20TVA"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { location: "section-finale" })}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mt-6 transition-colors"
          >
            <MessageCircle size={16} aria-hidden="true" /> Une question rapide ? Écrivez-nous sur WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Barre mobile fixe
───────────────────────────────────────────────────────── */

function MobileStickyBar() {
  const { scrollToForm } = useRasTva();
  const finalFormRef = useRef<HTMLElement | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("formulaire-final");
    if (!el) return;
    finalFormRef.current = el;
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
      {/* Icône WhatsApp à gauche (la bulle ChatBot du site flotte en bas à droite, z-[300]) pour éviter toute collision tactile */}
      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/212661168354?text=Bonjour%2C%20je%20souhaite%20un%20diagnostic%20RAS%20TVA"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter sur WhatsApp"
          onClick={() => track("whatsapp_click", { location: "sticky-mobile-bar" })}
          className="shrink-0 w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center"
        >
          <MessageCircle size={20} className="text-white" aria-hidden="true" />
        </a>
        <button
          onClick={() => scrollToForm("sticky-mobile")}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-ras text-white font-bold py-3 rounded-xl cursor-pointer"
        >
          Réserver mon diagnostic
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Fenêtre de sortie (desktop, une fois par session)
───────────────────────────────────────────────────────── */

function ExitIntentPopup() {
  const { formStarted } = useRasTva();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const shownRef = useRef(false);
  const eligibleRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      eligibleRef.current = true;
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) return; // desktop uniquement
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      if (shownRef.current || !eligibleRef.current || formStarted) return;
      shownRef.current = true;
      setVisible(true);
      track("exit_popup_shown");
    };
    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, [formStarted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProEmail(email)) return;
    const utm = getUtmParams();
    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_RASTVA_LEADS_URL!, {
        method: "POST",
        body: JSON.stringify({
          email,
          type: "checklist",
          source: "landing-ras-tva",
          ...utm,
          page_url: window.location.href,
          horodatage: new Date().toISOString(),
        }),
      });
    } catch (_) {
      // silencieux
    }
    track("exit_popup_submit");
    setSent(true);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Recevoir la check-list des contrôles RAS TVA"
        className="fixed inset-0 z-[200] hidden lg:flex items-center justify-center p-4"
        onClick={() => setVisible(false)}
      >
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setVisible(false)}
            aria-label="Fermer"
            className="absolute top-4 right-4 text-slate-400 hover:text-primary cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>

          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={28} className="text-ras mx-auto mb-3" aria-hidden="true" />
              <p className="font-bold text-primary">C&apos;est envoyé !</p>
              <p className="text-sm text-secondary mt-1">Vérifiez votre boîte mail.</p>
            </div>
          ) : (
            <>
              <p className="font-bold text-primary mb-1.5">Pas le temps maintenant ?</p>
              <p className="text-sm text-secondary mb-4">
                Recevez la check-list des 10 contrôles avant paiement par email.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <label htmlFor="exit-email" className="sr-only">Email professionnel</label>
                <input
                  id="exit-email"
                  type="email"
                  required
                  placeholder="Email professionnel"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none"
                />
                <button type="submit" className="bg-ras text-white font-bold text-sm px-4 rounded-lg cursor-pointer hover:bg-ras-dark">
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────── */

export default function RasTvaClient() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [form, setForm] = useState<FormFields>({
    situation: "",
    erp: "",
    echeance: "",
    nom: "",
    fonction: "",
    entreprise: "",
    email: "",
    telephone: "",
    consentement: false,
    website: "",
  });
  const [formStep, setFormStep] = useState<0 | 1>(0);
  const [formStarted, setFormStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [profile, setProfileState] = useState<Situation>("");
  const [montantSimule, setMontantSimule] = useState(1_000_000);
  const [retenueAnnuelleSimulee, setRetenueAnnuelleSimulee] = useState(1_800_000);
  const [scoreJeu, setScoreJeu] = useState<number | null>(null);

  const setField = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    if (!formStarted) {
      setFormStarted(true);
      track("form_start");
    }
    setForm((f) => ({ ...f, [key]: value }));
  };

  const setProfile = (p: Situation) => {
    setProfileState(p);
    setForm((f) => ({ ...f, situation: f.situation || p }));
  };

  const goToStep = (step: 0 | 1) => {
    setFormStep(step);
    if (step === 1) track("form_step1_complete");
  };

  const scrollToForm = (origin: string) => {
    track("cta_click", { origin });
    // Desktop : carte collante du hero. Mobile : pas de formulaire dans le hero → on vise le formulaire complet de la section finale.
    const targetId = window.innerWidth >= 1024 ? "formulaire-hero" : "formulaire-final";
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
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
      score_jeu: scoreJeu,
      profil: profile,
      ...utm,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      horodatage: new Date().toISOString(),
      source: "landing-ras-tva",
      type: "lead",
    };

    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_RASTVA_LEADS_URL!, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setLoading(false);
      const prenom = encodeURIComponent(form.nom.trim().split(" ")[0] || "");
      router.push(`/lp/ras-tva/merci?prenom=${prenom}`);
    } catch (_) {
      // En cas d'échec réseau : on garde les données saisies et on propose le repli WhatsApp, sans faire croire à un envoi réussi.
      setLoading(false);
      setErrorMsg("La connexion a été interrompue. Vos informations sont conservées — réessayez, ou écrivez-nous directement sur WhatsApp ci-dessous.");
    }
  };

  const ctxValue: RasTvaContextValue = {
    form,
    setField,
    formStep,
    goToStep,
    loading,
    errorMsg,
    handleSubmit,
    scrollToForm,
    profile,
    setProfile,
    montantSimule,
    setMontantSimule,
    retenueAnnuelleSimulee,
    setRetenueAnnuelleSimulee,
    scoreJeu,
    setScoreJeu,
    formStarted,
  };

  return (
    <RasTvaContext.Provider value={ctxValue}>
      <main className="overflow-x-hidden bg-bg pb-20 lg:pb-0">
        {/* ── HEADER MINIMAL — pas de menu principal, juste le logo + CTA ── */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <CountdownBar />
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

        <ProfileSection />
        <SimulatorSection />
        <InvoiceErrorGame />
        <BeforeAfterSection />
        <HowItWorksSection />
        <SageChoiceSection />
        <TimelineSection />
        <ProofSection />
        <FaqSection />
        <FinalCtaSection />
        <Footer />
      </main>

      <MobileStickyBar />
      <ExitIntentPopup />
    </RasTvaContext.Provider>
  );
}
