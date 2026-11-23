"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Building2,
  Calculator,
  CheckCircle2,
  Mail,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Suivi (GA4) — même helper que les autres landing pages
───────────────────────────────────────────────────────── */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }
}

function scrollToId(id: string, origin?: string) {
  if (origin) track("cta_click", { origin });
  if (typeof window === "undefined") return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
}

/* ─────────────────────────────────────────────────────────
   Validation — mêmes règles que les autres formulaires du site
───────────────────────────────────────────────────────── */

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

type FormFields = {
  nom: string;
  fonction: string;
  entreprise: string;
  email: string;
  telephone: string;
  consentement: boolean;
  website: string; // honeypot
};

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
   Données
───────────────────────────────────────────────────────── */

const navItems = [
  { id: "hero", label: "Accueil" },
  { id: "lieu", label: "Lieu" },
  { id: "programme", label: "Programme" },
  { id: "videos", label: "Vidéos" },
  { id: "contact", label: "Contact" },
];

const lieuGalleryImages = [
  { src: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1795193890/le-carre-dor-1_yr45pd.webp", alt: "Le Carré d'Or — photo 1" },
  { src: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1795193890/le-carre-dor-2_oc5gkg.webp", alt: "Le Carré d'Or — photo 2" },
  { src: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1795193890/le-carre-dor-3_ujeo19.webp", alt: "Le Carré d'Or — photo 3" },
  { src: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1795193890/le-carre-dor-4_ketqei.webp", alt: "Le Carré d'Or — photo 4" },
  { src: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1795193890/le-carre-dor-6_cvzu3c.webp", alt: "Le Carré d'Or — photo 5" },
  { src: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1795193890/le-carre-dor-5_iicg1h.webp", alt: "Le Carré d'Or — photo 6" },
];

const programmeHighlights = [
  "Une plénière pour comprendre ce qui change et comment vous y préparer",
  "Un atelier au choix selon votre profil, avec démonstrations en live",
  "Des échanges directs avec nos experts, nos partenaires et d'autres dirigeants",
  "Un cocktail de clôture pour prolonger les échanges",
];

const segments = [
  {
    icon: Building2,
    title: "PME",
    desc: "Sage 100 change de dimension et ne vous aura jamais autant ressemblé.",
  },
  {
    icon: TrendingUp,
    title: "Grandes entreprises & ETI",
    desc: "L'IA au cœur de votre ERP pour piloter toute votre organisation.",
  },
  {
    icon: Users,
    title: "RH",
    desc: "Factorial : la plateforme RH qui centralise, automatise et fait grandir vos équipes.",
  },
  {
    icon: Calculator,
    title: "Experts-comptables",
    desc: "En avant-première : la nouvelle offre Sage pensée pour les cabinets.",
  },
];

const dérouléEvenement = [
  {
    time: "14h30 – 15h00",
    title: "Accueil & café de bienvenue",
    desc: "L'occasion de rencontrer l'équipe Thalès Informatique et les autres participants.",
  },
  {
    time: "15h00 – 16h00",
    title: "IA & facturation électronique : ne subissez pas le changement, pilotez-le",
    desc: "Les enjeux de la réforme de la facturation électronique au Maroc, expliqués simplement.",
  },
  {
    time: "16h00 – 17h00",
    title: "Ateliers thématiques au choix",
    desc: "Quatre ateliers organisés selon votre profil et vos priorités.",
  },
  {
    time: "17h00 – 18h00",
    title: "Cocktail de clôture & networking",
    desc: "Partagez les échanges avec notre équipe, nos partenaires et les autres participants.",
  },
];

/* ─────────────────────────────────────────────────────────
   Header
───────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" aria-label="Thalès Informatique" className="flex items-center shrink-0">
          <img
            src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png"
            alt="Thalès Informatique"
            width={149}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        <nav aria-label="Sections de la page" className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToId(item.id)}
              className="text-sm font-semibold text-secondary hover:text-cta transition-colors cursor-pointer whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => scrollToId("inscription", "header")}
          className="inline-flex items-center gap-1.5 bg-cta text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-cta-hover transition-colors cursor-pointer shrink-0"
        >
          Inscription <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-primary via-cta to-accent pt-14 pb-24 sm:pt-16 sm:pb-28">
      <div className="hidden lg:block absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1795426574/Mosqu%C3%A9e_Hassan_II_au_coucher_du_soleil_vb7yde.webp"
          alt=""
          className="absolute top-0 right-0 w-[55%] h-full object-cover object-center"
          style={{
            maskImage: "radial-gradient(circle at top right, black 30%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle at top right, black 30%, transparent 72%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/30 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <FadeIn>
          <span className="inline-block bg-white/15 text-white text-[11px] font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            Thalès Informatique × Sage
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3 max-w-2xl">Sage Africa Tour</h1>
          <p className="text-lg sm:text-xl text-white/85 mb-6 max-w-xl">
            Casablanca 2026 — IA &amp; facturation électronique : prenez une longueur d&apos;avance.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90 text-sm font-semibold mb-8">
            <span className="flex items-center gap-2">
              <Calendar size={16} aria-hidden="true" /> Mardi 08 décembre 2026
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} aria-hidden="true" /> Le Carré d&apos;Or, Casablanca
            </span>
          </div>
          <button
            onClick={() => scrollToId("inscription", "hero")}
            className="inline-flex items-center gap-2 bg-white text-cta font-bold px-7 py-4 rounded-xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer shadow-lg"
          >
            Je réserve ma place <ArrowRight size={18} aria-hidden="true" />
          </button>
        </FadeIn>
      </div>

      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" fill="#ffffff" />
      </svg>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Intro + formulaire d'inscription
───────────────────────────────────────────────────────── */

function RegistrationForm({
  id,
  form,
  setField,
  loading,
  errorMsg,
  handleSubmit,
}: {
  id?: string;
  form: FormFields;
  setField: <K extends keyof FormFields>(key: K, value: FormFields[K]) => void;
  loading: boolean;
  errorMsg: string;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  const fieldClass =
    "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-primary text-sm placeholder:text-slate-400 focus:border-cta focus:ring-1 focus:ring-cta outline-none";

  return (
    <div id={id} className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-7">
      <h3 className="text-base font-bold text-primary mb-3">Sage Africa Tour Casablanca 2026</h3>
      <div className="space-y-1.5 text-sm text-secondary mb-4">
        <p className="flex items-center gap-2">
          <Calendar size={14} className="text-cta shrink-0" aria-hidden="true" /> Mardi 08 décembre 2026
        </p>
        <p className="flex items-center gap-2">
          <Clock size={14} className="text-cta shrink-0" aria-hidden="true" /> 14h30 – 18h00
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={14} className="text-cta shrink-0" aria-hidden="true" /> Le Carré d&apos;Or, Casablanca
        </p>
      </div>
      <span className="inline-block bg-cta/10 text-cta text-xs font-bold px-3 py-1.5 rounded-full mb-5">Gratuit · Places limitées</span>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="website-sat">Site web</label>
          <input id="website-sat" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setField("website", e.target.value)} />
        </div>

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
        <select
          aria-label="Votre fonction"
          required value={form.fonction} onChange={(e) => setField("fonction", e.target.value)}
          className={fieldClass}
        >
          <option value="">Fonction *</option>
          {["Dirigeant / DG", "DAF / RAF", "DSI", "DRH", "Expert-comptable", "Autre"].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <input
          type="tel" placeholder="Téléphone *" required value={form.telephone}
          onChange={(e) => setField("telephone", e.target.value)}
          className={fieldClass}
        />
        <input
          type="email" placeholder="Email professionnel *" required value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          className={fieldClass}
        />

        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox" required checked={form.consentement}
            onChange={(e) => setField("consentement", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-cta focus:ring-cta focus:ring-1 cursor-pointer"
          />
          <span className="text-xs text-secondary leading-relaxed">
            J&apos;accepte que Thalès Informatique utilise ces informations pour confirmer mon inscription, conformément à la loi 09-08. Voir la{" "}
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
          className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-cta-hover transition-colors duration-200 disabled:opacity-60 cursor-pointer"
        >
          {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          {loading ? "Envoi en cours..." : "Je réserve ma place"}
          {!loading && <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </form>
    </div>
  );
}

function IntroSection(props: {
  form: FormFields;
  setField: <K extends keyof FormFields>(key: K, value: FormFields[K]) => void;
  loading: boolean;
  errorMsg: string;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-start">
          <FadeIn>
            <p className="text-xs font-bold text-cta uppercase tracking-widest mb-3">Sage Africa Tour · Casablanca 2026</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 leading-tight">
              IA &amp; facturation électronique : prenez une longueur d&apos;avance
            </h2>
            <p className="text-secondary leading-relaxed mb-5">
              Automatiser les tâches qui vous font perdre du temps, piloter votre activité en temps réel, être prêt pour la facturation
              électronique : et si c&apos;était plus simple que vous ne le pensez ?
            </p>
            <p className="text-secondary leading-relaxed mb-6">
              En un après-midi, découvrez comment l&apos;IA et la réforme de la facturation électronique peuvent devenir des leviers de
              croissance pour votre entreprise, quelle que soit sa taille.
            </p>

            <h3 className="text-base font-bold text-primary mb-3">Au programme :</h3>
            <ul className="space-y-2.5 mb-6">
              {programmeHighlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-secondary leading-relaxed">
                  <CheckCircle2 size={16} className="text-cta mt-0.5 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-3 mb-6">
              {segments.map((seg) => (
                <div key={seg.title} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-cta/10 flex items-center justify-center shrink-0">
                    <seg.icon size={16} className="text-cta" aria-hidden="true" />
                  </span>
                  <p className="text-sm text-secondary leading-relaxed">
                    <span className="font-bold text-primary">{seg.title}</span> — {seg.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm text-secondary leading-relaxed mb-2">
              Pour qui ? Dirigeants, DAF, DSI, DRH et experts comptables, que vous soyez déjà client Sage ou non.
            </p>
            <p className="text-sm font-bold text-primary">Inscrivez-vous dès maintenant, les places sont limitées !</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="lg:sticky lg:top-24">
              <RegistrationForm id="inscription" {...props} />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Programme
───────────────────────────────────────────────────────── */

function ProgrammeSection() {
  return (
    <section id="programme" className="py-16 lg:py-20 bg-cta">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">Programme</h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-6">
          <FadeIn delay={0.05}>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full">
              <h3 className="text-xs font-bold text-cta uppercase tracking-widest mb-5">Déroulé de l&apos;événement</h3>
              <ol className="space-y-5">
                {dérouléEvenement.map((item) => (
                  <li key={item.time}>
                    <p className="text-sm font-bold text-cta mb-1">{item.time}</p>
                    <p className="text-sm font-semibold text-primary mb-1 leading-snug">{item.title}</p>
                    <p className="text-xs text-secondary leading-relaxed">{item.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full">
              <h3 className="text-xs font-bold text-cta uppercase tracking-widest mb-5">Ateliers au choix</h3>
              <div className="space-y-5">
                {segments.map((seg) => (
                  <div key={seg.title}>
                    <p className="text-sm font-bold text-primary mb-1">{seg.title}</p>
                    <p className="text-xs text-secondary leading-relaxed">{seg.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
        <p className="text-center text-sm text-white mt-8">
          Les quatre ateliers ont lieu en même temps : vous choisissez le vôtre lors de l&apos;inscription.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Vidéos
───────────────────────────────────────────────────────── */

function VideosSection() {
  return (
    <section id="videos" className="py-16 lg:py-20 bg-amber-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Revivez les meilleurs moments du Sage Africa Tour</h2>
          <p className="text-secondary mb-10">Ambiance, intervenants, démonstrations : le temps fort de l&apos;édition précédente en vidéo.</p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <iframe
              title="Sage Africa Tour — temps forts de l'édition précédente"
              src="https://www.youtube.com/embed/TMpRiiIBqak"
              className="w-full h-full border-0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Lieu
───────────────────────────────────────────────────────── */

function circularOffset(index: number, current: number, total: number) {
  let offset = index - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function LieuSection() {
  const [current, setCurrent] = useState(0);
  const total = lieuGalleryImages.length;

  const goTo = (index: number) => setCurrent(((index % total) + total) % total);

  return (
    <section id="lieu" className="py-16 lg:py-20 bg-cta overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <span className="inline-flex items-center gap-2 border border-white/40 rounded-full px-5 py-2 text-white font-bold text-sm mb-6">
            <MapPin size={16} aria-hidden="true" /> Casablanca
          </span>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="hidden sm:block h-px w-10 bg-white/40" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Le lieu de l&apos;événement</h2>
            <span className="hidden sm:block h-px w-10 bg-white/40" />
          </div>
          <p className="text-white/85 max-w-xl mx-auto mb-10">
            Le Carré d&apos;Or vous accueille dans un cadre moderne et raffiné, offrant les meilleures conditions pour des échanges, des
            démonstrations et un networking de qualité.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="relative h-[340px] sm:h-[440px] lg:h-[600px] flex items-center justify-center">
            {lieuGalleryImages.map((img, i) => {
              const offset = circularOffset(i, current, total);
              const abs = Math.abs(offset);
              const hidden = abs > 2;
              const scale = abs === 0 ? 1 : abs === 1 ? 0.78 : 0.6;
              const rotate = abs === 0 ? 0 : (offset > 0 ? 1 : -1) * (abs === 1 ? 8 : 14);
              const opacity = hidden ? 0 : abs === 0 ? 1 : abs === 1 ? 0.9 : 0.55;

              return (
                <div
                  key={img.src}
                  className="absolute rounded-2xl overflow-hidden border-4 border-white shadow-2xl transition-all duration-500 ease-out"
                  style={{
                    width: "min(82%, 640px)",
                    aspectRatio: "4 / 3",
                    transform: `translateX(${offset * 58}%) scale(${scale}) rotate(${rotate}deg)`,
                    zIndex: 10 - abs,
                    opacity,
                    pointerEvents: offset === 0 ? "auto" : "none",
                  }}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label="Photo précédente"
              className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center cursor-pointer hover:bg-white/25 transition-colors"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label="Photo suivante"
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center cursor-pointer hover:bg-white/25 transition-colors"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </FadeIn>

        <div className="flex items-center justify-center mt-6">
          {lieuGalleryImages.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Aller à la photo ${i + 1}`}
              aria-pressed={current === i}
              className="p-2 cursor-pointer"
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition-colors ${current === i ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocalisationSection() {
  return (
    <section id="localisation" className="py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Comment s&apos;y rendre</h2>
          <h3 className="text-base font-bold text-primary mb-2">Sage Africa Tour Casablanca — Le Carré d&apos;Or</h3>
          <p className="text-sm text-secondary leading-relaxed mb-1">
            <strong className="text-primary">Date :</strong> Mardi 08 décembre 2026, de 14h30 à 18h00
          </p>
          <p className="text-sm text-secondary leading-relaxed mb-8">
            <strong className="text-primary">Lieu :</strong> Le Carré d&apos;Or – Angle route de l&apos;Oasis et rue Zanzibar, Oasis, 20000
            Casablanca, Maroc
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="w-full rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] sm:aspect-video lg:aspect-[21/9]">
            <iframe
              title="Localisation — Le Carré d'Or, Casablanca"
              src="https://www.google.com/maps?q=Le+Carr%C3%A9+d%27Or+Casablanca&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>

        <div className="mt-10">
          <p className="text-secondary mb-4">Inscrivez-vous pour réserver votre place. À très vite !</p>
          <button
            onClick={() => scrollToId("inscription", "lieu")}
            className="inline-flex items-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-cta-hover transition-colors cursor-pointer"
          >
            Inscription <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Contact
───────────────────────────────────────────────────────── */

function ContactSection() {
  return (
    <section id="contact" className="py-16 lg:py-20 bg-white">
      <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <span className="w-14 h-14 rounded-full bg-cta/10 flex items-center justify-center mx-auto mb-5">
            <Mail size={22} className="text-cta" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-bold text-primary mb-2">Contact</h2>
          <p className="text-secondary mb-5">Avez-vous une question sur l&apos;événement ?</p>
          <p className="text-sm text-secondary mb-6">
            Contactez-nous : <a href="mailto:contact@thales.ma" className="text-cta font-semibold hover:underline">contact@thales.ma</a>
          </p>
          <a
            href="tel:+212522548780"
            className="inline-flex items-center gap-2 border border-slate-200 text-primary font-semibold px-6 py-3 rounded-xl hover:border-cta/40 hover:bg-cta/5 transition-colors"
          >
            <Phone size={16} aria-hidden="true" /> +212 5 22 54 87 80
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Footer — version allégée dédiée aux landing pages
───────────────────────────────────────────────────────── */

function LpFooter() {
  return (
    <footer className="bg-primary border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">
        <img
          src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_blanc_petit_abarsy.png"
          alt="Thalès Informatique"
          className="h-8 w-auto mx-auto mb-4"
        />
        <p className="text-white/50 text-xs">© {new Date().getFullYear()} Thalès Informatique. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────
   Barre mobile fixe
───────────────────────────────────────────────────────── */

function MobileStickyBar() {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("inscription");
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
        onClick={() => scrollToId("inscription", "sticky-mobile")}
        className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold py-3 rounded-xl cursor-pointer"
      >
        Je réserve ma place
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────── */

export default function SageAfricaTourClient() {
  const router = useRouter();

  const [form, setForm] = useState<FormFields>({
    nom: "", fonction: "", entreprise: "", email: "", telephone: "", consentement: false, website: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const setField = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
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
      evenement: "Sage Africa Tour Casablanca 2026",
      date_evenement: "2026-12-08",
      ...utm,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      horodatage: new Date().toISOString(),
      source: "landing-sage-africa-tour",
    };

    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_SAGEAFRICATOUR_URL!, { method: "POST", body: JSON.stringify(payload) });
      track("generate_lead", { campaign: "sage-africa-tour" });
      setLoading(false);
      router.push("/lp/sage-africa-tour/merci");
    } catch (_) {
      setLoading(false);
      setErrorMsg("La connexion a été interrompue. Vos informations sont conservées — réessayez dans un instant.");
    }
  };

  const formProps = { form, setField, loading, errorMsg, handleSubmit };

  return (
    <main className="overflow-x-hidden bg-bg pb-20 lg:pb-0">
      <Header />
      <Hero />
      <IntroSection {...formProps} />
      <LieuSection />
      <LocalisationSection />
      <ProgrammeSection />
      <VideosSection />
      <ContactSection />
      <LpFooter />
      <MobileStickyBar />
    </main>
  );
}
