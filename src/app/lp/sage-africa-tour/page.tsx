import type { Metadata } from "next";
import SageAfricaTourClient from "./SageAfricaTourClient";

const SITE_URL = "https://thales.ma";
// [À VALIDER : image OG dédiée 1200x630 — logo Thalès utilisé en attendant]
const OG_IMAGE = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png";
const TITLE = "Sage Africa Tour Casablanca 2026 | Thalès Informatique";
const DESCRIPTION =
  "Réservez votre place au Sage Africa Tour Casablanca, le mardi 08 décembre 2026 au Carré d'Or — avec Thalès Informatique, partenaire Sage. Gratuit, places limitées.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/lp/sage-africa-tour" },
  // Page de destination (relais d'inscription) — non indexée, comme les autres landing pages du site.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: `${SITE_URL}/lp/sage-africa-tour`,
    siteName: "Thalès Informatique",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Sage Africa Tour — Thalès Informatique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return <SageAfricaTourClient />;
}
