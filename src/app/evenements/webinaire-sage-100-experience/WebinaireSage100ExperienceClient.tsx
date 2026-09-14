"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Calendar, Video, Users, CheckCircle2, ArrowRight, PlayCircle } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const changes = [
  {
    title: "Une nouvelle interface web, intuitive et épurée",
    desc: "Prise en main immédiate, accessible partout, à tout moment, dans le cloud sécurisé Microsoft Azure.",
  },
  {
    title: "Un assistant IA conversationnel",
    desc: "Posez vos questions en langage naturel et obtenez des réponses actionnables en temps réel, sans export ni requête complexe.",
  },
  {
    title: "Une personnalisation avancée",
    desc: "Des tableaux de bord, formulaires et workflows adaptés à vos métiers, sans développement spécifique.",
  },
  {
    title: "Une plateforme ouverte",
    desc: "Connectée à votre écosystème d'outils.",
  },
];

const takeaways = [
  "Une présentation en direct de la nouvelle interface web Sage 100 Expérience",
  "Une démonstration de l'assistant IA conversationnel intégré",
  "Les possibilités de personnalisation des tableaux de bord et workflows",
  "Un temps d'échange avec l'équipe Thalès Informatique pour répondre aux questions",
];

const REPLAY_SRC = "https://res.cloudinary.com/dmutnjgp8/video/upload/v1789382886/3578804153755530757_d6xmCRgf_o8bhvu.mp4";

export default function WebinaireSage100ExperienceClient() {
  const replayRef = useRef(null);
  const introRef = useRef(null);
  const changesRef = useRef(null);
  const takeawaysRef = useRef(null);
  const ctaRef = useRef(null);
  const replayInView = useInView(replayRef, { once: true, margin: "-100px" });
  const introInView = useInView(introRef, { once: true, margin: "-100px" });
  const changesInView = useInView(changesRef, { once: true, margin: "-100px" });
  const takeawaysInView = useInView(takeawaysRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <main className="overflow-x-hidden bg-bg">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/evenements" className="hover:text-white transition-colors">Événements</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page" className="text-accent">Webinaire Sage 100 Expérience</span>
          </nav>
          <span className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-4">
            Événement terminé · Compte-rendu
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl"
          >
            Sage 100 Expérience Édition : votre solution réinventée
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg text-white/70 max-w-2xl mb-8"
          >
            Retour sur notre webinaire consacré à la nouvelle interface web et à l&apos;assistant IA embarqué de Sage 100.
          </motion.p>
          <div className="flex flex-wrap gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2"><Calendar size={16} className="text-accent" aria-hidden="true" /> 9 septembre 2026 — 13h00 à 14h00</span>
            <span className="flex items-center gap-2"><Video size={16} className="text-accent" aria-hidden="true" /> En ligne</span>
            <span className="flex items-center gap-2"><Users size={16} className="text-accent" aria-hidden="true" /> Webinaire</span>
          </div>
        </div>
      </section>

      {/* Replay */}
      <section className="py-16 bg-white" ref={replayRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate={replayInView ? "visible" : "hidden"}>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-cta tracking-widest bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-4">
                <PlayCircle size={12} aria-hidden="true" />
                REPLAY
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Revoir le webinaire en entier</h2>
              <p className="text-secondary max-w-2xl mx-auto mt-3 leading-relaxed">
                Vous n&apos;avez pas pu assister en direct ? Retrouvez l&apos;intégralité du webinaire en replay ci-dessous.
              </p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-bg-base shadow-sm">
              <video
                src={REPLAY_SRC}
                title="Replay — Webinaire Sage 100 Expérience"
                controls
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              >
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16" ref={introRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate={introInView ? "visible" : "hidden"} className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-5">Ce qu&apos;il fallait retenir</h2>
            <p className="text-secondary leading-relaxed">
              Vous connaissez et utilisez Sage 100 au quotidien pour piloter votre activité. Le 9 septembre 2026, Thalès Informatique a présenté <strong className="text-primary">Sage 100 Expérience Édition</strong>, une nouvelle étape pensée pour vous faire gagner en simplicité, en agilité et en performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ce qui a été présenté */}
      <section className="py-16 bg-white" ref={changesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate={changesInView ? "visible" : "hidden"} className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">Ce qui change concrètement pour vous</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" animate={changesInView ? "visible" : "hidden"} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {changes.map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="flex items-start gap-3 p-5 bg-bg-base rounded-xl border border-border">
                <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <p data-ilink className="text-secondary text-sm mt-8 max-w-3xl mx-auto text-center">
            Envie d&apos;en savoir plus dès maintenant ? Découvrez <Link href="/solutions/sage-100-experience" className="text-cta font-semibold hover:underline">Sage 100 Expérience</Link>.
          </p>
        </div>
      </section>

      {/* Ce qui a été abordé pendant le webinaire */}
      <section className="py-16" ref={takeawaysRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate={takeawaysInView ? "visible" : "hidden"} className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">Au programme du webinaire</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" animate={takeawaysInView ? "visible" : "hidden"} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {takeaways.map((item) => (
              <motion.div key={item} variants={fadeUp} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border">
                <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-sm text-secondary leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate={ctaInView ? "visible" : "hidden"}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Vous avez manqué ce webinaire ?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Découvrez dès maintenant Sage 100 Expérience ou contactez nos équipes pour toute question.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/solutions/sage-100-experience"
                className="inline-flex items-center gap-2 bg-white text-cta font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Découvrir Sage 100 Expérience <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:border-white/50 transition-colors duration-200"
              >
                Nous contacter <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
