"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Download, FileText, Mail, X, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

type Guide = {
  icon: string;
  title: string;
  description: string;
  pages: string;
  category: string;
  available?: boolean;
};

const guides: Guide[] = [
  {
    icon: "🆕",
    title: "Guide Sage 100 Expérience",
    description: "Ce qui change concrètement pour vous avec la nouvelle édition de Sage 100.",
    pages: "8 pages",
    category: "Sage 100",
  },
  {
    icon: "📄",
    title: "1 système au lieu de 5",
    description: "Fiche pratique sur la centralisation de votre gestion avec Sage 100 BMS.",
    pages: "2 pages",
    category: "Sage 100",
  },
  {
    icon: "✅",
    title: "Votre PME est-elle prête pour un ERP ?",
    description: "Checklist en 15 points pour évaluer la maturité de votre entreprise avant un projet ERP.",
    pages: "15 points",
    category: "ERP",
  },
  {
    icon: "📊",
    title: "Sortir d'Excel : le coût réel de votre gestion",
    description: "Guide chiffré sur les coûts cachés d'une gestion sous Excel face à un vrai ERP.",
    pages: "14 pages",
    category: "Finance",
  },
  {
    icon: "🗓️",
    title: "Planning type d'une migration",
    description: "Modèle de planning détaillé pour une migration ERP réussie en 8 semaines.",
    pages: "1 page",
    category: "Migration",
  },
  {
    icon: "🧾",
    title: "Checklist facturation électronique",
    description: "18 points de contrôle transverses pour vous mettre en conformité avec l'obligation DGI.",
    pages: "18 points",
    category: "Conformité",
  },
  {
    icon: "💰",
    title: "Comparatif achat / abonnement",
    description: "Analyse chiffrée sur 3 ans pour choisir le mode d'acquisition le plus rentable pour votre ERP.",
    pages: "Calculateur + 1 page",
    category: "Finance",
  },
  {
    icon: "💡",
    title: "Ce que vous n'exploitez pas encore",
    description: "Fiche pratique sur les fonctionnalités Sage 100 sous-utilisées dans votre entreprise.",
    pages: "Fiche pratique",
    category: "Sage 100",
  },
  {
    icon: "🤖",
    title: "8 cas d'usage de l'IA dans Sage 100",
    description: "Guide des nouveaux usages concrets de l'intelligence artificielle dans votre gestion commerciale et comptable.",
    pages: "12 pages",
    category: "IA",
  },
  {
    icon: "📈",
    title: "Calculateur de ROI Sage 100",
    description: "Modèle pour calculer le retour sur investissement de votre solution Sage 100.",
    pages: "Calculateur",
    category: "Finance",
  },
  {
    icon: "📁",
    title: "Modèle de dossier d'investissement",
    description: "Trame pour présenter et faire valider votre projet Sage 100 en interne.",
    pages: "Modèle",
    category: "Investissement",
  },
  {
    icon: "🧑‍💼",
    title: "12 points de contrôle avant de valider la paie",
    description: "Checklist de vérification pour sécuriser chaque cycle de paie avec Sage 100 Paie & RH.",
    pages: "12 points",
    category: "Paie & RH",
  },
  {
    icon: "📊",
    title: "Sortir la paie d'Excel",
    description: "Guide chiffré sur le coût réel d'une gestion de la paie sous Excel.",
    pages: "10 pages",
    category: "Paie & RH",
  },
  {
    icon: "📆",
    title: "Calendrier des obligations paie et sociales",
    description: "CNSS, AMO, IR : toutes les échéances sociales à connaître (sous réserve des textes en vigueur).",
    pages: "2 pages",
    category: "Paie & RH",
  },
  {
    icon: "✅",
    title: "Checklist clôture annuelle de la paie",
    description: "Les points de contrôle essentiels pour une clôture annuelle de paie sans erreur.",
    pages: "Checklist",
    category: "Paie & RH",
  },
];

function DownloadModal({ guideTitle, onClose }: { guideTitle: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEET_GUIDES_URL!, {
        method: "POST",
        body: JSON.stringify({ email, nom: name, guide: guideTitle }),
      });
    } catch (_) {
      // silently ignore network errors — still show confirmation
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 text-slate-400 hover:text-primary transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-primary mb-2">Vérifiez votre boîte mail !</h3>
            <p className="text-secondary text-sm">Le guide « {guideTitle} » vient de vous être envoyé par email.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-primary mb-1">Télécharger le guide</h3>
            <p className="text-secondary text-sm mb-6">« {guideTitle} » — recevez-le directement par email.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Votre nom et prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:border-cta"
              />
              <input
                type="email"
                placeholder="Votre email professionnel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:border-cta"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cta text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-60"
              >
                {loading ? "Envoi en cours..." : "Recevoir le guide par email"}
              </button>
              <p className="text-xs text-slate-400 text-center">
                En soumettant ce formulaire, vous acceptez de recevoir des communications de Thalès Informatique.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function GuidesErpClient() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  return (
    <main className="overflow-x-hidden bg-bg">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-primary" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <ChevronRight size={14} />
              <Link href="/ressources" className="hover:text-white transition-colors">Ressources</Link>
              <ChevronRight size={14} />
              <span className="text-accent">Guides ERP</span>
            </div>
            <span className="inline-block text-xs font-bold text-accent uppercase tracking-widest border border-accent/30 rounded-full px-3 py-1 mb-4">
              GUIDES
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Guides ERP
            </h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Cahiers des charges types et guides d&apos;audit pour votre projet ERP
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16" ref={contentRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Intro */}
            <div className="bg-white rounded-xl border border-border p-8 mb-12">
              <div className="flex items-start gap-4">
                <FileText size={32} className="text-cta shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-primary mb-2">Bibliothèque de guides pratiques</h2>
                  <p className="text-secondary leading-relaxed">
                    Thalès Informatique prépare actuellement une bibliothèque de guides pratiques pour aider les dirigeants et DSI marocains
                    à préparer, piloter et réussir leur projet ERP. Ces guides seront rédigés par nos ingénieurs experts et mis à jour
                    régulièrement pour refléter les dernières évolutions réglementaires et technologiques au Maroc et en Afrique.
                  </p>
                </div>
              </div>
            </div>

            {/* Guide Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {guides.map((guide, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="text-3xl mb-3">{guide.icon}</div>
                  <span className="text-xs font-semibold text-cta uppercase tracking-wide mb-2">{guide.category}</span>
                  <h3 className="text-base font-bold text-primary mb-2">{guide.title}</h3>
                  <p className="text-sm text-secondary mb-4 flex-1">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{guide.pages}</span>
                    {guide.available ? (
                      <button
                        onClick={() => setActiveGuide(guide.title)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-cta hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        <Download size={14} />
                        Télécharger
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                        <Download size={14} />
                        Bientôt disponible
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lead Capture */}
            <div className="bg-primary rounded-2xl p-8 md:p-12 mb-12">
              <div className="max-w-xl mx-auto text-center">
                <Mail size={32} className="text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Bientôt, vous pourrez télécharger nos guides</h3>
                <p className="text-white/60 mb-6">Notre bibliothèque de guides est en cours de préparation. Laissez-nous vos coordonnées pour être averti dès leur publication.</p>
                <form
                  onSubmit={(e) => { e.preventDefault(); setFormData({ name: "", email: "" }); }}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom et prénom"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-accent"
                    required
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-accent"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-cta text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    M&apos;avertir de la disponibilité
                  </button>
                </form>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <h3 className="text-xl font-bold text-primary mb-2">Besoin d&apos;un accompagnement personnalisé ?</h3>
              <p className="text-secondary mb-6">Nos consultants ERP sont disponibles pour vous guider dans votre projet.</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-cta text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contacter un expert
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {activeGuide && (
          <DownloadModal guideTitle={activeGuide} onClose={() => setActiveGuide(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
