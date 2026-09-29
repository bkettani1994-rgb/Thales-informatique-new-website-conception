"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Wallet,
  ServerCog,
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  Clock,
  ChevronDown,
  Send,
  Phone,
} from "lucide-react";

type PersonaKey = "dg" | "daf" | "dsi" | "achats";

const personas: {
  key: PersonaKey;
  label: string;
  fonction: string;
  icon: typeof Crown;
  headline: string;
  sub: string;
  painPoints: string[];
  response: string;
}[] = [
  {
    key: "dg",
    label: "DG",
    fonction: "Directeur Général",
    icon: Crown,
    headline: "Pilotez toute votre entreprise depuis une seule plateforme",
    sub: "Une vision consolidée de votre activité pour décider plus vite et plus juste.",
    painPoints: [
      "Une vision fragmentée entre finance, commerce et production",
      "Des décisions prises sans données consolidées en temps réel",
      "Une croissance freinée par des outils qui ne suivent plus",
    ],
    response: "Sage 100 centralise votre gestion dans un environnement unique, pour une vision à 360° de votre entreprise et des décisions prises sur des données fiables.",
  },
  {
    key: "daf",
    label: "DAF / RAF",
    fonction: "Directeur / Responsable Administratif et Financier",
    icon: Wallet,
    headline: "Fiabilisez vos chiffres, accélérez vos clôtures",
    sub: "Une comptabilité fluide, conforme et connectée à toute l'entreprise.",
    painPoints: [
      "Des clôtures comptables qui prennent des jours",
      "Des rapprochements manuels sources d'erreurs",
      "Un reporting financier chronophage à produire",
    ],
    response: "Sage 100 automatise vos traitements comptables et financiers, pour des clôtures plus rapides et un reporting fiable, disponible à tout moment.",
  },
  {
    key: "dsi",
    label: "DSI / RASI",
    fonction: "Directeur / Responsable des Systèmes d'Information",
    icon: ServerCog,
    headline: "Une solution robuste, sécurisée et facile à administrer",
    sub: "Une architecture cloud qui allège la charge de vos équipes IT.",
    painPoints: [
      "Une multiplicité d'outils non connectés à maintenir",
      "Des risques de sécurité et de perte de données",
      "Une charge de maintenance qui pèse sur vos équipes IT",
    ],
    response: "Sage 100 s'appuie sur le cloud sécurisé Microsoft Azure, avec sauvegardes automatiques et accès par rôles — moins de charge d'administration pour votre DSI.",
  },
  {
    key: "achats",
    label: "Achats & Ventes",
    fonction: "Responsable des Achats / des Ventes",
    icon: ShoppingCart,
    headline: "Accélérez vos cycles commerciaux et vos achats",
    sub: "Une gestion commerciale fluide, de la commande à la facturation.",
    painPoints: [
      "Un suivi des devis, commandes et stocks dispersé",
      "Un manque de visibilité sur les marges en temps réel",
      "Des processus achats et ventes peu automatisés",
    ],
    response: "Sage 100 unifie votre gestion commerciale : devis, commandes, stocks et facturation dans un seul flux, avec une visibilité en temps réel sur vos marges.",
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Sage Business Partner Platinum" },
  { icon: Award, label: "Meilleure Dynamique Commerciale — Sage Maroc 2024" },
  { icon: Users, label: "500+ entreprises accompagnées" },
  { icon: Clock, label: "30 ans d'expertise ERP" },
];

const testimonials = [
  {
    quote: "Sage est une solution parfaitement adaptée aux besoins des PME. Nous avons opté pour Thalès Informatique pour la réactivité de ses collaborateurs qui sont extrêmement compétents.",
    name: "Laurent Chevreau",
    role: "Directeur Général — SOCIMAR",
    initials: "LC",
  },
  {
    quote: "Thalès Informatique nous accompagne dans la mise à jour de notre solution dans les meilleures conditions en termes de délai et de qualité.",
    name: "Rachid Oueski",
    role: "DAF — HEA Trade & Services",
    initials: "RO",
  },
];

const faqs = [
  {
    q: "Combien de temps dure la mise en place de Sage 100 ?",
    a: "La durée dépend du périmètre fonctionnel, du nombre d'utilisateurs et des données à migrer. Nos consultants vous donnent une estimation précise après une analyse de vos besoins.",
  },
  {
    q: "Sage 100 s'adapte-t-il à la taille de mon entreprise ?",
    a: "Oui, Sage 100 est modulaire : vous démarrez avec les modules dont vous avez besoin (comptabilité, gestion commerciale, paie...) et l'étendez au fur et à mesure de votre croissance.",
  },
  {
    q: "Que se passe-t-il après avoir rempli le formulaire ?",
    a: "Un expert Thalès Informatique vous contacte pour comprendre vos enjeux et vous proposer une démonstration adaptée à votre fonction et à votre secteur d'activité.",
  },
];

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
      >
        <span className="font-semibold text-primary text-sm">{q}</span>
        <ChevronDown size={18} className={`text-cta shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-secondary leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function Sage100DecideursClient() {
  const [activePersona, setActivePersona] = useState<PersonaKey>("dg");
  const persona = personas.find((p) => p.key === activePersona)!;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", fonction: persona.fonction, entreprise: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
  };

  return (
    <main className="overflow-x-hidden bg-bg">
      {/* Slim header — pas de navigation pour rester focalisé sur la conversion */}
      <header className="py-4 border-b border-white/10 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" aria-label="Thalès Informatique">
            <img
              src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_blanc_petit_abarsy.png"
              alt="Thalès Informatique"
              className="h-8 w-auto"
            />
          </Link>
          <a
            href="tel:+212522548780"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            <Phone size={15} aria-hidden="true" />
            +212 5 22 54 87 80
          </a>
        </div>
      </header>

      {/* Hero — sélecteur de profil interactif */}
      <section className="pt-14 pb-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-slate-800 to-slate-900" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-accent tracking-widest bg-accent/10 px-4 py-1.5 rounded-full mb-6">
              SAGE 100 — POUR LES DÉCIDEURS
            </span>

            {/* Sélecteur de profil */}
            <p className="text-white/50 text-sm font-semibold mb-4">Vous êtes...</p>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {personas.map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    setActivePersona(p.key);
                    setForm((f) => ({ ...f, fonction: p.fonction }));
                  }}
                  aria-pressed={activePersona === p.key}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                    activePersona === p.key
                      ? "bg-cta border-cta text-white shadow-lg scale-105"
                      : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <p.icon size={16} aria-hidden="true" />
                  {p.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePersona}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 max-w-3xl mx-auto">
                  {persona.headline}
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
                  {persona.sub}
                </p>
              </motion.div>
            </AnimatePresence>

            <a
              href="#formulaire"
              className="inline-flex items-center gap-2 bg-cta text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors duration-200"
            >
              Demander une démonstration personnalisée <ArrowRight size={18} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Bandeau de confiance */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-secondary text-sm font-medium">
                <b.icon size={18} className="text-cta shrink-0" aria-hidden="true" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Défis / réponse — synchronisé avec le profil sélectionné */}
      <section className="py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-3">Vous reconnaissez ces situations ?</h2>
              <p className="text-secondary">En tant que {persona.fonction.toLowerCase()}, ces défis vous parlent sûrement.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <FadeIn delay={0.1} className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">Vos défis actuels</h3>
              <ul className="space-y-4">
                {persona.painPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-secondary leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.2} className="bg-primary rounded-2xl p-8 text-white">
              <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-5">La réponse Sage 100</h3>
              <p className="text-white/80 leading-relaxed">{persona.response}</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-3">Une solution complète, modulaire</h2>
              <p className="text-secondary max-w-2xl mx-auto">Sage 100 couvre l&apos;ensemble de votre gestion, activable module par module selon vos priorités.</p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Comptabilité & Finance", desc: "Comptabilité générale, analytique et états financiers." },
              { title: "Gestion commerciale", desc: "Devis, commandes, stocks et facturation." },
              { title: "Paie & RH", desc: "Paie conforme et gestion administrative du personnel." },
              { title: "Trésorerie", desc: "Suivi et prévisionnel de trésorerie." },
            ].map((m, i) => (
              <FadeIn key={m.title} delay={i * 0.08}>
                <div className="bg-bg rounded-2xl border border-slate-200 p-6 h-full">
                  <CheckCircle2 size={20} className="text-cta mb-4" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-primary mb-1.5">{m.title}</h3>
                  <p className="text-secondary text-xs leading-relaxed">{m.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-primary text-center mb-12">Ils nous font confiance</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-slate-200 p-7 h-full">
                  <p className="text-primary text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cta flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{t.name}</p>
                      <p className="text-xs text-secondary">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl font-bold text-primary text-center mb-10">Questions fréquentes</h2>
          </FadeIn>
          <div className="space-y-3">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section id="formulaire" className="py-24 bg-primary relative overflow-hidden scroll-mt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-primary to-primary" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Parlons de votre projet Sage 100</h2>
              <p className="text-white/60 leading-relaxed">
                Un expert Thalès Informatique vous contacte pour une démonstration adaptée à votre fonction et à votre entreprise.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-emerald-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Merci, votre demande est envoyée !</h3>
                  <p className="text-secondary">Un expert Thalès Informatique vous contacte très prochainement.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Prénom *</label>
                      <input
                        type="text"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Nom *</label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Email professionnel *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Téléphone *</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                        required
                        placeholder="+212 6 00 00 00 00"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Fonction *</label>
                    <select
                      name="fonction"
                      value={form.fonction}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors bg-white"
                    >
                      {personas.map((p) => (
                        <option key={p.key} value={p.fonction}>{p.fonction}</option>
                      ))}
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Entreprise *</label>
                    <input
                      type="text"
                      name="entreprise"
                      value={form.entreprise}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-cta text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60"
                  >
                    {loading ? "Envoi en cours..." : "Demander ma démonstration"}
                    {!loading && <ArrowRight size={18} aria-hidden="true" />}
                  </button>
                  <p className="text-xs text-secondary text-center">
                    Vos données restent confidentielles et servent uniquement à vous recontacter au sujet de ce projet.
                  </p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-8 bg-primary border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Thalès Informatique — 310 Rue Hadj Omar Riffi, Casablanca</span>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-white/70 transition-colors">Mentions légales</Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white/70 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
