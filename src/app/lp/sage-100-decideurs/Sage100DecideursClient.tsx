"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import LogoMarquee from "@/components/sections/LogoMarquee";
import Awards from "@/components/sections/Awards";
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
  Landmark,
  Layers,
  GraduationCap,
  LifeBuoy,
  RefreshCw,
  Wrench,
  Star,
  PlayCircle,
  Calendar,
  Cloud,
  ArrowLeft,
  BadgeCheck,
  Building2,
  Headset,
  Heart,
  CreditCard,
  Clock,
  Percent,
  Receipt,
  FileSpreadsheet,
  Globe,
  Zap,
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
  { href: "#modules", label: "Modules" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#faq", label: "FAQ" },
];

// ID YouTube du replay webinaire Sage 100 Expérience — laisser vide tant qu'aucune vidéo n'est confirmée.
const WEBINAR_VIDEO_ID = "";

const formSteps = ["Entreprise", "Projet", "Contact"];

const tailleOptions = ["1 à 10 salariés", "11 à 50 salariés", "51 à 200 salariés", "+200 salariés"];
const moduleOptions = ["Comptabilité", "Gestion commerciale", "Paie & RH", "Trésorerie", "Immobilisations", "Moyens de paiement"];
const outilOptions = ["Excel / manuel", "Ancienne version Sage", "Autre logiciel", "Aucun outil"];
const horizonOptions = ["Immédiat", "Sous 3 mois", "3 à 6 mois", "Je me renseigne"];

const heroAdvantages = [
  { icon: Cloud, label: "Cloud" },
  { icon: Sparkles, label: "IA intégrée" },
  { icon: RefreshCw, label: "Automatisation" },
  { icon: BarChart2, label: "Pilotage en temps réel" },
  { icon: Layers, label: "Évolutif & modulaire" },
];

const modules = [
  {
    icon: ShoppingCart,
    title: "Gestion commerciale",
    desc: "Devis, commandes, livraisons, facturation et suivi clients.",
    image: "/images/modules-sage100/gestion-commerciale.webp",
  },
  {
    icon: Landmark,
    title: "Comptabilité",
    desc: "Comptabilité générale, analytique et budgétaire.",
    image: "/images/modules-sage100/comptabilite.webp",
  },
  {
    icon: Wallet,
    title: "Trésorerie",
    desc: "Suivi de trésorerie et rapprochements bancaires.",
    image: "/images/modules-sage100/tresorerie.webp",
  },
  {
    icon: Boxes,
    title: "Immobilisations",
    desc: "Gestion et suivi du parc d'immobilisations.",
    image: "/images/modules-sage100/immobilisations.webp",
  },
  {
    icon: CreditCard,
    title: "Moyen de paiement",
    desc: "Gestion des règlements et modes de paiement.",
    image: "/images/modules-sage100/moyen-de-paiement.webp",
  },
  {
    icon: Clock,
    title: "Délai de paiement",
    desc: "Suivi des échéances et délais de règlement.",
    image: "/images/modules-sage100/delai-de-paiement.webp",
  },
  {
    icon: Percent,
    title: "TVA Manager",
    desc: "Gestion et déclaration automatisées de la TVA.",
    image: "/images/modules-sage100/tva-manager.webp",
  },
  {
    icon: Receipt,
    title: "La RAS",
    desc: "Gestion de la retenue à la source.",
    image: "/images/modules-sage100/ras.webp",
  },
  {
    icon: Wrench,
    title: "La production (Industrie)",
    desc: "Planification, suivi de production et gestion des coûts.",
    image: "/images/modules-sage100/production.webp",
  },
  {
    icon: FileSpreadsheet,
    title: "États comptables & fiscaux",
    desc: "Génération des états comptables et fiscaux réglementaires.",
    image: "/images/modules-sage100/etats-comptables-fiscaux.webp",
  },
  {
    icon: BarChart2,
    title: "BI Reporting",
    desc: "Tableaux de bord et indicateurs en temps réel.",
    image: "/images/modules-sage100/bi-reporting.webp",
  },
  {
    icon: Building2,
    title: "Entreprise",
    desc: "Pilotage multi-sociétés et données centralisées.",
    image: "/images/modules-sage100/entreprise.webp",
  },
];

const cloudBenefits = [
  { icon: Globe, label: "Accessible partout", desc: "Travaillez depuis le bureau, à distance ou en déplacement, sur simple connexion internet." },
  { icon: ShieldCheck, label: "Données sécurisées", desc: "Sauvegardes automatiques et infrastructure sécurisée, sans y penser." },
  { icon: RefreshCw, label: "Mises à jour automatiques", desc: "Toujours la dernière version de Sage 100, sans intervention technique." },
  { icon: ServerCog, label: "Zéro serveur à gérer", desc: "Aucun investissement matériel ni maintenance informatique à votre charge." },
  { icon: Layers, label: "Évolutif à votre rythme", desc: "Ajoutez des utilisateurs et des modules au fil de votre croissance." },
  { icon: Zap, label: "Continuité d'activité", desc: "Votre outil de gestion disponible en permanence, même en cas d'incident local." },
];

// Chiffres réels, déjà publiés sur thales.ma (section "Chiffres clés" de la page d'accueil) — aucune donnée inventée ici.
const kpis = [
  { value: 30, suffix: "+", label: "Ans d'expertise", color: "#F59E0B", icon: Award },
  { value: 35, suffix: "+", label: "Collaborateurs", color: "#38BDF8", icon: Users },
  { value: 20, suffix: "+", label: "Consultants certifiés", color: "#A78BFA", icon: BadgeCheck },
  { value: 500, suffix: "+", label: "Clients actifs", color: "#34D399", icon: Building2 },
  { value: 100, suffix: "%", label: "Service dédié au support", color: "#FB923C", icon: Headset },
  { value: 92, suffix: "%", label: "Taux de fidélisation clients", color: "#F472B6", icon: Heart },
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

function KpiCounter({ target, suffix, running }: { target: number; suffix: string; running: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const total = 80;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const id = setTimeout(() => {
      const tick = () => {
        frame++;
        setCount(Math.round(ease(Math.min(frame / total, 1)) * target));
        if (frame < total) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 200);
    return () => clearTimeout(id);
  }, [running, target]);

  return (
    <span className="tabular-nums text-primary">
      {count.toLocaleString("fr-MA")}{suffix}
    </span>
  );
}

function KpiSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 bg-white" id="chiffres">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-widest mb-2">
            Nos chiffres clés
          </span>
          <div className="w-8 h-0.5 bg-accent mx-auto mb-4 rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Un partenaire de <span className="text-cta">confiance</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-white rounded-3xl border border-slate-100 shadow-sm divide-x divide-y lg:divide-y-0 divide-slate-100">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center gap-2 py-8 px-3 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                className="relative w-14 h-14 rounded-full flex items-center justify-center mb-1"
                style={{ background: `${k.color}14` }}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <motion.circle
                    cx="28" cy="28" r="25" fill="none" stroke={k.color} strokeWidth="2.5" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ delay: 0.2, duration: 1.3, ease: "easeOut" }}
                  />
                </svg>
                <k.icon size={22} style={{ color: k.color }} aria-hidden="true" />
              </motion.div>
              <div className="text-3xl sm:text-4xl font-black leading-none tracking-tight">
                <KpiCounter target={k.value} suffix={k.suffix} running={inView} />
              </div>
              <div className="text-xs text-secondary font-medium leading-tight max-w-[110px]">{k.label}</div>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: 24 } : {}}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                className="h-[2px] rounded-full mt-0.5"
                style={{ background: k.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [form, setForm] = useState({
    taille: "",
    modulesInteret: [] as string[],
    outil: "",
    horizon: "",
    nomComplet: "",
    societe: "",
    fonction: "",
    ville: "",
    email: "",
    telephone: "",
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

  const selectOption = (field: "taille" | "outil" | "horizon", value: string) => {
    handleFieldFocus();
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleModule = (value: string) => {
    handleFieldFocus();
    setForm((f) => ({
      ...f,
      modulesInteret: f.modulesInteret.includes(value)
        ? f.modulesInteret.filter((m) => m !== value)
        : [...f.modulesInteret, value],
    }));
  };

  const goToStep = (step: number) => {
    setFormStep(step);
    track("form_step", { step: step + 1 });
  };

  const canContinueStep0 = form.taille !== "" && form.modulesInteret.length > 0;
  const canContinueStep1 = form.outil !== "" && form.horizon !== "";

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
    router.push("/lp/sage-100-decideurs/merci");
  };

  return (
    <main className="overflow-x-hidden bg-bg">
      {/* ── HEADER MINIMALISTE — transparent au-dessus de la vidéo de la hero, solide au scroll ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" aria-label="Thalès Informatique" className="relative flex items-center gap-2 shrink-0 h-9">
            <img
              src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png"
              alt="Thalès Informatique"
              className={`h-9 w-auto object-contain transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}
            />
            <img
              src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_blanc_petit_abarsy.png"
              alt="Thalès Informatique"
              className={`h-9 w-auto object-contain absolute inset-y-0 left-0 my-auto transition-opacity duration-300 ${scrolled ? "opacity-0" : "opacity-100"}`}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  scrolled ? "text-secondary hover:text-primary hover:bg-slate-100" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
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
              Demander un devis <ArrowRight size={14} aria-hidden="true" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`lg:hidden p-2 cursor-pointer transition-colors ${scrolled ? "text-primary" : "text-white"}`}
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
              className={`lg:hidden overflow-hidden border-t ${scrolled ? "bg-white border-border" : "bg-primary border-white/10"}`}
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-md ${
                      scrolled ? "text-secondary hover:bg-slate-100" : "text-white/80 hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                  </a>
                ))}
                <button
                  onClick={() => { setMobileMenuOpen(false); scrollToForm("mobile-menu"); }}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 bg-cta text-white text-sm font-bold px-4 py-3 rounded-lg cursor-pointer"
                >
                  Demander un devis <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section id="pourquoi" className="relative pt-16 pb-14 sm:pb-16 lg:pt-24 lg:pb-20 overflow-hidden">
        {/* vidéo de fond */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
          poster="https://res.cloudinary.com/dmutnjgp8/image/upload/v1790699961/Image_ChatGPT_29_sept._2026_17_37_30_sdbruh.webp"
        >
          <source
            src="https://res.cloudinary.com/dmutnjgp8/video/upload/v1790759642/From_Klickpin.com-_Bridesmaid_dress_inspiration_that_are_perfect_when_you_want_something_stylish_modern_and_easy_to_copy_for_creators_who_love_pol_zegred.mp4"
            type="video/mp4"
          />
        </video>
        {/* voile pour garantir la lisibilité du texte */}
        <div className="absolute inset-0 bg-primary/40" aria-hidden="true" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-white tracking-widest bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              ERP DE GESTION POUR PME &amp; ETI
            </span>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight mb-6">
              <span className="text-white">Passez à une gestion plus efficace</span>
              <br />
              <span className="text-accent">avec Sage 100</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
              Avec Sage 100 et l&apos;accompagnement de Thalès Informatique, centralisez vos données, automatisez vos processus et prenez des décisions plus rapides et plus fiables.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <a
                href="#modules"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              >
                Découvrir Sage 100
              </a>
              <button
                onClick={() => scrollToForm("hero")}
                className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all duration-200 cursor-pointer"
              >
                Demander un devis <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-white/80 text-sm">
              <span>Noté 4.7/5 par nos clients</span>
              <span className="flex items-center gap-0.5 ml-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </span>
            </div>
          </motion.div>
        </div>

        {/* avantages — rangée d'icônes sur fond vidéo */}
        <div className="relative max-w-4xl mx-auto px-4 mt-12 sm:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-nowrap items-start justify-start sm:justify-center gap-x-8 sm:gap-x-10 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:overflow-visible pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {heroAdvantages.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-2 w-28 shrink-0">
                <span className="w-11 h-11 rounded-full border border-white/30 bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <a.icon size={18} className="text-white" aria-hidden="true" />
                </span>
                <span className="text-[11px] sm:text-xs text-white/80 text-center leading-snug whitespace-nowrap">{a.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── RÉASSURANCE / RÉFÉRENCES — même composant que la page d'accueil ── */}
      <LogoMarquee />

      {/* ── MODULES ── */}
      <section id="modules" className="py-20 lg:py-24 bg-gradient-to-b from-bg to-blue-50/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-3">Les modules de Sage 100 pour une gestion intégrée</h2>
              <p className="text-secondary max-w-2xl mx-auto">Une solution modulaire pour connecter vos processus, vos équipes et vos données.</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((m, i) => (
              <FadeIn key={m.title} delay={i * 0.06}>
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden h-full hover:border-cta/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="h-24 bg-gradient-to-br from-primary to-cta relative flex items-center justify-center overflow-hidden">
                    {m.image ? (
                      <Image src={m.image} alt={m.title} fill sizes="300px" className="object-cover" />
                    ) : (
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "18px 18px" }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="px-5 pb-5 pt-0 relative">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center -mt-6 mb-3 relative z-10">
                      <m.icon size={20} className="text-cta" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-1.5">{m.title}</h3>
                    <p className="text-xs text-secondary leading-relaxed mb-3">{m.desc}</p>
                    <button
                      onClick={() => scrollToForm(`module-${m.title}`)}
                      className="inline-flex items-center gap-1 text-cta font-semibold text-xs hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Découvrir le module <ArrowRight size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Layers size={22} className="text-cta" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-primary text-sm">Une solution modulaire et évolutive</p>
                  <p className="text-xs text-secondary mt-0.5">Activez les modules dont vous avez besoin aujourd&apos;hui et faites évoluer votre solution selon vos ambitions.</p>
                </div>
              </div>
              <button
                onClick={() => scrollToForm("modules")}
                className="shrink-0 inline-flex items-center gap-2 bg-cta text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Demander une démonstration <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SAGE 100 CLOUD ── */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1791218753/Infographie_cloud_et_collaboration_dans_le_ciel_t6s9pt.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/55 to-primary/85" aria-hidden="true" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-accent uppercase tracking-widest mb-4 bg-primary/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
              Sage 100 Cloud
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto drop-shadow-sm">
              Travaillez librement, avec Sage 100 dans le <span className="text-accent">cloud</span>
            </h2>
            <p className="text-white/85 leading-relaxed max-w-xl mx-auto">
              Toute la puissance de Sage 100, accessible à tout moment, sans serveur à gérer ni souci technique — pour vous concentrer sur votre activité.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="text-center mt-14">
              <button
                onClick={() => scrollToForm("cloud")}
                className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all duration-200 cursor-pointer shadow-lg"
              >
                Demander un devis <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <KpiSection />

      {/* ── TROPHÉES & DISTINCTIONS — même composant que la page d'accueil ── */}
      <Awards />

      {/* ── TÉMOIGNAGES VIDÉO — même composant que la page d'accueil, sans Soremar (client Sage X3) ── */}
      <div id="temoignages" className="scroll-mt-16">
        <Testimonials
          items={sage100Testimonials}
          title="Ils ont vécu Sage 100 avec Thalès Informatique"
          subtitle="Des clients témoignent en vidéo de leur expérience Sage 100 accompagnés par nos équipes."
          theme="light"
        />
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

      {/* ── WEBINAIRE SAGE 100 EXPÉRIENCE ── */}
      <section id="webinaire" className="py-20 lg:py-24 bg-primary scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <span className="text-xs font-bold text-accent tracking-widest uppercase">Sage 100 Expérience</span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-5">
              Thalès Informatique vous informe en avant-première des nouveautés Sage 100
            </h2>
            <p className="text-white/70 leading-relaxed mb-7">
              À travers nos webinaires Sage 100 Expérience, nos experts décryptent les dernières évolutions de la solution : nouvelles fonctionnalités, mises à jour réglementaires, bonnes pratiques et retours d&apos;expérience clients — pour vous permettre de garder une longueur d&apos;avance.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Nouveautés et évolutions produit présentées en direct",
                "Sessions animées par nos consultants certifiés Sage",
                "Questions/réponses en direct avec nos experts",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                  <CheckCircle2 size={16} className="text-accent shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/evenements/webinaire-sage-100-experience"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors"
              data-track="webinar_link_click"
            >
              <Calendar size={16} aria-hidden="true" />
              Voir le prochain webinaire
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            {/* Emplacement vidéo — à remplacer par le replay du webinaire Sage 100 Expérience (renseigner WEBINAR_VIDEO_ID) */}
            {WEBINAR_VIDEO_ID ? (
              <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                <iframe
                  src={`https://www.youtube.com/embed/${WEBINAR_VIDEO_ID}`}
                  title="Replay — Webinaire Sage 100 Expérience"
                  className="w-full h-full"
                  allow="accelerate-compute; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => track("video_play", { video: "webinaire-sage-100-experience" })}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => track("video_play", { video: "webinaire-sage-100-experience-placeholder" })}
                className="group w-full aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 text-white/70 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <span className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlayCircle size={30} className="text-primary" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium">Vidéo du webinaire à intégrer</span>
              </button>
            )}
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
        <Image
          src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1790699961/Image_ChatGPT_29_sept._2026_17_37_30_sdbruh.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-70"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-primary/80 to-primary/90" />
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
                  <h3 className="text-xl font-bold text-primary mb-1.5">Demandez votre démo Sage 100</h3>
                  <p className="text-secondary text-sm mb-5 leading-relaxed">
                    Un consultant certifié prépare une démonstration adaptée à votre activité.
                  </p>

                  {/* Barre de progression */}
                  <div className="flex gap-2 mb-2.5">
                    {formSteps.map((_, i) => (
                      <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= formStep ? "bg-cta" : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <div className="flex justify-between mb-7">
                    {formSteps.map((label, i) => (
                      <span key={label} className={`text-[11px] font-bold tracking-widest uppercase ${i <= formStep ? "text-cta" : "text-slate-400"}`}>
                        0{i + 1} {label}
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ÉTAPE 1 — ENTREPRISE */}
                    {formStep === 0 && (
                      <div className="space-y-5">
                        <div>
                          <p className="font-bold text-primary text-sm mb-3">Taille de votre entreprise</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            {tailleOptions.map((opt) => (
                              <button
                                key={opt} type="button" onClick={() => selectOption("taille", opt)}
                                className={`px-3.5 py-3 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer ${
                                  form.taille === opt ? "border-cta bg-blue-50 text-cta" : "border-slate-200 text-secondary hover:border-cta/40"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm mb-3">Modules qui vous intéressent</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {moduleOptions.map((opt) => (
                              <button
                                key={opt} type="button" onClick={() => toggleModule(opt)}
                                className={`px-3.5 py-3 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer ${
                                  form.modulesInteret.includes(opt) ? "border-cta bg-blue-50 text-cta" : "border-slate-200 text-secondary hover:border-cta/40"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button" disabled={!canContinueStep0} onClick={() => goToStep(1)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Continuer <ArrowRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    )}

                    {/* ÉTAPE 2 — PROJET */}
                    {formStep === 1 && (
                      <div className="space-y-5">
                        <div>
                          <p className="font-bold text-primary text-sm mb-3">Votre outil de gestion actuel</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            {outilOptions.map((opt) => (
                              <button
                                key={opt} type="button" onClick={() => selectOption("outil", opt)}
                                className={`px-3.5 py-3 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer ${
                                  form.outil === opt ? "border-cta bg-blue-50 text-cta" : "border-slate-200 text-secondary hover:border-cta/40"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm mb-3">Horizon de votre projet</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            {horizonOptions.map((opt) => (
                              <button
                                key={opt} type="button" onClick={() => selectOption("horizon", opt)}
                                className={`px-3.5 py-3 rounded-lg border text-sm font-medium text-left transition-colors cursor-pointer ${
                                  form.horizon === opt ? "border-cta bg-blue-50 text-cta" : "border-slate-200 text-secondary hover:border-cta/40"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button" onClick={() => goToStep(0)}
                            className="inline-flex items-center gap-1.5 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
                          >
                            <ArrowLeft size={14} aria-hidden="true" /> Retour
                          </button>
                          <button
                            type="button" disabled={!canContinueStep1} onClick={() => goToStep(2)}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Continuer <ArrowRight size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ÉTAPE 3 — CONTACT */}
                    {formStep === 2 && (
                      <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text" name="nomComplet" placeholder="Prénom Nom" value={form.nomComplet}
                            onChange={handleChange} onFocus={handleFieldFocus} required
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                          />
                          <input
                            type="text" name="societe" placeholder="Raison sociale" value={form.societe}
                            onChange={handleChange} onFocus={handleFieldFocus} required
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text" name="fonction" placeholder="DAF, DG, DSI..." value={form.fonction}
                            onChange={handleChange} onFocus={handleFieldFocus} required
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                          />
                          <input
                            type="text" name="ville" placeholder="Casablanca" value={form.ville}
                            onChange={handleChange} onFocus={handleFieldFocus}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="email" name="email" placeholder="nom@societe.ma" value={form.email}
                            onChange={handleChange} onFocus={handleFieldFocus} required
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                          />
                          <input
                            type="tel" name="telephone" placeholder="06 00 00 00 00" value={form.telephone}
                            onChange={handleChange} onFocus={handleFieldFocus} required
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          Vos données sont utilisées uniquement par Thalès Informatique pour traiter votre demande.
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button" onClick={() => goToStep(1)}
                            className="inline-flex items-center gap-1.5 text-cta font-semibold text-sm hover:text-blue-700 transition-colors cursor-pointer"
                          >
                            <ArrowLeft size={14} aria-hidden="true" /> Retour
                          </button>
                          <button
                            type="submit" disabled={loading}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60 cursor-pointer"
                          >
                            {loading ? "Envoi en cours..." : "Recevoir ma démo"}
                            {!loading && <ArrowRight size={16} aria-hidden="true" />}
                          </button>
                        </div>
                      </div>
                    )}
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
          <Phone size={15} aria-hidden="true" /> Demander un devis
        </button>
      </div>
    </main>
  );
}
