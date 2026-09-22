"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Download, FileText, Mail } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const guides = [
  {
    icon: "📋",
    title: "Cahier des charges ERP",
    description: "Guide complet pour rédiger votre CDC avant consultation des éditeurs.",
    pages: "32 pages",
    category: "Finance & Opérations",
  },
  {
    icon: "🔍",
    title: "Guide d'audit des processus",
    description: "Méthodologie d'audit interne avant déploiement ERP.",
    pages: "24 pages",
    category: "Conseil",
  },
  {
    icon: "💰",
    title: "Calculateur ROI ERP",
    description: "Modèle Excel pour calculer le retour sur investissement de votre ERP.",
    pages: "12 pages",
    category: "Finance",
  },
  {
    icon: "👥",
    title: "Guide conduite du changement",
    description: "Accompagnement des équipes lors d'une transformation ERP.",
    pages: "28 pages",
    category: "RH",
  },
  {
    icon: "🏭",
    title: "Guide ERP industrie marocaine",
    description: "Spécificités sectorielles et meilleures pratiques pour l'industrie au Maroc et en Afrique.",
    pages: "40 pages",
    category: "Industrie",
  },
  {
    icon: "📊",
    title: "Benchmark ERP PME Maroc 2025",
    description: "Comparatif des solutions ERP pour PME au Maroc et en Afrique.",
    pages: "20 pages",
    category: "Stratégie",
  },
  {
    icon: "🔄",
    title: "Checklist migration de données ERP",
    description: "Inventaire, nettoyage, correspondance des champs et plan de bascule pour une migration sans risque.",
    pages: "16 pages",
    category: "Technique",
  },
  {
    icon: "🧾",
    title: "Guide facturation électronique au Maroc",
    description: "Comprendre l'obligation DGI et les étapes de mise en conformité pour votre entreprise.",
    pages: "18 pages",
    category: "Conformité",
  },
  {
    icon: "🔐",
    title: "Checklist sécurité & sauvegarde ERP",
    description: "Points de contrôle essentiels : accès par rôles, sauvegardes, plan de reprise d'activité.",
    pages: "14 pages",
    category: "Sécurité",
  },
  {
    icon: "🧑‍💼",
    title: "Guide SIRH & paie conforme Maroc",
    description: "Checklist de mise en conformité CNSS/AMO et fonctionnalités clés d'un bon SIRH.",
    pages: "22 pages",
    category: "RH",
  },
  {
    icon: "☁️",
    title: "Guide Cloud vs On-Premise",
    description: "Grille de décision factuelle : coûts, sécurité, autonomie IT et évolutivité pour choisir en connaissance de cause.",
    pages: "16 pages",
    category: "Technique",
  },
  {
    icon: "✅",
    title: "Checklist choix d'un intégrateur ERP",
    description: "Les bonnes questions à poser avant de signer : méthodologie, références, SLA et réversibilité.",
    pages: "12 pages",
    category: "Conseil",
  },
];

export default function GuidesErpClient() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true });
  const [formData, setFormData] = useState({ name: "", email: "" });

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
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                      <Download size={14} />
                      Bientôt disponible
                    </span>
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
    </main>
  );
}
