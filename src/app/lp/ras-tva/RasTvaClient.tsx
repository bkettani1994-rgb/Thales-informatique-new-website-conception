"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Check,
  ChevronDown,
  Briefcase,
  UserCog,
  Calculator,
  FilePlus2,
  FileCheck2,
  Cog,
  Settings,
  RefreshCcw,
  Clock,
  Users,
  User,
  Zap,
  Quote,
  Calendar,
  X,
  Loader2,
  Trophy,
  Building2,
  TrendingUp,
  Landmark,
} from "lucide-react";
import { faqs, SEUIL_DATE_ISO } from "./data";

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


/* ─────────────────────────────────────────────────────────
   Bandeau d'annonce — compte à rebours jusqu'au palier 350 MDH
───────────────────────────────────────────────────────── */

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function useCountdown(targetISO: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  return timeLeft;
}

function AnnounceBar() {
  const { scrollToForm } = useRasTva();
  const [dismissed, setDismissed] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(SEUIL_DATE_ISO);

  if (dismissed) return null;

  return (
    <div className="relative bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 pr-10 sm:pr-12 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-center">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Calendar size={14} className="text-accent shrink-0" aria-hidden="true" />
          Palier des 350 MDH le 1er janvier 2027
        </span>
        <span className="inline-flex items-center gap-1 font-mono font-bold tabular-nums" aria-live="off">
          <span className="bg-white/10 rounded px-1.5 py-0.5">{days}j</span>
          <span className="hidden sm:inline bg-white/10 rounded px-1.5 py-0.5">{String(hours).padStart(2, "0")}h</span>
          <span className="hidden sm:inline bg-white/10 rounded px-1.5 py-0.5">{String(minutes).padStart(2, "0")}m</span>
          <span className="hidden sm:inline bg-white/10 rounded px-1.5 py-0.5">{String(seconds).padStart(2, "0")}s</span>
        </span>
        <span className="hidden sm:inline text-white/40">·</span>
        <span className="font-semibold">Thalès Informatique a la solution prête.</span>
        <button
          onClick={() => scrollToForm("announce-bar")}
          className="font-bold underline underline-offset-2 hover:text-accent transition-colors cursor-pointer"
        >
          Réserver ma démo
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer le bandeau"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 1 — Hero
───────────────────────────────────────────────────────── */

const trustItems = [
  { icon: Clock, text: "20 minutes en visio" },
  { icon: CheckCircle2, text: "Gratuit sans engagement" },
  { icon: Users, text: "Avec un consultant Thalès Informatique" },
];

const HERO_BG = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1791974265/Facture_R.A.S._dans_un_bureau_moderne_thales_informatique_ua4fvp.webp";

function Hero() {
  const { scrollToForm } = useRasTva();

  return (
    <section className="relative overflow-hidden min-h-[560px] sm:min-h-[600px] lg:min-h-[640px] flex items-center bg-primary" id="hero">
      <img
        src={HERO_BG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-right"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/40 sm:via-primary/55 sm:to-primary/10" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20 w-full">
        <FadeIn>
          <div className="max-w-xl">
            <span className="inline-block bg-white text-primary text-[11px] font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
              DAF · RAF · COMPTABLES
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mb-5">
              La RAS TVA, calculée automatiquement. <span className="text-accent">Sans aucune saisie.</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-5 max-w-lg">
              Intégrée à votre logiciel de gestion, la retenue se calcule à chaque facture. Votre équipe ne saisit rien de plus.
            </p>

            <div className="inline-flex items-center gap-2 bg-white text-[#9A3412] text-xs font-semibold rounded-full px-4 py-2 mb-6">
              <Calendar size={14} aria-hidden="true" /> Palier de 350 MDH le 1er janvier 2027
            </div>

            <div>
              <button
                onClick={() => scrollToForm("hero")}
                className="inline-flex items-center gap-2 bg-cta text-white font-bold px-7 py-4 rounded-xl hover:bg-cta-hover transition-colors duration-200 cursor-pointer"
              >
                Réserver ma démo de 20 min <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
              {trustItems.map((t) => (
                <li key={t.text} className="flex items-center gap-1.5 text-xs font-medium text-white/75">
                  <t.icon size={14} className="text-accent" aria-hidden="true" /> {t.text}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   « Ce que vous ne ferez plus » — la preuve par métier
───────────────────────────────────────────────────────── */

// Triptyque unique : un visuel large découpé en 3 (CSS background-position), un tiers par carte.
const TRIPTYQUE_URL = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1791990853/Triptyque_bureautique_aux_accents_bleus_iv5c5p.webp";

const noMoreTasksColumns = [
  {
    role: "DAF",
    icon: Briefcase,
    tasks: [
      "Vous demander si l'équipe applique le bon calcul",
      "Ajouter une nouvelle contrainte au planning de l'équipe",
      "Gérer un outil de plus",
    ],
  },
  {
    role: "RAF",
    icon: UserCog,
    tasks: [
      "Tenir un fichier Excel de suivi à côté",
      "Contrôler les montants ressaisis",
    ],
  },
  {
    role: "Comptable",
    icon: Calculator,
    tasks: [
      "Calculer la retenue à la main",
      "Ressaisir le montant dans la comptabilité",
      "Vérifier le net à payer à la calculatrice",
    ],
  },
];

const noMoreTasksBenefits = ["Plus de temps", "Plus de fiabilité", "Plus de sérénité"];

/** Une tâche barrée en direct : le trait se dessine quand la ligne entre dans l'écran. */
function StrikeTask({ text, delay }: { text: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <motion.li
      ref={ref}
      initial={reduced ? false : { opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="flex items-start gap-3"
    >
      <motion.span
        initial={reduced ? false : { scale: 0, rotate: -40 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.35, delay: delay + 0.1, type: "spring", stiffness: 400, damping: 15 }}
        className="mt-0.5 w-5 h-5 rounded-full bg-cta flex items-center justify-center shrink-0"
      >
        <Check size={12} className="text-white" aria-hidden="true" />
      </motion.span>
      {/* Barré natif (gère correctement le retour à la ligne) */}
      <span className="text-sm text-primary leading-relaxed line-through decoration-cta decoration-2">{text}</span>
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────
   Calendrier des paliers
───────────────────────────────────────────────────────── */

const paliers = [
  {
    date: "1er juillet 2026",
    seuil: "≥ 500 MDH",
    desc: "Établissements de crédit, Banques, Assurances et Réassurances (sans condition de CA).",
    active: false,
  },
  {
    date: "1er janvier 2027",
    seuil: "≥ 350 MDH",
    desc: "Continuité des secteurs financiers précités.",
    active: true,
  },
  {
    date: "1er janvier 2028",
    seuil: "≥ 200 MDH",
    desc: "Continuité des secteurs financiers précités.",
    active: false,
  },
];

function PaliersSection() {
  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-cta rounded-full" aria-hidden="true" />
            <p className="text-xs font-bold text-cta uppercase tracking-widest">Calendrier des paliers</p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
            <span className="text-primary">Une application progressive</span>
            <br />
            <span className="text-cta">selon votre chiffre d&apos;affaires.</span>
          </h2>
          <p className="text-secondary leading-relaxed max-w-2xl mx-auto mb-12">
            L&apos;extension du mécanisme de la RAS (qui impose à l&apos;entreprise cliente de retenir et reverser la taxe sur les
            prestations de services rendues par des personnes morales) s&apos;applique de manière progressive selon la taille de
            l&apos;entreprise.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
          {paliers.map((p, i) => (
            <FadeIn key={p.date} delay={i * 0.1}>
              <div
                className={`relative rounded-2xl p-6 h-full text-left sm:text-center ${
                  p.active ? "bg-cta/5 border-2 border-cta" : "bg-bg border border-slate-200"
                }`}
              >
                {p.active && (
                  <>
                    <span className="sm:hidden inline-block bg-cta text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3">
                      Prochain palier concerné
                    </span>
                    <span className="hidden sm:inline-block absolute -top-4 left-1/2 -translate-x-1/2 bg-cta text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                      Prochain palier concerné
                    </span>
                  </>
                )}
                <p className="text-sm font-semibold text-primary mb-1">{p.date}</p>
                <p className={`text-3xl font-black mb-3 ${p.active ? "text-cta" : "text-primary"}`}>{p.seuil}</p>
                <div className="w-8 h-0.5 bg-cta/40 mb-3 sm:mx-auto" />
                <p className="text-xs text-secondary leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="hidden sm:block relative mt-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" aria-hidden="true" />
          <div className="absolute top-1/2 left-0 h-0.5 bg-cta -translate-y-1/2" style={{ width: "50%" }} aria-hidden="true" />
          <div className="relative grid grid-cols-3">
            {paliers.map((p) => (
              <div key={p.date} className="flex justify-center">
                <span
                  className={
                    p.active
                      ? "w-6 h-6 rounded-full bg-cta ring-4 ring-cta/20 border-2 border-white"
                      : "w-4 h-4 rounded-full bg-white border-2 border-cta"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Logiciels concernés — Sage 100 / X3 / FRP 1000
───────────────────────────────────────────────────────── */

const erpSolutions = [
  {
    name: "Sage 100",
    icon: Building2,
    audience: "PME",
    desc: "Pour les petites et moyennes entreprises qui structurent leur gestion.",
  },
  {
    name: "Sage X3",
    icon: TrendingUp,
    audience: "ETI et grandes entreprises",
    desc: "Pour les entreprises en croissance aux besoins multi-sites ou multi-activités.",
  },
  {
    name: "Sage FRP 1000",
    icon: Landmark,
    audience: "Groupes et secteur public",
    desc: "Pour les grands groupes et organismes publics aux exigences de gestion complexes.",
  },
];

function ErpSection() {
  return (
    <section className="py-16 lg:py-20 bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-cta rounded-full" aria-hidden="true" />
            <p className="text-xs font-bold text-cta uppercase tracking-widest">Logiciels concernés</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Le module RAS TVA s&apos;intègre à votre Sage.
          </h2>
          <p className="text-secondary max-w-2xl mx-auto mb-10">
            Quelle que soit la taille de votre entreprise, la retenue à la source se calcule directement dans votre logiciel de gestion actuel.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5">
          {erpSolutions.map((erp, i) => (
            <FadeIn key={erp.name} delay={i * 0.1}>
              <div className="card-hover bg-white rounded-2xl border border-slate-200 h-full p-6 text-left">
                <span className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center mb-4">
                  <erp.icon size={22} className="text-cta" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-black text-primary mb-1">{erp.name}</h3>
                <p className="text-xs font-bold text-cta uppercase tracking-wide mb-3">{erp.audience}</p>
                <p className="text-sm text-secondary leading-relaxed">{erp.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoMoreTasksSection() {
  return (
    <section className="py-16 lg:py-20 bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-cta rounded-full" aria-hidden="true" />
            <p className="text-xs font-bold text-cta uppercase tracking-widest">Ce que vous ne ferez plus</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            <span className="text-primary">Fini les tâches manuelles </span>
            <span className="text-cta">liées à la RAS TVA.</span>
          </h2>
          <p className="text-secondary text-center mb-10">
            Une solution qui vous fait gagner du temps, de la fiabilité et de la sérénité.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-5 mb-6">
          {noMoreTasksColumns.map((col, i) => (
            <FadeIn key={col.role} delay={i * 0.1}>
              <div className="card-hover relative bg-white rounded-2xl border border-slate-200 h-full overflow-hidden">
                <div className="relative z-10 p-5 pr-[38%] sm:pr-[36%]">
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="w-11 h-11 rounded-full bg-cta flex items-center justify-center shrink-0">
                      <col.icon size={18} className="text-white" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold text-secondary uppercase tracking-widest leading-none mb-1">Vous êtes</p>
                      <p className="text-base font-black text-primary leading-none">{col.role}</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {col.tasks.map((t, j) => (
                      <StrikeTask key={t} text={t} delay={0.15 + j * 0.15} />
                    ))}
                  </ul>
                </div>

                <div
                  className="absolute inset-y-0 right-0 w-[38%] sm:w-[36%] bg-slate-300"
                  style={{
                    clipPath: "polygon(45% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    backgroundImage: `url(${TRIPTYQUE_URL})`,
                    backgroundSize: "300% 100%",
                    backgroundPosition: `${i * 50}% center`,
                  }}
                  aria-hidden="true"
                />
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 bg-cta/10 rounded-2xl px-6 py-5">
            <div className="flex items-center gap-3">
              <Cog size={22} className="text-cta" aria-hidden="true" />
              <p className="text-base sm:text-lg font-bold text-primary">
                Saisies manuelles : <span className="relative text-3xl font-black text-cta">0<Zap size={16} className="absolute -right-4 -top-1 text-cta" aria-hidden="true" /></span>
              </p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-cta/20" aria-hidden="true" />
            <div className="flex items-center divide-x divide-cta/20">
              {noMoreTasksBenefits.map((b) => (
                <span key={b} className="flex items-center gap-1.5 px-4 first:pl-0 text-sm font-semibold text-primary whitespace-nowrap">
                  <CheckCircle2 size={16} className="text-cta" aria-hidden="true" /> {b}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Comment ça marche — 3 étapes
───────────────────────────────────────────────────────── */

const steps = [
  {
    num: "01",
    icon: FilePlus2,
    title: "Vous saisissez la facture",
    desc: "Comme d'habitude, dans votre logiciel de gestion.",
  },
  {
    num: "02",
    icon: Calculator,
    title: "La retenue est calculée automatiquement",
    desc: "Au moment de la saisie de la facture.",
  },
  {
    num: "03",
    icon: FileCheck2,
    title: "Vous passez à la facture suivante",
    desc: "Aucune ressaisie, aucun fichier à côté.",
  },
] as const;

function StepCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const delay = index * 0.12;

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="relative flex-1"
    >
      <span className="absolute -top-5 left-6 z-10 w-11 h-11 rounded-full bg-cta/10 border-4 border-white flex items-center justify-center text-cta font-black text-base">
        {step.num}
      </span>
      <div className="card-hover bg-white border border-slate-200 lg:bg-cta/5 lg:border-cta/15 lg:shadow-sm rounded-2xl lg:rounded-none pt-10 px-8 lg:pr-16 pb-7 h-full lg:[clip-path:polygon(0%_0%,88%_0%,100%_50%,88%_100%,0%_100%)]">
        <span className="inline-flex w-14 h-14 rounded-full bg-cta/10 items-center justify-center mb-4">
          <step.icon size={24} className="text-cta" aria-hidden="true" />
        </span>
        <h3 className="text-base font-bold text-primary leading-snug mb-2 lg:min-h-11">{step.title}</h3>
        <div className="w-8 h-0.5 bg-cta/40 mb-2.5" aria-hidden="true" />
        <p className="text-sm text-secondary leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

function StepArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center shrink-0 w-14" aria-hidden="true">
      <span className="flex-1 border-t-2 border-dashed border-cta/30" />
      <span className="mx-1 w-9 h-9 rounded-full bg-cta/10 flex items-center justify-center shrink-0">
        <ArrowRight size={14} className="text-cta" aria-hidden="true" />
      </span>
      <span className="flex-1 border-t-2 border-dashed border-cta/30" />
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-20 bg-white" id="comment-ca-marche">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-cta rounded-full" aria-hidden="true" />
            <p className="text-xs font-bold text-cta uppercase tracking-widest">Comment ça marche ?</p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center leading-tight mb-4">
            <span className="text-primary">3 étapes simples,</span>
            <br />
            <span className="text-cta">zéro ressaisie.</span>
          </h2>
          <p className="text-secondary text-center max-w-2xl mx-auto mb-14">
            La RAS TVA se calcule automatiquement dans votre logiciel de gestion, au moment de la saisie de la facture.
          </p>
        </FadeIn>

        <div className="flex flex-col lg:flex-row items-stretch gap-y-10">
          <StepCard step={steps[0]} index={0} />
          <StepArrow />
          <StepCard step={steps[1]} index={1} />
          <StepArrow />
          <StepCard step={steps[2]} index={2} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Vos questions sur l'intégration
───────────────────────────────────────────────────────── */

const integrationQuestions = [
  {
    icon: Settings,
    q: "Faut-il changer de logiciel ?",
    a: "Non. La solution s'intègre à votre logiciel de gestion actuel.",
  },
  {
    icon: RefreshCcw,
    q: "Et si nous retenons ET subissons la retenue ?",
    a: "Le calcul automatique s'applique sur vos factures concernées.",
  },
  {
    icon: Clock,
    q: "Combien de temps pour être opérationnel ?",
    a: "Le délai d'installation est rapide. Nous vous confirmons le délai lors de la démo.",
  },
  {
    icon: Users,
    q: "Qui nous accompagne ?",
    a: "Les consultants Thalès Informatique, qui installent la solution et forment vos équipes.",
  },
];

function IntegrationQuestionsSection() {
  return (
    <section className="py-16 lg:py-20 bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <p className="text-xs font-bold text-cta uppercase tracking-widest mb-3 text-center">
            DAF · RAF · Comptables
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">
            Une intégration simple, une solution fiable.
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {integrationQuestions.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.08}>
              <div className="card-hover bg-white rounded-2xl border border-slate-200 h-full p-5">
                <span className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center mb-4">
                  <item.icon size={18} className="text-cta" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-bold text-primary mb-1.5 leading-snug">{item.q}</h3>
                <p className="text-xs text-secondary leading-relaxed">{item.a}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Pourquoi Thalès Informatique
───────────────────────────────────────────────────────── */

const proofStats = [
  { icon: Trophy, value: "30 ans", label: "d'expertise" },
  { icon: Cog, value: "Solution", label: "déjà intégrée" },
  { icon: Users, value: "Démo de 20 min", label: "sur votre cas" },
];

function WhySection() {
  return (
    <section className="py-16 lg:py-20 bg-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <p className="text-xs font-bold text-cta uppercase tracking-widest mb-3 text-center sm:text-left">
            Pourquoi Thalès Informatique ?
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left mb-2">
            Un partenaire de confiance, à vos côtés.
          </h2>
          <p className="text-secondary text-center sm:text-left mb-10">
            Une expertise reconnue pour vous accompagner dans vos enjeux comptables et fiscaux.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <FadeIn delay={0.1}>
            <div className="space-y-6">
              {proofStats.map((s) => (
                <div key={s.label} className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center shrink-0">
                    <s.icon size={20} className="text-cta" aria-hidden="true" />
                  </span>
                  <p className="text-base font-bold text-primary">
                    {s.value} <span className="font-normal text-secondary">{s.label}</span>
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
              <Quote size={24} className="text-cta/40 mb-3" aria-hidden="true" />
              <p className="text-primary leading-relaxed mb-5">
                « La solution nous a permis de fiabiliser le calcul de la retenue et de gagner un temps précieux au quotidien. »
              </p>
              <div className="flex items-center gap-3">
                {/* [À VALIDER : photo du témoignage] */}
                <span className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <User size={18} className="text-slate-400" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-primary">Yassine B.</p>
                  <p className="text-xs text-secondary">DAF — Groupe industriel</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Section 6 — Formulaire + FAQ
───────────────────────────────────────────────────────── */

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-white/10 text-white text-sm placeholder:text-white/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none";

function DiagnosticForm({ id }: { id?: string }) {
  const { form, setField, loading, errorMsg, handleSubmit } = useRasTva();

  return (
    <div id={id} className="bg-primary rounded-2xl p-6 sm:p-7">
      <h3 className="text-lg font-bold text-white mb-1">Voyez la RAS TVA se calculer toute seule.</h3>
      <p className="text-white/65 text-sm mb-5 leading-relaxed">20 minutes en visio avec un consultant. Gratuit, sans engagement.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="website">Site web</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setField("website", e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text" placeholder="Nom et prénom *" required value={form.nom}
            onChange={(e) => setField("nom", e.target.value)}
            className={fieldClass}
          />
          <input
            type="text" placeholder="Entreprise *" required value={form.entreprise}
            onChange={(e) => setField("entreprise", e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <select
            aria-label="Votre fonction"
            required value={form.fonction} onChange={(e) => setField("fonction", e.target.value)}
            className={`${fieldClass} [color-scheme:dark]`}
          >
            <option value="" className="text-primary">Fonction *</option>
            {["DAF / RAF", "Chef comptable", "Comptable", "DG", "DSI", "Autre"].map((f) => <option key={f} value={f} className="text-primary">{f}</option>)}
          </select>
          <input
            type="tel" placeholder="Téléphone *" required value={form.telephone}
            onChange={(e) => setField("telephone", e.target.value)}
            className={fieldClass}
          />
        </div>

        <input
          type="email" placeholder="Email professionnel *" required value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          className={fieldClass}
        />

        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox" required checked={form.consentement}
            onChange={(e) => setField("consentement", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/30 bg-white/10 text-cta focus:ring-cta focus:ring-1 cursor-pointer"
          />
          <span className="text-xs text-white/60 leading-relaxed">
            J&apos;accepte que Thalès Informatique utilise ces informations pour me recontacter, conformément à la loi 09-08. Voir la{" "}
            <Link href="/politique-de-confidentialite" className="text-accent underline">politique de confidentialité</Link>.
          </span>
        </label>

        {errorMsg && (
          <p role="alert" className="text-xs text-white bg-signal/80 rounded-lg px-3 py-2">
            {errorMsg}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-cta-hover transition-colors duration-200 disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {loading ? "Envoi en cours..." : "Réserver ma démo de 20 min"}
          {!loading && <ArrowRight size={16} aria-hidden="true" />}
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
            <p className="text-xs font-bold text-cta uppercase tracking-widest mb-3">Vos questions, nos réponses</p>
            <h2 className="text-xl font-bold text-primary mb-5">FAQ</h2>
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

          <FadeIn delay={0.1}>
            <DiagnosticForm id="formulaire-final" />
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
        className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold py-3 rounded-xl cursor-pointer"
      >
        Réserver ma démo de 20 min
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
    nom: "", fonction: "", entreprise: "", email: "", telephone: "", consentement: false, website: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
  };

  return (
    <RasTvaContext.Provider value={ctxValue}>
      <main className="overflow-x-hidden bg-bg pb-20 lg:pb-0">
        <AnnounceBar />
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
              className="inline-flex items-center gap-1.5 bg-cta text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-cta-hover transition-colors cursor-pointer"
            >
              Réserver ma démo <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </header>

        <Hero />
        <PaliersSection />
        <ErpSection />
        <NoMoreTasksSection />
        <HowItWorksSection />
        <IntegrationQuestionsSection />
        <WhySection />
        <FormFaqSection />
        <Footer />
      </main>

      <MobileStickyBar />
    </RasTvaContext.Provider>
  );
}
