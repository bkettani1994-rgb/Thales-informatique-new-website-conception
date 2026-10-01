"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, Award, BadgeCheck } from "lucide-react";

const awards = [
  {
    icon: Trophy,
    year: "2024",
    title: "Meilleure Dynamique Commerciale Maroc",
    image: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1790867839/thales_informatique_meilleure_dynamique_commerciale_maroc_sage_i6xiy2.webp",
  },
  {
    icon: Trophy,
    year: "2022",
    title: "Top League — Zone Export",
    image: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1790867840/thales_informatique_top_league_zone_export_sage_utoxwu.webp",
  },
  {
    icon: Medal,
    year: "2019",
    title: "Meilleure Croissance Sage",
    image: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1790867839/thales_informatique_meilleure_croissance_sage_jnoqmn.webp",
  },
  {
    icon: Award,
    year: "2019",
    title: "Customer Migration Journey",
    image: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1790867839/thales_informatique_customer_migration_journey_sage_fsjgfp.webp",
  },
  {
    icon: Star,
    year: "2018",
    title: "Meilleure Performance Sage",
    image: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1790867839/thales_informatique_meilleure_perofrmance_sage_hxig51.webp",
  },
  {
    icon: BadgeCheck,
    year: "2017",
    title: "Premier Partenaire North Africa",
    image: "https://res.cloudinary.com/dmutnjgp8/image/upload/v1790867840/thales_informatique_premier_partenaire_north_africa_sage_iasyxv.webp",
  },
];

export default function Awards() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50" id="trophees">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-8 bg-cta/40" />
            <span className="text-xs font-bold text-cta uppercase tracking-[0.2em]">
              Nos trophées &amp; distinctions
            </span>
            <span className="h-px w-8 bg-cta/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Une reconnaissance de notre <span className="text-cta">engagement</span>
          </h2>
          <p className="mt-4 text-base text-secondary max-w-xl mx-auto leading-relaxed">
            Ces distinctions témoignent de la confiance de nos partenaires et de notre engagement à offrir des solutions performantes et un accompagnement de qualité.
          </p>
        </motion.div>

        {/* Trophées sur socle + ligne du temps */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[760px]">
            <div className="flex items-end justify-center gap-6">
              {awards.map((award, i) => (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center"
                >
                  {/* Photo du trophée — à intégrer */}
                  <div className="relative w-full max-w-[170px] aspect-[3/4] mb-4">
                    {award.image ? (
                      <img
                        src={award.image}
                        alt={award.title}
                        className="w-full h-full object-contain drop-shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl border border-dashed border-cta/25 bg-white/60 flex flex-col items-center justify-center gap-2 text-cta/50">
                        <award.icon size={28} aria-hidden="true" />
                        <span className="text-[9px] font-medium text-center px-1 leading-tight">Photo trophée à ajouter</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ligne du temps */}
            <div className="relative flex items-start justify-center gap-6 pt-5">
              <div className="absolute left-0 right-0 top-0 h-px bg-slate-300" />
              {awards.map((award) => (
                <div key={award.title} className="flex-1 flex flex-col items-center text-center px-1">
                  <span className="w-2 h-2 rounded-full bg-cta -mt-1 mb-4" />
                  <span className="text-sm font-bold text-cta tracking-wide mb-1.5">{award.year}</span>
                  <p className="text-xs font-semibold text-primary leading-tight max-w-[120px]">{award.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
