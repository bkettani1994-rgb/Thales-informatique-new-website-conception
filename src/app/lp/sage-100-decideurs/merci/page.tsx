import type { Metadata } from "next";
import MerciClient from "./MerciClient";

const SITE_URL = "https://thales.ma";
const OG_IMAGE = "https://res.cloudinary.com/dmutnjgp8/image/upload/v1780666585/thales_logo_bleu_petit_bjyxww.png";
const TITLE = "Demande envoyée | Thalès Informatique";
const DESCRIPTION = "Votre demande de démonstration Sage 100 a bien été envoyée à Thalès Informatique.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/lp/sage-100-decideurs/merci" },
  // Page de confirmation (post-conversion) — jamais indexée, sert uniquement
  // de cible d'URL pour le tracking de conversion LinkedIn Ads / GA4.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: `${SITE_URL}/lp/sage-100-decideurs/merci`,
    siteName: "Thalès Informatique",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 800, height: 800, alt: "Thalès Informatique" }],
  },
};

export default function Page() {
  return <MerciClient />;
}
