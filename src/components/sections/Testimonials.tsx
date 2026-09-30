"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export type Testimonial = {
  videoId: string;
  name: string;
  role: string;
  company: string;
  sector: string;
  quote: string;
  rating: number;
  accent: string;
  accentLight: string;
};

export const testimonials: Testimonial[] = [
  {
    videoId: "p1FgI3unv2Y",
    name: "M. Laurent Chevreau",
    role: "Directeur Général",
    company: "SOCIMAR",
    sector: "PME",
    quote: "Sage est une solution parfaitement adaptée aux besoins des PME. Nous avons opté pour Thalès Informatique pour la réactivité de ses collaborateurs qui sont extrêmement compétents.",
    rating: 5,
    accent: "from-blue-600 to-cyan-500",
    accentLight: "rgba(3,105,161,.15)",
  },
  {
    videoId: "2-XQ_MBOYKA",
    name: "M. Rachid Oueski",
    role: "DAF",
    company: "HEA Trade & Services",
    sector: "Services",
    quote: "Thalès Informatique nous accompagne dans la mise à jour de notre solution dans les meilleures conditions en termes de délai et de qualité.",
    rating: 5,
    accent: "from-violet-600 to-purple-500",
    accentLight: "rgba(124,58,237,.15)",
  },
  {
    videoId: "JeQ1FB2e-7E",
    name: "M. Noureddine Gnaou",
    role: "PDG",
    company: "SOREMAR GROUP",
    sector: "Industrie",
    quote: "Être entouré par des consultants expérimentés signifie que nous pouvons toujours trouver des solutions. Le produit est parfait ! Notre coopération tourne très bien sur tous les points de vue avec Thalès.",
    rating: 5,
    accent: "from-emerald-600 to-teal-500",
    accentLight: "rgba(5,150,105,.15)",
  },
  {
    videoId: "lw9nXN4xwFI",
    name: "Mme Ahlam Kadim",
    role: "EM",
    company: "POLLUCLEAN",
    sector: "Environnement",
    quote: "L'acquisition de la solution Sage depuis sa première version 7 jusqu'à la mise à jour vers la version 100c était une décision stratégique pour nous aider à développer notre chiffre d'affaires et dématérialiser nos processus.",
    rating: 5,
    accent: "from-amber-500 to-orange-400",
    accentLight: "rgba(217,119,6,.15)",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-md" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Témoignage client"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </motion.div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 cursor-pointer z-10"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Testimonials({
  items = testimonials,
  title = "Nos clients témoignent en vidéo",
  subtitle = "Écoutez directement nos clients partager leur expérience avec Thalès Informatique.",
}: { items?: Testimonial[]; title?: string; subtitle?: string }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setItemsPerView(3);
      else if (w >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = Math.max(1, items.length - itemsPerView + 1);

  useEffect(() => {
    if (current > pages - 1) setCurrent(pages - 1);
  }, [pages, current]);

  const scrollToIndex = (index: number) => {
    setCurrent(index);
    if (!trackRef.current) return;
    const card = trackRef.current.children[index] as HTMLElement;
    if (card) {
      trackRef.current.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
  };

  const prev = () => scrollToIndex((current - 1 + pages) % pages);
  const next = () => scrollToIndex((current + 1) % pages);

  return (
    <>
      {activeVideo && (
        <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <section className="py-24 bg-cta relative overflow-hidden" id="temoignages">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-semibold text-accent uppercase tracking-widest mb-3">
              Témoignages vidéo
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="mt-4 text-base text-white/65 max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {/* Carousel track */}
          <div className="relative">
            <div
              ref={trackRef}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.map((t) => (
                <div
                  key={t.videoId}
                  className="group relative bg-primary/20 border border-white/15 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 flex-shrink-0 snap-start
                    w-[80vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
                >
                  {/* Accent glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${t.accentLight} 0%, transparent 70%)` }}
                  />

                  {/* Video thumbnail */}
                  <div
                    className="relative h-48 overflow-hidden cursor-pointer"
                    onClick={() => setActiveVideo(t.videoId)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${t.videoId}/maxresdefault.jpg`}
                      alt={`Témoignage ${t.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-60`} />
                    <div className="absolute inset-0 bg-primary/30" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {t.sector}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.accent} flex items-center justify-center shadow-2xl cursor-pointer`}
                      >
                        <Play size={20} className="fill-white text-white ml-1" />
                      </motion.div>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      ▶ Voir le témoignage
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <StarRating count={t.rating} />
                      <Quote size={18} className="text-white/25" />
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3 italic">
                      "{t.quote}"
                    </p>
                    <div className="h-px bg-white/15 mb-4" />
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.accent} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-xs">
                          {t.name.replace("M. ", "").replace("Mme ", "").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white text-sm font-semibold leading-tight truncate">{t.name}</div>
                        <div className="text-white/60 text-xs leading-tight truncate">{t.role} · {t.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/25 hover:border-white/50 bg-primary/15 hover:bg-primary/30 flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
                aria-label="Précédent"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      i === current
                        ? "w-6 h-2 bg-white"
                        : "w-2 h-2 bg-white/35 hover:bg-white/60"
                    }`}
                    aria-label={`Témoignage ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/25 hover:border-white/50 bg-primary/15 hover:bg-primary/30 flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
                aria-label="Suivant"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-10"
          >
            <p className="text-white/55 text-sm mb-4">
              Rejoignez plus de <span className="text-white font-semibold">500 entreprises</span> qui nous font confiance
            </p>
            <a
              href="/references/temoignages"
              className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white/85 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer hover:bg-primary/15"
            >
              Voir tous les témoignages →
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
