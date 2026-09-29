"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import LogoMarquee from "@/components/sections/LogoMarquee";
import Testimonials, { testimonials as allTestimonials } from "@/components/sections/Testimonials";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Send,
  Phone,
  Crown,
  Wallet,
  ServerCog,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  BarChart2,
  Boxes,
  Factory,
  PieChart,
  Landmark,
  Layers,
  GraduationCap,
  LifeBuoy,
  RefreshCw,
  Wrench,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Suivi (GA4 + LinkedIn Insight Tag)
───────────────────────────────────────────────────────── */
declare global {
  interface Window {
    lintrk?: (...args: unknown[]) => void;
  }
}
function track(eventName: string, params?: Record<string, unknown>) {
  trackEvent(eventName, params);
  if (typeof window !== "undefined" && typeof window.lintrk === "function") {
    window.lintrk("track", { conversion_id: eventName });
  }
}

/* ─────────────────────────────────────────────────────────
   Données — modifiables facilement
───────────────────────────────────────────────────────── */

const navLinks = [
  { href: "#pourquoi", label: "Pourquoi Sage 100 ?" },
  { href: "#metiers", label: "Vos métiers" },
  { href: "#modules", label: "Modules" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#faq", label: "FAQ" },
];

const heroBenefits = [
  { icon: Landmark, label: "Finance maîtrisée" },
  { icon: RefreshCw, label: "Processus optimisés" },
  { icon: ShieldCheck, label: "Données sécurisées" },
  { icon: TrendingUp, label: "Croissance durable" },
];

type PersonaKey = "dg" | "daf" | "dsi" | "achats" | "ventes";

const personas: {
  key: PersonaKey;
  label: string;
  fonction: string;
  icon: typeof Crown;
  title: string;
  benefits: string[];
}[] = [
  {
    key: "dg",
    label: "DG",
    fonction: "Directeur Général",
    icon: Crown,
    title: "Pour les Directeurs Généraux",
    benefits: [
      "Vision consolidée de l'activité",
      "Décisions basées sur des données fiables",
      "Meilleure visibilité sur la performance",
      "Alignement des équipes",
      "Accompagnement de la croissance",
    ],
  },
  {
    key: "daf",
    label: "DAF / RAF",
    fonction: "Directeur / Responsable Administratif et Financier",
    icon: Wallet,
    title: "Pour les DAF / RAF",
    benefits: [
      "Pilotage financier",
      "Visibilité sur la trésorerie",
      "Reporting",
      "Fiabilisation des données",
      "Automatisation des tâches administratives",
      "Contrôle et conformité",
    ],
  },
  {
    key: "dsi",
    label: "DSI / RASI",
    fonction: "Directeur / Responsable des Systèmes d'Information",
    icon: ServerCog,
    title: "Pour les DSI / RASI",
    benefits: [
      "Centralisation des données",
      "Sécurisation des accès",
      "Fiabilité du système d'information",
      "Intégration avec l'écosystème existant",
      "Administration simplifiée",
    ],
  },
  {
    key: "achats",
    label: "Achats",
    fonction: "Responsable des Achats",
    icon: ShoppingCart,
    title: "Pour les Responsables Achats",
    benefits: [
      "Pilotage des fournisseurs",
      "Suivi des commandes",
      "Maîtrise des coûts",
      "Gestion des stocks",
      "Analyse des dépenses",
    ],
  },
  {
    key: "ventes",
    label: "Ventes",
    fonction: "Responsable des Ventes",
    icon: TrendingUp,
    title: "Pour les Responsables Ventes",
    benefits: [
      "Devis et commandes",
      "Facturation",
      "Suivi client",
      "Visibilité sur l'activité commerciale",
      "Gestion des tarifs",
      "Analyse des ventes",
    ],
  },
];

const modules = [
  {
    icon: Landmark,
    title: "Comptabilité & Finance",
    items: [
      "Comptabilité générale et analytique",
      "Trésorerie et rapprochements bancaires",
      "Budgets et reporting",
      "Immobilisations",
      "Déclarations fiscales",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Gestion commerciale",
    items: [
      "Devis et commandes",
      "Facturation et règlements",
      "Gestion des stocks",
      "Tarification et promotions",
      "Gestion de la relation client",
    ],
  },
  {
    icon: Layers,
    title: "Sage BMS",
    items: [
      "Données unifiées et centralisées",
      "Interopérabilité entre les modules",
      "Tableaux de bord et reporting global",
      "Gestion des utilisateurs",
      "Adaptation aux besoins de l'entreprise",
    ],
  },
];

type FeatureKey = "finance" | "achats" | "ventes" | "stocks" | "production" | "reporting";

const featureTabs: { key: FeatureKey; label: string; icon: typeof BarChart2; title: string; items: string[] }[] = [
  {
    key: "finance",
    label: "Finance",
    icon: Landmark,
    title: "Une gestion financière rigoureuse et simplifiée",
    items: [
      "Comptabilité générale, analytique et budgétaire",
      "Suivi de la trésorerie",
      "Reporting financier",
      "Clôtures plus rapides",
      "Données centralisées",
    ],
  },
  {
    key: "achats",
    label: "Achats",
    icon: ShoppingCart,
    title: "Des achats maîtrisés de bout en bout",
    items: [
      "Suivi des fournisseurs et des commandes",
      "Contrôle des coûts d'achat",
      "Approvisionnements planifiés",
      "Analyse des dépenses par catégorie",
      "Traçabilité des engagements",
    ],
  },
  {
    key: "ventes",
    label: "Ventes",
    icon: TrendingUp,
    title: "Un cycle de vente fluide, du devis au règlement",
    items: [
      "Devis, commandes et facturation intégrés",
      "Suivi de la relation client",
      "Gestion des tarifs et promotions",
      "Visibilité sur le pipeline commercial",
      "Analyse des ventes par produit et par client",
    ],
  },
  {
    key: "stocks",
    label: "Stocks",
    icon: Boxes,
    title: "Des stocks sous contrôle en permanence",
    items: [
      "Suivi des stocks multi-dépôts",
      "Valorisation en temps réel",
      "Réapprovisionnements optimisés",
      "Inventaires simplifiés",
      "Traçabilité des mouvements",
    ],
  },
  {
    key: "production",
    label: "Production",
    icon: Factory,
    title: "Une production mieux planifiée",
    items: [
      "Suivi des ordres de fabrication",
      "Gestion des nomenclatures",
      "Planification des ressources",
      "Suivi des coûts de revient",
      "Traçabilité des lots",
    ],
  },
  {
    key: "reporting",
    label: "Reporting",
    icon: PieChart,
    title: "Un pilotage basé sur des données fiables",
    items: [
      "Tableaux de bord personnalisables",
      "Indicateurs de performance en temps réel",
      "Exports et connecteurs BI",
      "Reporting multi-sites",
      "Historique et comparatifs",
    ],
  },
];

// Chiffres réels, déjà publiés sur thales.ma (section "Chiffres clés" de la page d'accueil) — aucune donnée inventée ici.
const kpis = [
  { value: "30+", label: "Ans d'expertise" },
  { value: "500+", label: "Clients actifs" },
  { value: "20+", label: "Consultants certifiés" },
  { value: "92%", label: "Taux de fidélisation clients" },
];

// Témoignages vidéo — les mêmes que la page d'accueil, sans Soremar (client Sage X3, hors périmètre de cette page dédiée à Sage 100).
const sage100Testimonials = allTestimonials.filter((t) => t.company !== "SOREMAR GROUP");

const differentiators = [
  { icon: Sparkles, label: "Conseil et cadrage du projet" },
  { icon: Wrench, label: "Paramétrage et intégration" },
  { icon: GraduationCap, label: "Formation des utilisateurs" },
  { icon: RefreshCw, label: "Accompagnement au changement" },
  { icon: LifeBuoy, label: "Support et assistance" },
  { icon: TrendingUp, label: "Évolution de la solution dans la durée" },
];

const processSteps = [
  { num: "01", title: "Échange", desc: "Analyse de votre contexte et de vos enjeux." },
  { num: "02", title: "Démonstration", desc: "Présentation personnalisée de Sage 100 selon vos besoins." },
  { num: "03", title: "Cadrage", desc: "Définition du périmètre, des modules et des processus." },
  { num: "04", title: "Accompagnement", desc: "Déploiement, formation et suivi par les équipes Thalès Informatique." },
];

const faqs = [
  { q: "À quelles entreprises Sage 100 est-il destiné ?", a: "Sage 100 s'adresse aux PME et ETI de tous secteurs souhaitant centraliser leur gestion comptable, commerciale et financière dans une solution évolutive." },
  { q: "Quels modules Sage 100 peut-on déployer ?", a: "Comptabilité & Finance, Gestion commerciale, Paie & RH, Trésorerie, Immobilisations, et bien d'autres selon vos besoins — activables progressivement." },
  { q: "Peut-on commencer avec quelques modules puis faire évoluer la solution ?", a: "Oui, Sage 100 est modulaire par nature : vous démarrez avec l'essentiel et ajoutez des modules au fur et à mesure de votre croissance." },
  { q: "Sage 100 peut-il s'adapter à nos processus existants ?", a: "Nos consultants analysent vos processus actuels pour paramétrer Sage 100 en conséquence, avec des adaptations spécifiques si nécessaire." },
  { q: "Comment se déroule une démonstration ?", a: "Après votre demande, un expert vous contacte pour comprendre vos enjeux puis vous propose une démonstration personnalisée selon votre fonction et votre secteur." },
  { q: "Combien de temps faut-il pour déployer Sage 100 ?", a: "La durée dépend du périmètre fonctionnel, du nombre d'utilisateurs et des données à migrer. Elle est estimée précisément après l'analyse de vos besoins." },
  { q: "Thalès Informatique assure-t-il la formation et le support ?", a: "Oui, la formation des utilisateurs et le support post-déploiement font partie intégrante de notre accompagnement." },
];

/* ─────────────────────────────────────────────────────────
   Composants utilitaires
───────────────────────────────────────────────────────── */

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Aperçu d'interface réaliste — bloc stylisé (pas d'illustration futuriste), à remplacer par une vraie capture Sage 100.
function InterfaceMock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${compact ? "" : "aspect-[4/3]"}`}>
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-100 bg-bg">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Sage 100 — Tableau de bord</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
              <div className="h-2 w-10 bg-cta/30 rounded mb-2" />
              <div className="h-3 w-14 bg-primary/20 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-bg border border-slate-100 rounded-lg p-3">
          <div className="flex items-end gap-1.5 h-16">
            {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-cta/40 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2.5 bg-slate-100 rounded" style={{ width: `${90 - i * 12}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) track("faq_interaction", { question: q });
        }}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <span className="font-semibold text-primary text-sm">{q}</span>
        <ChevronDown size={18} className={`text-cta shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-secondary leading-relaxed">{a}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────── */

export default function Sage100DecideursClient() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaKey>("dg");
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("finance");
  const [formStarted, setFormStarted] = useState(false);

  const persona = personas.find((p) => p.key === activePersona)!;
  const feature = featureTabs.find((f) => f.key === activeFeature)!;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    fonction: personas[0].fonction,
    entreprise: "",
    consentement: false,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = (origin: string) => {
    track("cta_click", { origin });
    document.getElementById("formulaire")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFieldFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      track("form_start");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_SAGE100_LEADS_URL!, {
        method: "POST",
        body: JSON.stringify({ ...form, source: "linkedin-sage100-decideurs" }),
      });
    } catch (_) {
      // silently ignore network errors — still show confirmation
    }
    setLoading(false);
    setSubmitted(true);
    track("form_submit", { fonction: form.fonction });
  };

  return (
    <main className="overflow-x-hidden bg-bg">
      {/* ── HEADER MINIMALISTE ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-primary/95 backdrop-blur-md shadow-sm" : "bg-primary"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" aria-label="Thalès Informatique" className="flex items-center gap-2 shrink-0">
            <img
              src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_blanc_petit_abarsy.png"
              alt="Thalès Informatique"
              className="h-7 w-auto"
            />
            <span className="hidden sm:inline text-white/40 text-sm">×</span>
            <span className="hidden sm:inline text-white/80 text-sm font-semibold">Sage 100</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white rounded-md hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToForm("header")}
              className="hidden sm:inline-flex items-center gap-1.5 bg-cta text-white text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Demander une démo <ArrowRight size={14} aria-hidden="true" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden text-white p-2 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-primary border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-white/80 rounded-md hover:bg-white/5"
                  >
                    {l.label}
                  </a>
                ))}
                <button
                  onClick={() => { setMobileMenuOpen(false); scrollToForm("mobile-menu"); }}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 bg-cta text-white text-sm font-bold px-4 py-3 rounded-lg cursor-pointer"
                >
                  Demander une démo <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section id="pourquoi" className="pt-14 pb-16 lg:pt-20 lg:pb-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-slate-800 to-slate-900" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest bg-accent/10 px-4 py-1.5 rounded-full mb-6">
              ERP DE GESTION POUR PME &amp; ETI
            </span>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Passez à une gestion plus <span className="text-accent">efficace</span> avec Sage 100
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
              Avec Sage 100 et l&apos;accompagnement de Thalès Informatique, centralisez vos données, automatisez vos processus et prenez des décisions plus rapides et plus fiables.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 max-w-2xl mx-auto">
              {heroBenefits.map((b) => (
                <div key={b.label} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3">
                  <b.icon size={18} className="text-accent shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium text-white/90">{b.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollToForm("hero")}
              className="inline-flex items-center gap-2 bg-cta text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors duration-200 cursor-pointer mb-12"
            >
              Demander une démo <ArrowRight size={18} aria-hidden="true" />
            </button>

            <div className="hidden lg:block max-w-2xl mx-auto">
              <InterfaceMock />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RÉASSURANCE / RÉFÉRENCES — même composant que la page d'accueil ── */}
      <LogoMarquee />

      {/* ── SAGE 100 SELON LE PROFIL ── */}
      <section id="metiers" className="py-20 lg:py-24 bg-bg scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-3 max-w-2xl mx-auto">
                Chaque fonction, des priorités spécifiques, une même solution : Sage 100
              </h2>
              <p className="text-secondary">Découvrez comment Sage 100 répond aux enjeux de votre métier.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {personas.map((p) => (
                <button
                  key={p.key}
                  onClick={() => { setActivePersona(p.key); track("metier_selected", { metier: p.key }); }}
                  aria-pressed={activePersona === p.key}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                    activePersona === p.key
                      ? "bg-cta border-cta text-white shadow-sm"
                      : "bg-white border-slate-200 text-secondary hover:border-cta hover:text-cta"
                  }`}
                >
                  <p.icon size={16} aria-hidden="true" />
                  {p.label}
                </button>
              ))}
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePersona}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8 items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-primary mb-5">{persona.title}</h3>
                <ul className="space-y-3 mb-7">
                  {persona.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-secondary leading-relaxed">
                      <CheckCircle2 size={17} className="text-cta mt-0.5 shrink-0" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToForm(`persona-${activePersona}`)}
                  className="inline-flex items-center gap-1.5 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Découvrir les bénéfices pour les {persona.label} <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
              <InterfaceMock />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" className="py-20 lg:py-24 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-3">Les modules de Sage 100 pour une gestion intégrée</h2>
              <p className="text-secondary max-w-2xl mx-auto">Une solution modulaire pour connecter vos processus, vos équipes et vos données.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <FadeIn key={m.title} delay={i * 0.1}>
                <div className="bg-bg rounded-2xl border border-slate-200 p-7 h-full hover:border-cta/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                    <m.icon size={22} className="text-cta" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-primary mb-4">{m.title}</h3>
                  <ul className="space-y-2">
                    {m.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-xs text-secondary leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-cta mt-1.5 shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="text-center mt-10">
              <button
                onClick={() => scrollToForm("modules")}
                className="inline-flex items-center gap-1.5 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
              >
                Découvrir tous les modules <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOCUS FONCTIONNALITÉS ── */}
      <section className="py-20 lg:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-3">Toutes les fonctionnalités pour une gestion intégrée et performante</h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {featureTabs.map((f) => (
                <button
                  key={f.key}
                  onClick={() => { setActiveFeature(f.key); track("module_selected", { module: f.key }); }}
                  aria-pressed={activeFeature === f.key}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                    activeFeature === f.key
                      ? "bg-cta border-cta text-white shadow-sm"
                      : "bg-white border-slate-200 text-secondary hover:border-cta hover:text-cta"
                  }`}
                >
                  <f.icon size={16} aria-hidden="true" />
                  {f.label}
                </button>
              ))}
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8 items-center"
            >
              <InterfaceMock />
              <div>
                <h3 className="text-xl font-bold text-primary mb-5">{feature.title}</h3>
                <ul className="space-y-3 mb-7">
                  {feature.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-sm text-secondary leading-relaxed">
                      <CheckCircle2 size={17} className="text-cta mt-0.5 shrink-0" aria-hidden="true" />
                      {it}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToForm(`feature-${activeFeature}`)}
                  className="inline-flex items-center gap-1.5 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Voir toutes les fonctionnalités <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="py-16 bg-cta">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((k, i) => (
              <FadeIn key={k.label} delay={i * 0.08} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">{k.value}</div>
                <div className="text-xs md:text-sm text-white/70 mt-1.5">{k.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES VIDÉO — même composant que la page d'accueil, sans Soremar (client Sage X3) ── */}
      <div id="temoignages" className="scroll-mt-16">
        <Testimonials items={sage100Testimonials} />
      </div>

      {/* ── POURQUOI THALÈS INFORMATIQUE ── */}
      <section className="py-20 lg:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <span className="text-xs font-bold text-cta tracking-widest uppercase">L&apos;expertise Thalès Informatique</span>
            <h2 className="text-3xl font-bold text-primary mt-2 mb-5">Bien plus qu&apos;un intégrateur, un partenaire de votre réussite</h2>
            <p className="text-secondary leading-relaxed mb-7">
              Depuis plus de 30 ans, Thalès Informatique accompagne les entreprises dans la mise en place, l&apos;évolution et l&apos;optimisation de leurs solutions de gestion.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mb-7">
              {differentiators.map((d) => (
                <li key={d.label} className="flex items-center gap-2.5 text-sm text-secondary">
                  <CheckCircle2 size={16} className="text-cta shrink-0" aria-hidden="true" />
                  {d.label}
                </li>
              ))}
            </ul>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
              <Award size={18} className="text-cta" aria-hidden="true" />
              <span className="text-sm font-bold text-primary">+30 ans d&apos;expérience</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            {/* Emplacement photo — à remplacer par une vraie photo d'un consultant Thalès en situation client */}
            <div className="aspect-[4/3] rounded-2xl bg-primary/5 border border-slate-200 flex flex-col items-center justify-center gap-3 text-secondary">
              <Users size={36} className="text-slate-300" aria-hidden="true" />
              <span className="text-sm">Photo à intégrer</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-primary text-center mb-14">Un accompagnement simple, de votre besoin à la mise en œuvre</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.12}>
                <div className="relative">
                  <div className="text-4xl font-bold text-cta/20 mb-3">{s.num}</div>
                  <h3 className="text-base font-bold text-primary mb-2">{s.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{s.desc}</p>
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-4 -right-3 w-6 h-px bg-slate-200" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 lg:py-24 bg-bg scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-primary text-center mb-10">Questions fréquentes</h2>
          </FadeIn>
          <div className="space-y-3">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL + FORMULAIRE ── */}
      <section id="formulaire" className="py-20 lg:py-24 bg-primary relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-primary to-primary" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-10">
            <span className="text-xs font-bold text-accent tracking-widest uppercase">Prêt à aller plus loin ?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Découvrez Sage 100 en action.</h2>
            <p className="text-white/70 leading-relaxed mb-6 max-w-xl mx-auto">
              Échangez avec nos experts et découvrez comment Sage 100 peut répondre aux enjeux spécifiques de votre entreprise.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-accent" aria-hidden="true" /> Un expert dédié à votre projet</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-accent" aria-hidden="true" /> Une démonstration personnalisée</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-accent" aria-hidden="true" /> Une prise de contact rapide</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white rounded-3xl p-7 md:p-10 shadow-xl">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-emerald-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Merci, votre demande est envoyée !</h3>
                  <p className="text-secondary">Un expert Thalès Informatique vous contacte très prochainement.</p>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold text-cta tracking-widest uppercase">Demandez une démonstration</span>
                  <h3 className="text-xl font-bold text-primary mt-2 mb-2">Échangez avec un expert Thalès Informatique</h3>
                  <p className="text-secondary text-sm mb-6 leading-relaxed">
                    Remplissez le formulaire et découvrez comment Sage 100 peut répondre concrètement aux enjeux de votre entreprise.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text" name="prenom" placeholder="Prénom *" value={form.prenom}
                        onChange={handleChange} onFocus={handleFieldFocus} required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                      <input
                        type="text" name="nom" placeholder="Nom *" value={form.nom}
                        onChange={handleChange} onFocus={handleFieldFocus} required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                    </div>
                    <select
                      name="fonction" value={form.fonction} onChange={handleChange} onFocus={handleFieldFocus} required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                    >
                      {personas.map((p) => <option key={p.key} value={p.fonction}>{p.fonction}</option>)}
                      <option value="Autre">Autre</option>
                    </select>
                    <input
                      type="text" name="entreprise" placeholder="Entreprise *" value={form.entreprise}
                      onChange={handleChange} onFocus={handleFieldFocus} required
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="tel" name="telephone" placeholder="Téléphone *" value={form.telephone}
                        onChange={handleChange} onFocus={handleFieldFocus} required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                      <input
                        type="email" name="email" placeholder="Email pro *" value={form.email}
                        onChange={handleChange} onFocus={handleFieldFocus} required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                    </div>

                    <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                      <input
                        type="checkbox" name="consentement" checked={form.consentement} onChange={handleChange} required
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-cta focus:ring-cta focus:ring-1 cursor-pointer"
                      />
                      <span className="text-xs text-secondary leading-relaxed">
                        J&apos;accepte d&apos;être contacté·e par Thalès Informatique au sujet de ma demande.
                      </span>
                    </label>

                    <button
                      type="submit" disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? "Envoi en cours..." : "Demander une démo"}
                      {!loading && <ArrowRight size={16} aria-hidden="true" />}
                    </button>
                    <p className="text-xs text-slate-400 text-center">
                      Vos données sont confidentielles et ne seront jamais partagées.
                    </p>
                  </form>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER MINIMAL ── */}
      <footer className="py-8 bg-primary border-t border-white/10 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Thalès Informatique — 310 Rue Hadj Omar Riffi, Casablanca · +212 5 22 54 87 80</span>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-white/70 transition-colors">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white/70 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>

      {/* ── CTA sticky mobile ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => scrollToForm("sticky-mobile")}
          className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold py-3 rounded-xl cursor-pointer"
        >
          <Phone size={15} aria-hidden="true" /> Demander une démo
        </button>
      </div>
    </main>
  );
}
